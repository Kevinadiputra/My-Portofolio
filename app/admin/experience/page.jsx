import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminExperiencePage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="experience"
            title="Experience"
            eyebrow="TIMELINE / EXPERIENCE"
            description="Kelola pengalaman kerja, magang, organisasi, dan kepemimpinan beserta daftar pencapaian."
        />
    );
}
