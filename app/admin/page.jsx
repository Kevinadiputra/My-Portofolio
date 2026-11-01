import Link from "next/link";
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
        snapshot.skills.total > 0;

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">OPERATIONS / OVERVIEW</div>
                    <h1>Dashboard</h1>
                    <p>
                        Ringkasan langsung dari database PostgreSQL Supabase. Login sebagai{" "}
                        <span className="text-white/90 font-mono text-xs">{user.email}</span>.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <Link href="/admin/projects?new=1" className="admin-primary-action">
                        + New Project
                    </Link>
                    <Link href="/admin/certificates?new=1" className="admin-secondary-action">
                        + Certificate
                    </Link>
                </div>
            </header>

            <section className="admin-stat-grid" aria-label="Content statistics">
                <Stat
                    label="Published Projects"
                    value={snapshot.projects.published}
                    meta={`${snapshot.projects.total} total · ${snapshot.projects.featured} featured`}
                    href="/admin/projects"
                />
                <Stat
                    label="Certificates"
                    value={snapshot.certificates.published}
                    meta={`${snapshot.certificates.total} total stored`}
                    href="/admin/certificates"
                />
                <Stat
                    label="Experience & Org"
                    value={snapshot.experience.published}
                    meta={`${snapshot.experience.total} experience · ${snapshot.education.total} education`}
                    href="/admin/experience"
                />
                <Stat
                    label="Draft Content"
                    value={snapshot.drafts}
                    meta={`${snapshot.skills.published} active skills`}
                    href="/admin/projects"
                />
                <Stat
                    label="New Messages"
                    value={snapshot.messages.unread}
                    meta={`${snapshot.messages.total} total stored`}
                    href="/admin/messages"
                />
            </section>

            <section className="admin-dashboard-grid">
                <div className="admin-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <div className="admin-eyebrow">ACTIVITY LOG</div>
                            <h2>Recent Content Changes</h2>
                        </div>
                    </div>
                    {snapshot.recentChanges.length ? (
                        <ul className="admin-change-list">
                            {snapshot.recentChanges.map((item) => (
                                <li key={`${item.type}-${item.id}`}>
                                    <span className="inline-flex items-center gap-1.5">
                                        <span
                                            className={`inline-block w-1.5 h-1.5 ${
                                                item.isPublished ? "bg-accent" : "bg-amber-400"
                                            }`}
                                        />
                                        {item.type}
                                    </span>
                                    <Link href={item.href} className="hover:text-accent transition-colors truncate">
                                        <strong>{item.label}</strong>
                                    </Link>
                                    <time dateTime={item.updatedAt}>
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
                        <p className="admin-empty-state mt-4">
                            Belum ada perubahan yang tercatat di database. Gunakan tombol di bawah untuk mengimpor data awal portofolio.
                        </p>
                    )}

                    <AdminSeedButton hasData={hasData} />
                </div>

                <div className="admin-panel">
                    <div className="admin-eyebrow">QUICK SHORTCUTS</div>
                    <h2>Manage Portfolio Sections</h2>
                    <p className="text-sm mt-1">
                        Tambah atau perbarui konten tanpa perlu mengedit kode sumber:
                    </p>
                    <div className="admin-shortcuts">
                        <Link href="/admin/projects?new=1">
                            <span>Add New Project</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/certificates?new=1">
                            <span>Add Certificate</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/experience?new=1">
                            <span>Add Experience</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/education?new=1">
                            <span>Add Education</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/skills?new=1">
                            <span>Add Technical Skill</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/profile">
                            <span>Update Profile & CV</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/messages">
                            <span>Read Contact Messages</span>
                            <span>→</span>
                        </Link>
                        <Link href="/admin/settings">
                            <span>Configure SEO & Site Settings</span>
                            <span>→</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ label, value, meta, href }) {
    return (
        <Link href={href} className="admin-stat-card group hover:border-accent/40 transition-colors">
            <span className="group-hover:text-white transition-colors">{label}</span>
            <strong>{value}</strong>
            {meta && <small className="font-mono text-[11px] text-white/45">{meta}</small>}
        </Link>
    );
}
