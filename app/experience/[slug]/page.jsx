import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Building2,
    Calendar,
    MapPin,
    ArrowLeft,
    ExternalLink,
    CheckCircle2,
    Layers,
    Share2,
    ArrowUpRight,
} from "lucide-react";
import { getPublicPortfolioData } from "@/lib/portfolio-data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { experiences, profile, siteSettings } = await getPublicPortfolioData();
    const exp = (experiences || []).find((e) => e.slug === slug || String(e.id) === slug);

    if (!exp) {
        return {
            title: "Experience Not Found",
            robots: { index: false, follow: true },
        };
    }

    const siteName = siteSettings?.site_name || "Kevin Adiputra Portfolio";
    const owner = profile?.name || "Kevin Adiputra";
    const title = `${exp.position} at ${exp.organization} — ${owner}`;
    const description =
        exp.overview ||
        exp.description ||
        `Professional and organizational experience at ${exp.organization} by ${owner}.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            images: exp.logoUrl ? [{ url: exp.logoUrl }] : undefined,
        },
    };
}

export default async function ExperiencePage({ params }) {
    const { slug } = await params;
    const { experiences, profile } = await getPublicPortfolioData();
    const exp = (experiences || []).find((e) => e.slug === slug || String(e.id) === slug);

    if (!exp) {
        notFound();
    }

    const roles = exp.roles && exp.roles.length > 0 ? exp.roles : [];
    const gallery = exp.gallery || [];
    const links = exp.links || [];
    const isCurrent = Boolean(exp.isCurrent || exp.is_current);

    return (
        <div className="min-h-screen bg-primary text-white flex flex-col justify-between">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="section-shell max-w-4xl mx-auto space-y-10">
                    {/* Back Breadcrumb */}
                    <div>
                        <Link
                            href="/#experience"
                            className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-accent transition-colors"
                        >
                            <ArrowLeft size={14} />
                            <span>Back to Experience</span>
                        </Link>
                    </div>

                    {/* Organization Hero Banner */}
                    <div className="border border-white/10 bg-secondary/80 p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 border border-white/15 bg-primary flex items-center justify-center shrink-0 p-1">
                                    {exp.logoUrl || exp.logo_url ? (
                                        <img
                                            src={exp.logoUrl || exp.logo_url}
                                            alt={exp.organization}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 size={28} className="text-accent" />
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 border border-white/10 bg-primary text-white/70">
                                            {exp.organizationType || exp.employmentType || "Organization"}
                                        </span>
                                        {isCurrent && (
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                Currently Active
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                                        {exp.organization || exp.company}
                                    </h1>
                                    <p className="font-mono text-sm text-accent">
                                        {exp.position || exp.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5 border-t border-white/10 text-xs font-mono">
                            <div>
                                <span className="text-white/40 block text-[10px] uppercase">Tenure</span>
                                <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                                    <Calendar size={13} className="text-accent" />
                                    <span>{exp.period}</span>
                                </span>
                            </div>
                            <div>
                                <span className="text-white/40 block text-[10px] uppercase">Location</span>
                                <span className="text-white font-medium flex items-center gap-1.5 mt-0.5">
                                    <MapPin size={13} className="text-accent" />
                                    <span>{exp.location || "Indonesia"}</span>
                                </span>
                            </div>
                            <div>
                                <span className="text-white/40 block text-[10px] uppercase">Status</span>
                                <span className={`font-medium block mt-0.5 ${isCurrent ? "text-accent" : "text-white/70"}`}>
                                    {isCurrent ? "Currently Active" : "Completed"}
                                </span>
                            </div>
                        </div>

                        {/* External Links */}
                        {(exp.websiteUrl || exp.linkedinUrl) && (
                            <div className="flex flex-wrap gap-2.5 pt-4 border-t border-white/10">
                                {exp.websiteUrl && (
                                    <a
                                        href={exp.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-accent text-xs font-mono text-white/80 hover:text-accent transition-colors bg-primary/40"
                                    >
                                        <span>Official Website</span>
                                        <ArrowUpRight size={12} />
                                    </a>
                                )}
                                {exp.linkedinUrl && (
                                    <a
                                        href={exp.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-accent text-xs font-mono text-white/80 hover:text-accent transition-colors bg-primary/40"
                                    >
                                        <span>LinkedIn Profile</span>
                                        <ArrowUpRight size={12} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Overview & Context */}
                    {(exp.overview || exp.description) && (
                        <div className="space-y-3">
                            <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                Organization Overview & Context
                            </h2>
                            <p className="text-sm sm:text-base text-white/75 font-body leading-relaxed border border-white/10 bg-secondary/40 p-6">
                                {exp.overview || exp.description}
                            </p>
                        </div>
                    )}

                    {/* Roles & Positions Sub-Timeline */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                Roles & Positions ({roles.length})
                            </h2>
                            <span className="text-xs font-mono text-white/40">Chronological Evolution</span>
                        </div>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-accent/40">
                            {roles.map((role, idx) => (
                                <div key={role.id || idx} className="relative space-y-2">
                                    <div
                                        className={`absolute -left-6 top-1 w-3.5 h-3.5 border ${
                                            role.isCurrent || role.is_current
                                                ? "border-accent bg-accent"
                                                : "border-accent/60 bg-primary"
                                        }`}
                                    />

                                    <div className="border border-white/10 bg-secondary/50 p-6 space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h3 className="font-display text-lg font-bold text-white">
                                                {role.position}
                                            </h3>
                                            <span className="font-mono text-xs text-white/60 bg-primary px-2.5 py-1 border border-white/10">
                                                {role.period || (role.start_date ? `${role.start_date} — ${role.is_current ? "Present" : role.end_date}` : "")}
                                            </span>
                                        </div>

                                        {role.description && (
                                            <p className="text-sm text-white/70 font-body leading-relaxed">
                                                {role.description}
                                            </p>
                                        )}

                                        {/* Responsibilities */}
                                        {role.responsibilities && role.responsibilities.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <span className="text-[11px] font-mono uppercase tracking-wider text-white/50 block">
                                                    Key Responsibilities & Deliverables
                                                </span>
                                                <ul className="space-y-2 pl-0 list-none">
                                                    {role.responsibilities.map((resp, rIdx) => (
                                                        <li
                                                            key={rIdx}
                                                            className="text-xs sm:text-sm text-white/80 font-body flex items-start gap-2.5 leading-relaxed"
                                                        >
                                                            <span className="w-1.5 h-1.5 bg-accent shrink-0 mt-2" />
                                                            <span>{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Achievements in Role */}
                                        {role.achievements && role.achievements.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-white/5">
                                                <span className="text-[11px] font-mono uppercase tracking-wider text-accent block">
                                                    Key Outcomes & Impact
                                                </span>
                                                <ul className="space-y-2 pl-0 list-none">
                                                    {role.achievements.map((ach, aIdx) => (
                                                        <li
                                                            key={aIdx}
                                                            className="text-xs sm:text-sm text-accent/90 font-body flex items-start gap-2.5 leading-relaxed"
                                                        >
                                                            <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-accent" />
                                                            <span>{ach}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Technologies for Role */}
                                        {role.technologies && role.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                                                {role.technologies.map((t, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="text-[11px] font-mono px-2 py-0.5 border border-white/10 bg-primary text-white/70"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Documentation Gallery */}
                    {gallery && gallery.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                Activity Documentation & Gallery ({gallery.length})
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {gallery.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-white/10 bg-secondary/50 overflow-hidden"
                                    >
                                        <div className="aspect-video bg-primary overflow-hidden">
                                            <img
                                                src={item.url}
                                                alt={item.caption || "Activity Documentation"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {item.caption && (
                                            <p className="p-3 text-xs font-mono text-white/70 border-t border-white/5 bg-secondary/80">
                                                {item.caption}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* External Links */}
                    {links && links.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                External Links & References
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {links.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 bg-secondary hover:border-accent text-xs font-mono text-white/80 hover:text-accent transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        <span>{link.title || link.url}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
