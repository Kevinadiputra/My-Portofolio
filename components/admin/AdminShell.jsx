"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    Award,
    Briefcase,
    GraduationCap,
    Trophy,
    User,
    Settings,
    Inbox,
    ExternalLink,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Shield,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const NAV_GROUPS = [
    {
        title: "OVERVIEW",
        items: [
            { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
        ],
    },
    {
        title: "PORTFOLIO CONTENT",
        items: [
            { href: "/admin/projects", label: "Projects", icon: FolderKanban },
            { href: "/admin/certificates", label: "Certificates", icon: Award },
            { href: "/admin/experience", label: "Experience", icon: Briefcase },
            { href: "/admin/education", label: "Education", icon: GraduationCap },
            { href: "/admin/achievements", label: "Achievements", icon: Trophy },
        ],
    },
    {
        title: "COMMUNICATION",
        items: [
            { href: "/admin/messages", label: "Messages", icon: Inbox },
        ],
    },
    {
        title: "CONFIGURATION",
        items: [
            { href: "/admin/profile", label: "Profile", icon: User },
            { href: "/admin/settings", label: "Site Settings", icon: Settings },
        ],
    },
];

export default function AdminShell({ children }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        try {
            const saved = localStorage.getItem("portfolio_admin_sidebar_collapsed");
            if (saved !== null) {
                setCollapsed(saved === "true");
            }
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    function toggleCollapse() {
        setCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("portfolio_admin_sidebar_collapsed", String(next));
            } catch {
                // Ignore
            }
            return next;
        });
    }

    if (pathname === "/admin/login") {
        return children;
    }

    return (
        <div className={`admin-shell ${collapsed ? "is-sidebar-collapsed" : ""}`}>
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    className="admin-mobile-backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""}`}>
                <div className="admin-sidebar-top">
                    <div className="admin-sidebar-brand-wrap">
                        <div className="admin-eyebrow">CONTROL ROOM</div>
                        <Link href="/admin" className="admin-brand">
                            {collapsed ? "KP" : "Portfolio CMS"}
                        </Link>
                    </div>

                    <div className="flex items-center gap-1">
                        {/* Desktop collapse toggle */}
                        <button
                            type="button"
                            className="admin-collapse-toggle hidden lg:inline-flex"
                            onClick={toggleCollapse}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        >
                            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                        </button>

                        {/* Mobile close toggle */}
                        <button
                            type="button"
                            className="admin-mobile-toggle lg:hidden"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            aria-expanded={mobileOpen}
                            aria-label={mobileOpen ? "Tutup menu navigasi admin" : "Buka menu navigasi admin"}
                        >
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                <div className={`admin-sidebar-collapsible ${mobileOpen ? "is-open" : ""}`}>
                    <nav aria-label="Admin navigation" className="admin-nav-groups">
                        {NAV_GROUPS.map((group) => (
                            <div key={group.title} className="admin-nav-group">
                                {!collapsed && (
                                    <div className="admin-nav-group-title">{group.title}</div>
                                )}
                                <div className="admin-nav-items">
                                    {group.items.map((item) => {
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
                                                className={`admin-nav-link ${isActive ? "is-active" : ""}`}
                                                title={collapsed ? item.label : undefined}
                                            >
                                                <span className="admin-nav-link-inner">
                                                    <Icon size={16} className="shrink-0" />
                                                    {!collapsed && (
                                                        <span className="admin-nav-label truncate">
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className="admin-sidebar-footer">
                        {/* Admin Identity Card */}
                        {!collapsed ? (
                            <div className="admin-user-card">
                                <div className="admin-user-avatar">KA</div>
                                <div className="admin-user-info truncate">
                                    <div className="admin-user-name truncate">Kevin Adiputra</div>
                                    <div className="admin-user-role">
                                        <Shield size={10} className="inline mr-1 text-accent" />
                                        Owner & Admin
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="admin-user-avatar-collapsed" title="Kevin Adiputra (Owner & Admin)">
                                KA
                            </div>
                        )}

                        <Link
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-public-link"
                            title={collapsed ? "View public portfolio" : undefined}
                        >
                            {!collapsed && <span>View Public Site</span>}
                            <ExternalLink size={13} className="shrink-0" />
                        </Link>

                        <AdminLogoutButton collapsed={collapsed} />
                    </div>
                </div>
            </aside>

            {/* Mobile Header Bar */}
            <div className="admin-mobile-bar lg:hidden">
                <button
                    type="button"
                    className="admin-mobile-toggle-btn"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation menu"
                >
                    <Menu size={20} />
                </button>
                <Link href="/admin" className="font-display font-bold text-white text-sm">
                    Portfolio CMS
                </Link>
                <div className="w-8" />
            </div>

            <main className="admin-content">{children}</main>
        </div>
    );
}
