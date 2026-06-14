export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: 'https://kevin-adiputra-portfolio.vercel.app/sitemap.xml',
    }
}