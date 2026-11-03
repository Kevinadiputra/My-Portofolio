import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminAchievementsPage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="achievements"
            title="Achievements & Awards"
            eyebrow="RECOGNITION / ACHIEVEMENTS"
            description="Kelola riwayat prestasi, kompetisi teknologi, penghargaan akademik, sertifikasi lomba, dan dokumentasi bukti prestasi."
        />
    );
}
