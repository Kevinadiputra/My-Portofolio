import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin-auth";
import {
    getAdminCollection,
    normalizeAdminPayload,
    validateAdminPayload,
} from "@/lib/admin-content";

function authError(status) {
    if (status === "configuration") {
        return NextResponse.json({ error: "Admin belum dikonfigurasi pada environment server." }, { status: 503 });
    }
    if (status === "unauthenticated") {
        return NextResponse.json({ error: "Sesi autentikasi diperlukan. Silakan login kembali." }, { status: 401 });
    }
    return NextResponse.json({ error: "Akses ditolak. Hanya akun admin yang diizinkan." }, { status: 403 });
}

async function getContext() {
    const context = await getAdminContext();
    if (context.status !== "authorized") return { response: authError(context.status) };
    return { context };
}

function extractStoragePath(url) {
    if (!url || typeof url !== "string") return null;
    const marker = "/storage/v1/object/public/portfolio-media/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
}

function collectMediaPaths(row) {
    if (!row || typeof row !== "object") return [];
    const candidates = [
        row.thumbnail_url,
        row.image_url,
        row.logo_url,
        row.profile_photo_url,
        row.cv_url,
        row.favicon_url,
        row.og_image_url,
        row.certificate_image_url,
        row.evidence_image_url,
        ...(Array.isArray(row.gallery_urls) ? row.gallery_urls : []),
        ...(Array.isArray(row.gallery)
            ? row.gallery.map((g) => (typeof g === "string" ? g : g?.url || g?.media_url))
            : []),
    ];
    return candidates.map(extractStoragePath).filter(Boolean);
}

function revalidatePublicPortfolio(slug = null) {
    try {
        revalidatePath("/", "layout");
        revalidatePath("/");
        revalidatePath("/projects/[slug]", "page");
        revalidatePath("/experience/[slug]", "page");
        if (slug) {
            revalidatePath(`/projects/${slug}`);
            revalidatePath(`/experience/${slug}`);
        }
        revalidatePath("/sitemap.xml");
    } catch {
        // Revalidation is best-effort in non-request contexts
    }
}

export async function GET(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Koleksi konten tidak ditemukan." }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim();
    const status = searchParams.get("status");
    const category = searchParams.get("category")?.trim();
    const level = searchParams.get("level")?.trim();
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || 15), 1), 100);

    let builder = context.supabase.from(config.table).select("*", { count: "exact" });

    if (query) builder = builder.ilike(config.searchField, `%${query}%`);
    if (status === "published" || status === "draft") {
        builder = builder.eq("is_published", status === "published");
    }
    if (category && category !== "all") {
        builder = builder.eq("category", category);
    }
    if (level && level !== "all") {
        builder = builder.eq("level", level);
    }
    if (config.orderField) builder = builder.order(config.orderField, { ascending: true });
    builder = builder.order("updated_at", { ascending: false });

    if (!config.singleton) {
        builder = builder.range((page - 1) * pageSize, page * pageSize - 1);
    }

    const { data, error, count } = await builder;
    if (error) {
        const errorMsg =
            error.code === "PGRST205" || error.code === "42P01"
                ? `Tabel database '${config.table}' belum tersedia di Supabase. Jalankan file migrasi SQL di Supabase SQL Editor.`
                : "Gagal memuat data dari database.";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }

    return NextResponse.json(
        {
            data: data || [],
            count: count || 0,
            page,
            pageSize,
            totalPages: config.singleton ? 1 : Math.max(Math.ceil((count || 0) / pageSize), 1),
        },
        {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        }
    );
}

export async function POST(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Koleksi konten tidak ditemukan." }, { status: 404 });

    try {
        const body = await request.json();
        const payload = normalizeAdminPayload(collection, body);
        const validationError = validateAdminPayload(collection, payload);
        if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

        const query = config.singleton
            ? context.supabase.from(config.table).upsert(payload, { onConflict: "id" }).select().single()
            : context.supabase.from(config.table).insert(payload).select().single();
        const { data, error } = await query;

        if (error) {
            const message =
                error.code === "23505"
                    ? "Data dengan nilai unik yang sama (seperti slug atau judul) sudah terdaftar."
                    : error.code === "PGRST205" || error.code === "42P01"
                    ? `Tabel database '${config.table}' belum tersedia di Supabase. Jalankan file migrasi SQL terlebih dahulu.`
                    : "Gagal menyimpan data ke database.";
            return NextResponse.json({ error: message }, { status: 400 });
        }

        revalidatePublicPortfolio(data?.slug);
        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Permintaan tidak valid." },
            { status: 400 }
        );
    }
}

export async function PATCH(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Koleksi konten tidak ditemukan." }, { status: 404 });

    try {
        const body = await request.json();
        if (!config.singleton && !body.id) {
            return NextResponse.json({ error: "ID record diperlukan untuk pembaruan." }, { status: 400 });
        }

        // Verify record exists and track previous slug if updating a project
        let existingRecord = null;
        if (!config.singleton) {
            const { data: found, error: findError } = await context.supabase
                .from(config.table)
                .select("*")
                .eq("id", body.id)
                .maybeSingle();

            if (findError || !found) {
                return NextResponse.json({ error: "Record yang akan diperbarui tidak ditemukan." }, { status: 404 });
            }
            existingRecord = found;
        }

        const payload = normalizeAdminPayload(collection, {
            ...(existingRecord || {}),
            ...body,
        });
        const validationError = validateAdminPayload(collection, payload);
        if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

        if (
            collection === "projects" &&
            existingRecord?.slug &&
            payload.slug &&
            existingRecord.slug !== payload.slug
        ) {
            const prev = Array.isArray(existingRecord.previous_slugs) ? existingRecord.previous_slugs : [];
            payload.previous_slugs = Array.from(new Set([...prev, existingRecord.slug])).filter(
                (s) => s !== payload.slug
            );
        }

        let data;
        let error;

        if (config.singleton) {
            const res = await context.supabase
                .from(config.table)
                .upsert({ ...payload, id: true }, { onConflict: "id" })
                .select()
                .single();
            data = res.data;
            error = res.error;
        } else {
            const res = await context.supabase
                .from(config.table)
                .update(payload)
                .eq("id", body.id)
                .select()
                .single();
            data = res.data;
            error = res.error;
        }

        if (error) {
            const message =
                error.code === "23505"
                    ? "Slug atau kombinasi unik sudah digunakan oleh record lain."
                    : "Gagal memperbarui konten di database.";
            return NextResponse.json({ error: message }, { status: 400 });
        }

        revalidatePublicPortfolio(data?.slug || existingRecord?.slug);
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Permintaan tidak valid." },
            { status: 400 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Koleksi konten tidak ditemukan." }, { status: 404 });
    if (config.singleton) {
        return NextResponse.json({ error: "Record pengaturan tunggal tidak dapat dihapus." }, { status: 400 });
    }

    try {
        const body = await request.json();
        if (!body.id) return NextResponse.json({ error: "ID record diperlukan." }, { status: 400 });

        const { data: existingRecord, error: findError } = await context.supabase
            .from(config.table)
            .select("*")
            .eq("id", body.id)
            .maybeSingle();

        if (findError || !existingRecord) {
            return NextResponse.json({ error: "Record tidak ditemukan." }, { status: 404 });
        }

        const { error } = await context.supabase.from(config.table).delete().eq("id", body.id);
        if (error) return NextResponse.json({ error: "Gagal menghapus konten." }, { status: 400 });

        // Clean up associated storage objects if they were uploaded to portfolio-media bucket
        const mediaPaths = collectMediaPaths(existingRecord);
        if (mediaPaths.length > 0) {
            await context.supabase.storage.from("portfolio-media").remove(mediaPaths);
        }

        revalidatePublicPortfolio(existingRecord?.slug);
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Permintaan penghapusan tidak valid." }, { status: 400 });
    }
}
