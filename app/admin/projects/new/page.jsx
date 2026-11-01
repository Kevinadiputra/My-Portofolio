import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewProjectPage() {
    await requireAdmin();
    redirect("/admin/projects?new=1");
}
