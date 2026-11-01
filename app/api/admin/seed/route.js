import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminContext } from "@/lib/admin-auth";
import { DEFAULT_CERTIFICATES, DEFAULT_PROJECTS } from "@/lib/portfolio-seed";
import {
    DEFAULT_EDUCATION,
    DEFAULT_EXPERIENCE,
    DEFAULT_PROFILE,
    DEFAULT_SITE_SETTINGS,
    DEFAULT_SKILLS,
} from "@/lib/portfolio-defaults";

function parseMonthYearToDate(text, fallbackYear) {
    if (!text || text === "No Expiration") return null;
    const parsed = new Date(`${text} 1`);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }
    if (fallbackYear && /^\d{4}$/.test(String(fallbackYear))) {
        return `${fallbackYear}-01-01`;
    }
    return null;
}

export async function POST() {
    const context = await getAdminContext();
    if (context.status !== "authorized") {
        const status = context.status === "configuration" ? 503 : context.status === "unauthenticated" ? 401 : 403;
        return NextResponse.json({ error: "Akses admin diperlukan." }, { status });
    }

    const { supabase } = context;

    try {
        await supabase.from("profiles").upsert(
            {
                id: true,
                name: DEFAULT_PROFILE.name,
                professional_title: DEFAULT_PROFILE.professional_title,
                bio: DEFAULT_PROFILE.bio,
                profile_photo_url: DEFAULT_PROFILE.profile_photo_url,
                cv_url: DEFAULT_PROFILE.cv_url,
                email: DEFAULT_PROFILE.email,
                phone: DEFAULT_PROFILE.phone,
                location: DEFAULT_PROFILE.location,
                github_url: DEFAULT_PROFILE.github_url,
                linkedin_url: DEFAULT_PROFILE.linkedin_url,
                website_url: DEFAULT_PROFILE.website_url,
                availability_status: DEFAULT_PROFILE.availability_status,
            },
            { onConflict: "id" }
        );

        await supabase.from("site_settings").upsert(
            {
                id: true,
                site_name: DEFAULT_SITE_SETTINGS.site_name,
                logo_url: DEFAULT_SITE_SETTINGS.logo_url,
                favicon_url: DEFAULT_SITE_SETTINGS.favicon_url,
                seo_title: DEFAULT_SITE_SETTINGS.seo_title,
                seo_description: DEFAULT_SITE_SETTINGS.seo_description,
                og_image_url: DEFAULT_SITE_SETTINGS.og_image_url,
                footer_text: DEFAULT_SITE_SETTINGS.footer_text,
                social_links: DEFAULT_SITE_SETTINGS.social_links,
            },
            { onConflict: "id" }
        );

        const projectPayloads = DEFAULT_PROJECTS.map((project, index) => ({
            title: project.title,
            slug: project.slug,
            tagline: project.tagline || "",
            short_description: project.description || "",
            full_description: project.overview || project.description || "",
            category: project.category || "data-science",
            technologies: project.technologies || [],
            thumbnail_url: project.image || null,
            gallery_urls: Array.isArray(project.gallery) ? project.gallery.map((g) => g.image).filter(Boolean) : [],
            github_url: project.githubUrl && project.githubUrl !== "#" ? project.githubUrl : null,
            live_url: project.liveUrl && project.liveUrl !== "#" ? project.liveUrl : null,
            project_role:
                project.category === "mlops"
                    ? "MLOps Engineer"
                    : project.category === "data-engineering"
                    ? "Data Engineer"
                    : "ML Engineer & Data Scientist",
            start_date: `${project.year || "2024"}-01-01`,
            end_date: `${project.year || "2024"}-03-31`,
            is_featured: Boolean(project.featured),
            show_on_homepage: true,
            is_published: true,
            display_order: index + 1,
            metrics: project.metrics || [],
            overview: project.overview || "",
            challenge: project.challenge || "",
            solution: project.solution || "",
            process: project.process || [],
            learnings: project.learnings || [],
        }));

        await supabase.from("projects").upsert(projectPayloads, { onConflict: "slug" });

        const skillPayloads = DEFAULT_SKILLS.map((skill) => ({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency || null,
            display_order: skill.display_order,
            is_published: true,
        }));
        await supabase.from("skills").upsert(skillPayloads, { onConflict: "name,category" });

        const { count: certCount } = await supabase
            .from("certificates")
            .select("id", { count: "exact", head: true });

        if (!certCount) {
            const certPayloads = DEFAULT_CERTIFICATES.map((cert, index) => ({
                title: cert.title,
                issuer: cert.issuer,
                platform: cert.platform || cert.issuer,
                issued_at: parseMonthYearToDate(cert.issued, cert.date),
                expires_at: parseMonthYearToDate(cert.expires, null),
                credential_id: cert.credentialId || null,
                credential_url: cert.credentialUrl || null,
                image_url:
                    cert.image && !cert.image.startsWith("/api/placeholder") ? cert.image : null,
                description: cert.description || "",
                skills: cert.skills || [],
                featured: Boolean(cert.featured),
                category: cert.category || "Machine Learning",
                level: cert.level || "Intermediate",
                duration: cert.duration || null,
                overview: cert.overview || null,
                is_published: true,
                display_order: index + 1,
            }));
            await supabase.from("certificates").insert(certPayloads);
        }

        const { count: expCount } = await supabase
            .from("experience")
            .select("id", { count: "exact", head: true });

        if (!expCount) {
            const expPayloads = DEFAULT_EXPERIENCE.map((exp, index) => ({
                position: exp.position,
                organization: exp.organization,
                employment_type: exp.employment_type,
                location: exp.location,
                start_date: exp.start_date,
                end_date: exp.end_date,
                is_current: exp.is_current,
                description: exp.description,
                achievements: exp.achievements,
                technologies: exp.technologies,
                display_order: index + 1,
                is_published: true,
            }));
            await supabase.from("experience").insert(expPayloads);
        }

        const { count: eduCount } = await supabase
            .from("education")
            .select("id", { count: "exact", head: true });

        if (!eduCount) {
            const eduPayloads = DEFAULT_EDUCATION.map((edu, index) => ({
                institution: edu.institution,
                degree: edu.degree,
                field_of_study: edu.field_of_study,
                location: edu.location,
                start_date: edu.start_date,
                end_date: edu.end_date,
                description: edu.description,
                display_order: index + 1,
                is_published: true,
            }));
            await supabase.from("education").insert(eduPayloads);
        }

        revalidatePath("/", "layout");
        revalidatePath("/");

        return NextResponse.json({
            ok: true,
            message: "Data awal portofolio berhasil disinkronkan ke database Supabase.",
        });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Gagal menyinkronkan data awal. Pastikan migrasi SQL telah dijalankan.",
            },
            { status: 500 }
        );
    }
}
