import Link from "next/link";
import {
    FolderKanban,
    Award,
    Briefcase,
    GraduationCap,
    Trophy,
    Inbox,
    Plus,
    FileCheck,
    FileEdit,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminContentSnapshot } from "@/lib/admin-data";
import AdminSeedButton from "@/components/admin/AdminSeedButton";

export default async function AdminDashboardPage() {
    const { supabase, user } = await requireAdmin();
    const snapshot = await getAdminContentSnapshot(supabase);
    const hasData =
        snapshot.projects.total > 0 ||
        snapshot.certificates.total > 0 ||
        snapshot.experience.total > 0 ||
        (snapshot.achievements?.total ?? 0) > 0;

    const totalContentItems =
        snapshot.projects.total +
        snapshot.certificates.total +
        snapshot.experience.total +
        snapshot.education.total +
        (snapshot.achievements?.total ?? 0);

    const totalPublishedItems =
        snapshot.projects.published +
        snapshot.certificates.published +
        snapshot.experience.published +
        snapshot.education.published +
        (snapshot.achievements?.published ?? 0);

    return (
        <div className="admin-page">
            {/* Header */}
            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">SYSTEM / DASHBOARD OVERVIEW</div>
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">
                        Pusat kendali dan status seluruh konten portofolio. Terautentikasi sebagai{" "}
                        <span className="text-accent font-mono text-xs">{user.email}</span>.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link href="/admin/projects?new=1" className="admin-primary-action">
                        <Plus size={14} />
                        <span>Add Project</span>
                    </Link>
                    <Link href="/admin/achievements?new=1" className="admin-secondary-action">
                        <Plus size={14} />
                        <span>Add Achievement</span>
                    </Link>
                </div>
            </header>

            {/* Quick Actions Bar */}
            <section className="admin-quick-actions-bar" aria-label="Quick Actions">
                <span className="admin-quick-actions-label">Quick Actions:</span>
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/projects?new=1" className="admin-quick-chip">
                        <FolderKanban size={13} className="text-accent" />
                        <span>+ Project</span>
                    </Link>
                    <Link href="/admin/certificates?new=1" className="admin-quick-chip">
                        <Award size={13} className="text-accent" />
                        <span>+ Certificate</span>
                    </Link>
                    <Link href="/admin/experience?new=1" className="admin-quick-chip">
                        <Briefcase size={13} className="text-accent" />
                        <span>+ Experience</span>
                    </Link>
                    <Link href="/admin/achievements?new=1" className="admin-quick-chip">
                        <Trophy size={13} className="text-accent" />
                        <span>+ Achievement</span>
                    </Link>
                    <Link href="/admin/education?new=1" className="admin-quick-chip">
                        <GraduationCap size={13} className="text-accent" />
                        <span>+ Education</span>
                    </Link>
                </div>
            </section>

            {/* 6 Key Metrics Grid */}
            <section className="admin-stat-grid mt-4" aria-label="Content statistics">
                <Stat
                    icon={FolderKanban}
                    label="Projects"
                    value={snapshot.projects.total}
                    meta={`${snapshot.projects.published} published · ${snapshot.projects.featured} featured`}
                    href="/admin/projects"
                    accent={snapshot.projects.total > 0}
                />
                <Stat
                    icon={Award}
                    label="Certificates"
                    value={snapshot.certificates.total}
                    meta={`${snapshot.certificates.published} published`}
                    href="/admin/certificates"
                    accent={snapshot.certificates.total > 0}
                />
                <Stat
                    icon={Briefcase}
                    label="Experience"
                    value={snapshot.experience.total}
                    meta={`${snapshot.experience.published} published`}
                    href="/admin/experience"
                    accent={snapshot.experience.total > 0}
                />
                <Stat
                    icon={GraduationCap}
                    label="Education"
                    value={snapshot.education.total}
                    meta={`${snapshot.education.published} published`}
                    href="/admin/education"
                    accent={snapshot.education.total > 0}
                />
                <Stat
                    icon={Trophy}
                    label="Achievements"
                    value={snapshot.achievements?.total ?? 0}
                    meta={`${snapshot.achievements?.published ?? 0} published · ${snapshot.achievements?.featured ?? 0} featured`}
                    href="/admin/achievements"
                    accent={(snapshot.achievements?.total ?? 0) > 0}
                />
                <Stat
                    icon={Inbox}
                    label="Messages"
                    value={snapshot.messages.total}
                    meta={`${snapshot.messages.unread} unread inquiries`}
                    href="/admin/messages"
                    alert={snapshot.messages.unread > 0}
                />
            </section>

            {/* Content Overview & Recent Activity Grid */}
            <section className="admin-dashboard-grid mt-6">
                {/* Recent Activity Feed */}
                <div className="admin-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <div className="admin-eyebrow">ACTIVITY LOG</div>
                            <h2 className="admin-panel-title">Recent Content Changes</h2>
                        </div>
                        <span className="text-xs font-mono text-white/40">Latest 8 updates</span>
                    </div>

                    {snapshot.recentChanges.length ? (
                        <ul className="admin-change-list">
                            {snapshot.recentChanges.map((item) => (
                                <li key={`${item.type}-${item.id}`}>
                                    <span className="inline-flex items-center gap-1.5 shrink-0">
                                        <span
                                            className={`inline-block w-1.5 h-1.5 ${
                                                item.isPublished ? "bg-accent" : "bg-amber-400"
                                            }`}
                                        />
                                        <span className="text-[10px] font-mono text-white/50 uppercase">
                                            {item.type}
                                        </span>
                                    </span>
                                    <Link
                                        href={item.href}
                                        className="hover:text-accent transition-colors truncate font-medium text-sm text-white"
                                    >
                                        {item.label}
                                    </Link>
                                    <time dateTime={item.updatedAt} className="text-right text-[11px] font-mono text-white/45 shrink-0">
                                        {new Date(item.updatedAt).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </time>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-8 text-center text-white/50 text-xs font-mono">
                            Belum ada riwayat perubahan yang tercatat di database.
                        </div>
                    )}

                    <AdminSeedButton hasData={hasData} />
                </div>

                {/* Content Health & Overview */}
                <div className="space-y-6">
                    {/* Content Health Panel */}
                    <div className="admin-panel">
                        <div className="admin-eyebrow">CONTENT HEALTH</div>
                        <h2 className="admin-panel-title">Publication Overview</h2>
                        <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between border border-white/10 p-3 bg-secondary/50">
                                <div className="flex items-center gap-2">
                                    <FileCheck size={16} className="text-accent" />
                                    <span className="text-xs font-mono text-white/80">Published Items</span>
                                </div>
                                <span className="text-base font-display font-bold text-accent">
                                    {totalPublishedItems} / {totalContentItems}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border border-white/10 p-3 bg-secondary/50">
                                <div className="flex items-center gap-2">
                                    <FileEdit size={16} className="text-amber-400" />
                                    <span className="text-xs font-mono text-white/80">Draft Items</span>
                                </div>
                                <span className="text-base font-display font-bold text-amber-400">
                                    {snapshot.drafts}
                                </span>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/10">
                            <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider mb-2">
                                Quick Navigation
                            </div>
                            <div className="space-y-1.5">
                                <Link
                                    href="/admin/profile"
                                    className="flex items-center justify-between p-2 border border-white/5 hover:border-accent/40 text-xs font-mono text-white/70 hover:text-white transition-colors"
                                >
                                    <span>Edit Bio, Contacts & CV</span>
                                    <ArrowUpRight size={13} />
                                </Link>
                                <Link
                                    href="/admin/settings"
                                    className="flex items-center justify-between p-2 border border-white/5 hover:border-accent/40 text-xs font-mono text-white/70 hover:text-white transition-colors"
                                >
                                    <span>SEO, Logo & Favicon</span>
                                    <ArrowUpRight size={13} />
                                </Link>
                                <Link
                                    href="/admin/messages"
                                    className="flex items-center justify-between p-2 border border-white/5 hover:border-accent/40 text-xs font-mono text-white/70 hover:text-white transition-colors"
                                >
                                    <span>Contact Form Inbox</span>
                                    <ArrowUpRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ icon: Icon, label, value, meta, href, accent = false, alert = false }) {
    return (
        <Link href={href} className="admin-stat-card group hover:border-accent/40 transition-colors">
            <div className="flex items-center justify-between">
                <span className="group-hover:text-white transition-colors flex items-center gap-2">
                    <Icon size={14} className={alert ? "text-amber-400" : accent ? "text-accent" : "text-white/40"} />
                    <span>{label}</span>
                </span>
                {alert && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
            </div>
            <strong className={alert ? "text-amber-400" : accent ? "text-accent" : "text-white"}>
                {value}
            </strong>
            {meta && <small className="font-mono text-[11px] text-white/45 truncate">{meta}</small>}
        </Link>
    );
}
