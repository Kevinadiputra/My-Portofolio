import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default function AdminSettingsPage() {
    return <AdminCollectionPage collection="site_settings" title="Site settings" eyebrow="SYSTEM / SETTINGS" description="Kelola metadata, social links, favicon, dan footer tanpa menyentuh source component." />;
}
