export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/api/admin/", "/private/"],
        },
        sitemap: "https://kevin-adiputra-portfolio.vercel.app/sitemap.xml",
    };
}
