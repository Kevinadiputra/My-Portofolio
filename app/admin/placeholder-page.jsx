export default function AdminPlaceholderPage({ title, eyebrow, description }) {
    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">{eyebrow}</div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </header>
            <div className="admin-panel admin-empty-panel">
                <h2>Database connection required</h2>
                <p>Schema dan policy Supabase belum tersedia di repository ini. Setelah migrasi diterapkan, halaman ini menjadi editor CRUD untuk data nyata.</p>
            </div>
        </div>
    );
}
