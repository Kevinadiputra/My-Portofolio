"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    Briefcase,
    GraduationCap,
    Cpu,
    User,
    Settings,
    Inbox,
    ExternalLink,
    Menu,
    X,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/projects", label: "Projects", icon: FolderKanban },
    { href: "/admin/certificates", label: "Certificates", icon: Award },
    { href: "/admin/experience", label: "Experience", icon: Briefcase },
    { href: "/admin/education", label: "Education", icon: GraduationCap },
    { href: "/admin/skills", label: "Skills", icon: Cpu },
    { href: "/admin/messages", label: "Messages", icon: Inbox },
    { href: "/admin/profile", label: "Profile", icon: User },
    { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

export default function AdminShell({ children }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    if (pathname === "/admin/login") {
        return children;
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-top">
                    <div>
                        <div className="admin-eyebrow">KEVIN ADIPUTRA / CMS</div>
                        <Link href="/admin" className="admin-brand">
                            Portfolio Control
                        </Link>
                    </div>
                    <button
                        type="button"
                        className="admin-mobile-toggle"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? "Tutup menu navigasi admin" : "Buka menu navigasi admin"}
                    >
                        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>

                <div className={`admin-sidebar-collapsible ${mobileOpen ? "is-open" : ""}`}>
                    <nav aria-label="Admin navigation" className="admin-nav">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.exact
                                ? pathname === item.href
                                : pathname === item.href || pathname.startsWith(`${item.href}/`);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={isActive ? "is-active" : ""}
                                >
                                    <span className="inline-flex items-center gap-2.5">
                                        <Icon size={15} />
                                        <span>{item.label}</span>
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="admin-sidebar-footer">
                        <Link
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-public-link"
                        >
                            <span>View public site</span>
                            <ExternalLink size={13} />
                        </Link>
                        <AdminLogoutButton />
                    </div>
                </div>
            </aside>
            <main className="admin-content">{children}</main>
        </div>
    );
}
