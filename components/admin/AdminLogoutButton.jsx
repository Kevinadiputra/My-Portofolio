"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    async function handleLogout() {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            const supabase = createSupabaseBrowserClient();
            await supabase.auth.signOut();
        } catch {
            // Proceed to login redirect even if network fails
        } finally {
            router.replace("/admin/login");
            router.refresh();
            setIsLoggingOut(false);
        }
    }

    return (
        <button
            type="button"
            className="admin-logout"
            onClick={handleLogout}
            disabled={isLoggingOut}
        >
            <span className="inline-flex items-center gap-2.5">
                <LogOut size={15} />
                <span>{isLoggingOut ? "Signing out…" : "Logout"}</span>
            </span>
        </button>
    );
}
