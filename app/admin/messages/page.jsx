import { requireAdmin } from "@/lib/admin-auth";
import AdminMessages from "@/components/admin/AdminMessages";

export default async function AdminMessagesPage() {
    await requireAdmin();
    return <AdminMessages />;
}
