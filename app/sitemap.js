export default function sitemap() {
    return [
        {
            url: 'https://kevin-adiputra-portfolio.vercel.app',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: 'https://kevin-adiputra-portfolio.vercel.app/#about',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: 'https://kevin-adiputra-portfolio.vercel.app/#projects',
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: 'https://kevin-adiputra-portfolio.vercel.app/#certificates',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: 'https://kevin-adiputra-portfolio.vercel.app/#contact',
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]
}
