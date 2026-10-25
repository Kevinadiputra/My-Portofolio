import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function proxy(request) {
    const response = await updateSupabaseSession(request);

    if (!request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname === "/admin/login") {
        return response;
    }

    return response;
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
