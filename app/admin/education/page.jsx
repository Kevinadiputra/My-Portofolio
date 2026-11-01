import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminEducationPage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="education"
            title="Education"
            eyebrow="BACKGROUND / EDUCATION"
            description="Kelola riwayat pendidikan akademik, bidang studi, dan deskripsi aktivitas perkuliahan."
        />
    );
}
