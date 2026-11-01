import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewExperiencePage() {
    await requireAdmin();
    redirect("/admin/experience?new=1");
}
