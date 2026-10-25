"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        router.replace("/admin/login");
        router.refresh();
    }

    return (
        <button type="button" className="admin-logout" onClick={handleLogout}>
            Log out
        </button>
    );
}
