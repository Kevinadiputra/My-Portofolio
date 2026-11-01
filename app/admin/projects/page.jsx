import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminProjectsPage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="projects"
            title="Projects"
            eyebrow="CONTENT / PROJECTS"
            description="Kelola studi kasus proyek, urutan tampil, status featured, halaman utama, dan status publikasi."
        />
    );
}
