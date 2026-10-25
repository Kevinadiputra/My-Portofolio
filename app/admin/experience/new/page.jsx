import { redirect } from "next/navigation";

export default function NewExperiencePage() {
    redirect("/admin/experience?new=1");
}
