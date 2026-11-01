import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminProfilePage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="profiles"
            title="Profile"
            eyebrow="IDENTITY / PROFILE"
            description="Kelola nama lengkap, jabatan profesional, deskripsi diri, foto profil, CV, kontak, dan status ketersediaan."
        />
    );
}
