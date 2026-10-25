import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin-auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "application/pdf",
]);

export async function POST(request) {
    const context = await getAdminContext();
    if (context.status !== "authorized") {
        const status = context.status === "configuration" ? 503 : context.status === "unauthenticated" ? 401 : 403;
        return NextResponse.json({ error: "Admin access required." }, { status });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "general").replace(/[^a-z0-9/_-]/gi, "").slice(0, 40) || "general";

    if (!(file instanceof File)) return NextResponse.json({ error: "A file is required." }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Unsupported file type." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Files must be 5 MB or smaller." }, { status: 400 });

    const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "bin";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await context.supabase.storage
        .from("portfolio-media")
        .upload(path, file, { contentType: file.type, upsert: false });

    if (error) return NextResponse.json({ error: "Unable to upload file." }, { status: 400 });

    const { data } = context.supabase.storage.from("portfolio-media").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path });
}
