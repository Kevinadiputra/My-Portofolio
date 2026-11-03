"use client";

import { ArrowUp, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

const Footer = () => {
    const { profile, siteSettings } = useProfile();
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Achievements", href: "#achievements" },
        { name: "Certificates", href: "#certificates" },
        { name: "Experience", href: "#experience" },
        { name: "Contact", href: "#contact" },
    ];

    const scrollToSection = (href) => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    const email = profile?.email || "kevinadiputra66@gmail.com";
    const phone = profile?.phone || "+62 821-8185-7340";
    const githubUrl =
        siteSettings?.social_links?.github ||
        profile?.github ||
        "https://github.com/Kevinadiputra";
    const linkedinUrl =
        siteSettings?.social_links?.linkedin ||
        profile?.linkedin ||
        "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/";

    return (
        <footer className="border-t border-white/10 bg-secondary">
            <div className="section-shell">
                <div className="grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
                    <div className="space-y-4">
                        <div className="font-display text-xl font-bold text-white">
                            <span className="text-accent">
                                {profile?.name?.split(" ")[0] || "Kevin"}
                            </span>{" "}
                            {profile?.name?.split(" ").slice(1).join(" ") || "Adiputra Mahesa"}
                        </div>
                        <p className="max-w-md text-sm leading-relaxed text-white/65">
                            {siteSettings?.footer_text ||
                                profile?.bio ||
                                "Computer Systems undergraduate focused on building verifiable machine learning models, spatial analytics dashboards, and reliable MLOps pipelines."}
                        </p>
                        <div className="flex gap-2.5">
                            <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chip hover:border-accent/50 hover:text-accent transition-colors"
                                aria-label="GitHub"
                            >
                                <Github size={15} />
                            </a>
                            <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chip hover:border-accent/50 hover:text-accent transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={15} />
                            </a>
                            <a
                                href={`mailto:${email}`}
                                className="chip hover:border-accent/50 hover:text-accent transition-colors"
                                aria-label="Email"
                            >
                                <Mail size={15} />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
                            Sections
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {quickLinks.map((link) => (
                                <button
                                    type="button"
                                    key={link.name}
                                    onClick={() => scrollToSection(link.href)}
                                    className="text-left text-xs font-mono text-white/65 transition-colors hover:text-accent"
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-mono text-xs uppercase tracking-wider text-white/50">
                            Direct Contact
                        </h3>
                        <div className="grid gap-2.5 text-xs font-mono text-white/70">
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center gap-2.5 hover:text-accent transition-colors"
                            >
                                <Mail size={14} className="text-accent shrink-0" />
                                <span className="truncate">{email}</span>
                            </a>
                            <a
                                href={`tel:${phone.replace(/\s|-/g, "")}`}
                                className="flex items-center gap-2.5 hover:text-accent transition-colors"
                            >
                                <Phone size={14} className="text-accent shrink-0" />
                                <span>{phone}</span>
                            </a>
                            <p className="flex items-center gap-2.5">
                                <MapPin size={14} className="text-accent shrink-0" />
                                <span>{profile?.location || "Palembang, Indonesia"}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 md:flex-row">
                    <p className="text-xs font-mono text-white/45">
                        © {currentYear} {siteSettings?.site_name || profile?.name || "Kevin Adiputra"}. All rights reserved.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="inline-flex items-center gap-2 text-xs font-mono text-white/55 transition-colors hover:text-accent"
                    >
                        <span>Back to top</span>
                        <ArrowUp size={13} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
