import "./globals.css";
import { ProfileProvider } from "@/context/ProfileContext";
import { ProjectsProvider } from "@/context/ProjectsContext";
import { CertificatesProvider } from "@/context/CertificatesContext";
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

export const metadata = {
  title: "Kevin Adiputra - Machine Learning & Data Science Portfolio",
  description: "Machine Learning Engineer & Data Scientist specializing in deep learning, NLP, computer vision, and data analytics. Building intelligent solutions with Python, TensorFlow, and PyTorch.",
  keywords: "Kevin Adiputra, Machine Learning, Data Scientist, Deep Learning, NLP, Computer Vision, Python, TensorFlow, PyTorch, Portfolio",
  authors: [{ name: "Kevin Adiputra" }],
  creator: "Kevin Adiputra",
  publisher: "Kevin Adiputra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kevin-adiputra-portfolio.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Kevin Adiputra - Machine Learning & Data Science Portfolio",
    description: "Machine Learning Engineer & Data Scientist building intelligent solutions with modern AI technologies.",
    url: 'https://kevin-adiputra-portfolio.vercel.app',
    siteName: 'Kevin Adiputra Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Kevin Adiputra - ML & Data Science Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${ibmPlexSans.variable}`}>
      <body className="antialiased font-body bg-primary text-white/90">
        <a href="#main-content" className="skip-link">Skip to content</a>
        <ProfileProvider>
          <CertificatesProvider>
            <ProjectsProvider>
              {children}
            </ProjectsProvider>
          </CertificatesProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
