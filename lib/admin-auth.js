import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminContext() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
        return { status: "configuration" };
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { status: "unauthenticated" };
    }

    const { data: adminProfile, error } = await supabase
        .from("admin_profiles")
        .select("user_id, role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

    if (error || !adminProfile) {
        return { status: "unauthorized" };
    }

    return { status: "authorized", supabase, user };
}

export async function requireAdmin() {
    const context = await getAdminContext();

    if (context.status === "configuration") {
        redirect("/admin/login?error=configuration");
    }

    if (context.status === "unauthenticated") {
        redirect("/admin/login");
    }

    if (context.status === "unauthorized") {
        redirect("/admin/login?error=unauthorized");
    }

    return context;
}
