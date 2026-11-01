import { getPublicPortfolioData } from "@/lib/portfolio-data";

export default async function sitemap() {
    const baseUrl = "https://kevin-adiputra-portfolio.vercel.app";
    const { projects } = await getPublicPortfolioData();

    const projectUrls = (projects || []).map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        ...projectUrls,
    ];
}
