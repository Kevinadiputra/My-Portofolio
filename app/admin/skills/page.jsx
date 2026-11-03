import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminSkillsPage() {
    await requireAdmin();
    redirect("/admin/achievements");
}
