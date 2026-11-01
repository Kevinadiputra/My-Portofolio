import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin-auth";

const STATUSES = new Set(["new", "read", "archived"]);

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

const noStore = { "Cache-Control": "no-store, max-age=0" };

export async function GET(request) {
    const { response, context } = await getContext();
    if (response) return response;

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const query = searchParams.get("q")?.trim();
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || 20), 1), 100);

    let builder = context.supabase
        .from("contact_messages")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    if (status && status !== "all" && STATUSES.has(status)) {
        builder = builder.eq("status", status);
    }

    if (query) {
        builder = builder.or(
            `name.ilike.%${query}%,email.ilike.%${query}%,subject.ilike.%${query}%,message.ilike.%${query}%`
        );
    }

    builder = builder.range((page - 1) * pageSize, page * pageSize - 1);

    const [{ data, error, count }, newCount, readCount, archivedCount] = await Promise.all([
        builder,
        context.supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("status", "new"),
        context.supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("status", "read"),
        context.supabase
            .from("contact_messages")
            .select("id", { count: "exact", head: true })
            .eq("status", "archived"),
    ]);

    if (error) {
        return NextResponse.json({ error: "Gagal memuat pesan masuk." }, { status: 500, headers: noStore });
    }

    const total = count || 0;

    return NextResponse.json(
        {
            data: data || [],
            count: total,
            page,
            pageSize,
            totalPages: Math.max(Math.ceil(total / pageSize), 1),
            counts: {
                new: newCount.count || 0,
                read: readCount.count || 0,
                archived: archivedCount.count || 0,
                total: (newCount.count || 0) + (readCount.count || 0) + (archivedCount.count || 0),
            },
        },
        { headers: noStore }
    );
}

export async function PATCH(request) {
    const { response, context } = await getContext();
    if (response) return response;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
    }

    if (!body?.id) {
        return NextResponse.json({ error: "ID pesan diperlukan." }, { status: 400 });
    }

    if (!STATUSES.has(body.status)) {
        return NextResponse.json({ error: "Status pesan tidak dikenali." }, { status: 400 });
    }

    const { data, error } = await context.supabase
        .from("contact_messages")
        .update({
            status: body.status,
            read_at: body.status === "new" ? null : new Date().toISOString(),
        })
        .eq("id", body.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: "Gagal memperbarui status pesan." }, { status: 400 });
    }

    return NextResponse.json({ data }, { headers: noStore });
}

export async function DELETE(request) {
    const { response, context } = await getContext();
    if (response) return response;

    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
    }

    if (!body?.id) {
        return NextResponse.json({ error: "ID pesan diperlukan." }, { status: 400 });
    }

    const { error } = await context.supabase.from("contact_messages").delete().eq("id", body.id);
    if (error) {
        return NextResponse.json({ error: "Gagal menghapus pesan." }, { status: 400 });
    }

    return NextResponse.json({ ok: true }, { headers: noStore });
}
