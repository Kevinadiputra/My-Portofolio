import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }) {
    return (
        <AdminShell>{children}</AdminShell>
    );
}
