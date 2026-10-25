import { redirect } from "next/navigation";

export default function NewProjectPage() {
    redirect("/admin/projects?new=1");
}
