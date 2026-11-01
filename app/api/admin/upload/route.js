import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
    ["image/jpeg", "jpg"],
    ["image/png", "png"],
    ["image/webp", "webp"],
    ["image/svg+xml", "svg"],
    ["application/pdf", "pdf"],
]);

function extractStoragePath(url) {
    if (!url || typeof url !== "string") return null;
    const marker = "/storage/v1/object/public/portfolio-media/";
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(url.slice(idx + marker.length));
}

export async function POST(request) {
    const context = await getAdminContext();
    if (context.status !== "authorized") {
        const status =
            context.status === "configuration"
                ? 503
                : context.status === "unauthenticated"
                ? 401
                : 403;
        return NextResponse.json({ error: "Akses admin diperlukan untuk mengunggah file." }, { status });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const previousUrl = formData.get("previousUrl");
        const folder =
            String(formData.get("folder") || "general")
                .replace(/[^a-z0-9/_-]/gi, "")
                .slice(0, 40) || "general";

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "File tidak ditemukan dalam permintaan." }, { status: 400 });
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json(
                { error: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, SVG, atau PDF." },
                { status: 400 }
            );
        }

        if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "Ukuran file maksimal adalah 5 MB." },
                { status: 400 }
            );
        }

        const safeExtension = ALLOWED_TYPES.get(file.type) || "bin";
        const path = `${folder}/${crypto.randomUUID()}.${safeExtension}`;
        const { error } = await context.supabase.storage
            .from("portfolio-media")
            .upload(path, file, { contentType: file.type, upsert: false });

        if (error) {
            return NextResponse.json(
                { error: "Gagal mengunggah file ke Supabase Storage. Pastikan bucket 'portfolio-media' tersedia." },
                { status: 400 }
            );
        }

        // Safely remove old storage file if replaced
        const oldStoragePath = extractStoragePath(previousUrl);
        if (oldStoragePath && oldStoragePath !== path) {
            await context.supabase.storage.from("portfolio-media").remove([oldStoragePath]);
        }

        const { data } = context.supabase.storage.from("portfolio-media").getPublicUrl(path);
        return NextResponse.json({ url: data.publicUrl, path });
    } catch {
        return NextResponse.json({ error: "Terjadi kesalahan saat memproses unggahan file." }, { status: 400 });
    }
}
