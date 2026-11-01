import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminSkillsPage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="skills"
            title="Skills"
            eyebrow="CAPABILITY / SKILLS"
            description="Kelola keahlian teknis berdasarkan kategori (Programming, Data Science, ML, MLOps, Data Analytics, Tools)."
        />
    );
}
