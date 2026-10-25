import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin-auth";
import {
    getAdminCollection,
    normalizeAdminPayload,
    validateAdminPayload,
} from "@/lib/admin-content";

function authError(status) {
    if (status === "configuration") {
        return NextResponse.json({ error: "Admin is not configured." }, { status: 503 });
    }
    if (status === "unauthenticated") {
        return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
}

async function getContext() {
    const context = await getAdminContext();
    if (context.status !== "authorized") return { response: authError(context.status) };
    return { context };
}

export async function GET(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.trim();
    const status = searchParams.get("status");
    const page = Math.max(Number(searchParams.get("page") || 1), 1);
    const pageSize = Math.min(Math.max(Number(searchParams.get("pageSize") || 20), 1), 100);

    let builder = context.supabase.from(config.table).select("*", { count: "exact" });

    if (query) builder = builder.ilike(config.searchField, `%${query}%`);
    if (status === "published" || status === "draft") builder = builder.eq("is_published", status === "published");
    if (config.orderField) builder = builder.order(config.orderField, { ascending: true });
    builder = builder.order("updated_at", { ascending: false });

    if (!config.singleton) {
        builder = builder.range((page - 1) * pageSize, page * pageSize - 1);
    }

    const { data, error, count } = await builder;
    if (error) return NextResponse.json({ error: "Unable to load content." }, { status: 500 });

    return NextResponse.json({ data: data || [], count: count || 0, page, pageSize });
}

export async function POST(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });

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
            const message = error.code === "23505" ? "A record with this unique value already exists." : "Unable to save content.";
            return NextResponse.json({ error: message }, { status: 400 });
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
    }
}

export async function PATCH(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });

    try {
        const body = await request.json();
        if (!config.singleton && !body.id) return NextResponse.json({ error: "Record id is required." }, { status: 400 });
        const payload = normalizeAdminPayload(collection, body);
        const validationError = validateAdminPayload(collection, payload);
        if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

        const query = context.supabase.from(config.table).update(payload);
        if (config.singleton) query.eq("id", true);
        else query.eq("id", body.id);
        const { data, error } = await query.select().single();

        if (error) return NextResponse.json({ error: "Unable to update content." }, { status: 400 });
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    const { response, context } = await getContext();
    if (response) return response;

    const { collection } = await params;
    const config = getAdminCollection(collection);
    if (!config) return NextResponse.json({ error: "Unknown collection." }, { status: 404 });
    if (config.singleton) return NextResponse.json({ error: "Singleton records cannot be deleted." }, { status: 400 });

    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "Record id is required." }, { status: 400 });

    const { error } = await context.supabase.from(config.table).delete().eq("id", body.id);
    if (error) return NextResponse.json({ error: "Unable to delete content." }, { status: 400 });
    return NextResponse.json({ ok: true });
}
