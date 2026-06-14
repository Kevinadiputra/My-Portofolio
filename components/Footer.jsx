"use client";

import { ArrowUp, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

const Footer = () => {
    const { profile } = useProfile();
    const currentYear = new Date().getFullYear();
    const quickLinks = [
        { name: "Home", href: "#home" },
        { name: "About", href: "#about" },
        { name: "Work", href: "#projects" },
        { name: "Certificates", href: "#certificates" },
        { name: "Contact", href: "#contact" },
    ];

    const scrollToSection = (href) => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <footer className="border-t border-white/10 bg-secondary">
            <div className="section-shell">
                <div className="grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
                    <div className="space-y-4">
                        <div className="font-display text-2xl font-semibold">
                            <span className="text-accent">{profile?.name?.split(" ")[0] || "Kevin"}</span> {profile?.name?.split(" ").slice(1).join(" ") || "Adiputra"}
                        </div>
                        <p className="max-w-md leading-relaxed text-white/70">
                            {profile?.bio || "Machine learning engineer and data scientist building practical intelligence from analysis to deployment."}
                        </p>
                        <div className="flex gap-3">
                            <a href={profile?.github || "https://github.com/Kevinadiputra"} target="_blank" rel="noopener noreferrer" className="chip hover:border-accent/50 hover:text-accent" aria-label="GitHub">
                                <Github size={16} />
                            </a>
                            <a href={profile?.linkedin || "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/"} target="_blank" rel="noopener noreferrer" className="chip hover:border-accent/50 hover:text-accent" aria-label="LinkedIn">
                                <Linkedin size={16} />
                            </a>
                            <a href={`mailto:${profile?.email || "kevinadiputra1704@gmail.com"}`} className="chip hover:border-accent/50 hover:text-accent" aria-label="Email">
                                <Mail size={16} />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Navigation</h3>
                        <div className="grid gap-2">
                            {quickLinks.map((link) => (
                                <button key={link.name} onClick={() => scrollToSection(link.href)} className="text-left text-sm text-white/60 transition-colors hover:text-accent">
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-white">Get in touch</h3>
                        <div className="grid gap-3 text-sm text-white/70">
                            <a href={`mailto:${profile?.email || "kevinadiputra1704@gmail.com"}`} className="flex items-center gap-3 hover:text-accent">
                                <Mail size={16} className="text-accent" />
                                {profile?.email || "kevinadiputra1704@gmail.com"}
                            </a>
                            <a href={`tel:${(profile?.phone || "+628593007017").replace(/\s|-/g, "")}`} className="flex items-center gap-3 hover:text-accent">
                                <Phone size={16} className="text-accent" />
                                {profile?.phone || "+62 859-3000-7017"}
                            </a>
                            <p className="flex items-center gap-3">
                                <MapPin size={16} className="text-accent" />
                                {profile?.location || "Indonesia"}
                            </p>
                        </div>
                        <button onClick={() => scrollToSection("#contact")} className="btn btn-sm btn-accent">
                            Start a project
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 md:flex-row">
                    <p className="text-sm text-white/50">
                        Copyright {currentYear} {profile?.name || "Kevin Adiputra"}. All rights reserved.
                    </p>
                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-accent">
                        Back to top
                        <ArrowUp size={14} />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
