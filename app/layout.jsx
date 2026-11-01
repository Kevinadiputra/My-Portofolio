import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { CertificatesProvider } from "@/context/CertificatesContext";
import { getPublicPortfolioData } from "@/lib/portfolio-data";
import { Space_Grotesk, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-display",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["400", "500", "600"],
    display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    variable: "--font-body",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

export async function generateMetadata() {
    const { profile, siteSettings } = await getPublicPortfolioData();
    const title =
        siteSettings?.seo_title ||
        `${profile?.name || "Kevin Adiputra"} — Data Science, Machine Learning & MLOps Portfolio`;
    const description =
        siteSettings?.seo_description ||
        profile?.bio ||
        "Portfolio of Kevin Adiputra Mahesa, Computer Systems undergraduate specializing in Data Science, Machine Learning, and MLOps pipelines.";
    const siteName = siteSettings?.site_name || "Kevin Adiputra Portfolio";
    const ogImage = siteSettings?.og_image_url || "/og-image.jpg";
    const favicon = siteSettings?.favicon_url || "/favicon.ico";

    return {
        title,
        description,
        keywords:
            "Kevin Adiputra, Machine Learning, Data Science, MLOps, Deep Learning, NLP, Computer Vision, Python, Apache Airflow, Portfolio",
        authors: [{ name: profile?.name || "Kevin Adiputra" }],
        creator: profile?.name || "Kevin Adiputra",
        publisher: profile?.name || "Kevin Adiputra",
        icons: {
            icon: favicon,
        },
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(profile?.website || "https://kevin-adiputra-portfolio.vercel.app"),
        alternates: {
            canonical: "/",
        },
        openGraph: {
            title,
            description,
            url: profile?.website || "https://kevin-adiputra-portfolio.vercel.app",
            siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale: "en_US",
            type: "website",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function RootLayout({ children }) {
    const portfolioData = await getPublicPortfolioData();

    return (
        <html
            lang="en"
            className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable}`}
        >
            <body className="antialiased font-body bg-primary text-white/90 overflow-x-hidden">
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>
                <ProfileProvider
                    initialProfile={portfolioData.profile}
                    initialSiteSettings={portfolioData.siteSettings}
                    initialExperiences={portfolioData.experiences}
                    initialEducation={portfolioData.education}
                    initialSkills={portfolioData.skills}
                >
                    <CertificatesProvider initialCertificates={portfolioData.certificates}>
                        <ProjectsProvider initialProjects={portfolioData.projects}>
                            {children}
                        </ProjectsProvider>
                    </CertificatesProvider>
                </ProfileProvider>
            </body>
        </html>
    );
}
