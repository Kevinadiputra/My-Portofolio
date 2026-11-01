import { requireAdmin } from "@/lib/admin-auth";
import AdminCollectionPage from "@/components/admin/AdminCollectionPage";

export default async function AdminCertificatesPage() {
    await requireAdmin();
    return (
        <AdminCollectionPage
            collection="certificates"
            title="Certificates"
            eyebrow="CREDENTIALS / CERTIFICATES"
            description="Kelola sertifikasi profesional, unggah bukti sertifikat, urutan tampilan, dan tautan kredensial."
        />
    );
}
