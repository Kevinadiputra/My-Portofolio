"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default function AdminShell({ children }) {
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return children;
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div>
                    <div className="admin-eyebrow">KEVIN / CMS</div>
                    <Link href="/admin" className="admin-brand">Portfolio control</Link>
                </div>

                <nav aria-label="Admin navigation" className="admin-nav">
                    <Link href="/admin">Dashboard</Link>
                    <Link href="/admin/projects">Projects</Link>
                    <Link href="/admin/certificates">Certificates</Link>
                    <Link href="/admin/experience">Experience</Link>
                    <Link href="/admin/education">Education</Link>
                    <Link href="/admin/skills">Skills</Link>
                    <Link href="/admin/profile">Profile</Link>
                    <Link href="/admin/settings">Site settings</Link>
                </nav>

                <AdminLogoutButton />
            </aside>
            <main className="admin-content">{children}</main>
        </div>
    );
}
