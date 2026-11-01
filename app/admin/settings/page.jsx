import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminSettingsPage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="site_settings"
            title="Site Settings"
            eyebrow="SYSTEM / SETTINGS"
            description="Kelola nama website, logo, favicon, SEO metadata, Open Graph image, social links, dan teks footer."
        />
    );
}
