import { notFound, redirect } from "next/navigation";
import { getPublicPortfolioData } from "@/lib/portfolio-data";
import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";

const SITE_URL = "https://kevin-adiputra-portfolio.vercel.app";

function resolveProject(projects, slug) {
    const list = Array.isArray(projects) ? projects : [];
    const direct = list.find((project) => project.slug === slug);

    if (direct) {
        return { project: direct, isLegacySlug: false };
    }

    const legacy = list.find((project) =>
        Array.isArray(project.previousSlugs) ? project.previousSlugs.includes(slug) : false
    );

    return legacy ? { project: legacy, isLegacySlug: true } : { project: null, isLegacySlug: false };
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { projects, profile, siteSettings } = await getPublicPortfolioData();
    const { project } = resolveProject(projects, slug);

    if (!project) {
        return {
            title: "Case Study Not Found",
            robots: { index: false, follow: true },
        };
    }

    const siteName = siteSettings?.site_name || "Kevin Adiputra Portfolio";
    const owner = profile?.name || "Kevin Adiputra";
    const title = `${project.title} — ${owner}`;
    const description =
        project.tagline ||
        project.description ||
        `Case study of ${project.title} by ${owner}.`;
    const canonical = `/projects/${project.slug}`;
    const images = project.image
        ? [{ url: project.image, alt: project.title }]
        : undefined;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            type: "article",
            title,
            description,
            url: canonical,
            siteName,
            images,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: project.image ? [project.image] : undefined,
        },
    };
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const { projects, profile } = await getPublicPortfolioData();
    const { project, isLegacySlug } = resolveProject(projects, slug);

    if (!project) {
        notFound();
    }

    if (isLegacySlug) {
        redirect(`/projects/${project.slug}`);
    }

    const relatedProjects = (Array.isArray(projects) ? projects : [])
        .filter((item) => item.slug !== project.slug)
        .slice(0, 3);

    const baseUrl = profile?.website || SITE_URL;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.description || project.tagline || "",
        url: `${baseUrl}/projects/${project.slug}`,
        image: project.image || undefined,
        keywords: Array.isArray(project.technologies) ? project.technologies.join(", ") : undefined,
        author: {
            "@type": "Person",
            name: profile?.name || "Kevin Adiputra",
        },
        dateCreated: project.startDate || undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProjectCaseStudy project={project} relatedProjects={relatedProjects} />
        </>
    );
}
