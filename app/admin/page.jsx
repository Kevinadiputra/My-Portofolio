import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminContentSnapshot } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
    const { supabase } = await requireAdmin();
    const snapshot = await getAdminContentSnapshot(supabase);

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">OPERATIONS / OVERVIEW</div>
                    <h1>Dashboard</h1>
                    <p>Kontrol konten yang benar-benar tersimpan, bukan angka dekoratif.</p>
                </div>
                <Link href="/admin/projects?new=1" className="admin-primary-action">New project</Link>
            </header>

            <section className="admin-stat-grid" aria-label="Content statistics">
                <Stat label="Published projects" value={snapshot.projects.published} />
                <Stat label="Certificates" value={snapshot.certificates.total} />
                <Stat label="Experience entries" value={snapshot.experience.total} />
                <Stat label="Draft content" value={snapshot.drafts} />
            </section>

            <section className="admin-dashboard-grid">
                <div className="admin-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <div className="admin-eyebrow">CONTENT QUEUE</div>
                            <h2>Recent changes</h2>
                        </div>
                    </div>
                    {snapshot.recentChanges.length ? (
                        <ul className="admin-change-list">
                            {snapshot.recentChanges.map((item) => (
                                <li key={`${item.type}-${item.id}`}>
                                    <span>{item.type}</span>
                                    <strong>{item.label}</strong>
                                    <time dateTime={item.updatedAt}>{new Date(item.updatedAt).toLocaleDateString("en-US")}</time>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="admin-empty-state">Belum ada perubahan yang tercatat di database.</p>
                    )}
                </div>

                <div className="admin-panel">
                    <div className="admin-eyebrow">QUICK ACCESS</div>
                    <h2>Build the next proof point</h2>
                    <p>Mulai dari konten yang paling sering dilihat recruiter: project, profile, dan experience.</p>
                    <div className="admin-shortcuts">
                        <Link href="/admin/projects?new=1">Add project <span>→</span></Link>
                        <Link href="/admin/profile">Edit profile <span>→</span></Link>
                        <Link href="/admin/experience?new=1">Add experience <span>→</span></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <article className="admin-stat-card">
            <span>{label}</span>
            <strong>{value}</strong>
        </article>
    );
}
