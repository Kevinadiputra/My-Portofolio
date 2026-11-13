"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

const NAV_ITEMS = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Projects", href: "#projects", id: "projects" },
    { name: "Achievements", href: "#achievements", id: "achievements" },
    { name: "Certificates", href: "#certificates", id: "certificates" },
    { name: "Experience", href: "#experience", id: "experience" },
    { name: "Contact", href: "#contact", id: "contact" },
];

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const router = useRouter();
    const pathname = usePathname();
    const { profile, siteSettings } = useProfile();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 36);
        };
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (pathname !== "/") return;

        const elements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible[0]?.target?.id) {
                    setActiveSection(visible[0].target.id);
                }
            },
            {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0.1, 0.35],
            }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [pathname]);

    const handleNavigation = (item) => {
        setIsOpen(false);
        if (pathname !== "/") {
            router.push(`/${item.href}`);
            return;
        }
        if (item.id === "home") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection("home");
            return;
        }
        const element = document.querySelector(item.href);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveSection(item.id);
        }
    };

    const nameParts = (profile?.name || "Kevin Adiputra").split(" ");
    const firstName = nameParts[0] || "Kevin";
    const restName = nameParts.slice(1, 2).join(" ") || "Adiputra";

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
                scrolled
                    ? "bg-primary/85 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                    : "bg-primary/40 backdrop-blur-sm border-b border-white/[0.04]"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <button
                        type="button"
                        onClick={() => handleNavigation(NAV_ITEMS[0])}
                        className="flex items-center gap-2 text-left font-display text-base sm:text-lg font-bold tracking-tight text-white hover:text-accent transition-colors"
                        aria-label="Go to top of homepage"
                    >
                        {siteSettings?.logo_url ? (
                            <img
                                src={siteSettings.logo_url}
                                alt={siteSettings.site_name || profile?.name || "Logo"}
                                className="h-7 w-auto object-contain"
                            />
                        ) : (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent" />
                                <span>
                                    <span className="text-accent">{firstName}</span> {restName}
                                </span>
                            </span>
                        )}
                    </button>

                    {/* Desktop Navigation */}
                    <nav
                        aria-label="Primary navigation"
                        className="hidden md:flex items-center gap-1 border border-white/[0.08] bg-secondary/80 backdrop-blur-sm rounded-full px-1.5 py-1"
                    >
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === "/" && activeSection === item.id;
                            return (
                                <button
                                    type="button"
                                    key={item.name}
                                    onClick={() => handleNavigation(item)}
                                    aria-current={isActive ? "location" : undefined}
                                    className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all duration-150 ${
                                        isActive
                                            ? "bg-white/[0.12] text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                                            : "text-white/65 hover:bg-white/[0.05] hover:text-white"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        className="md:hidden rounded-lg border border-white/10 bg-secondary/80 p-2 text-white hover:border-accent/40 hover:text-accent transition-colors"
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 border-t border-white/[0.08]">
                        <nav aria-label="Mobile navigation" className="mt-2 grid gap-1 bg-secondary/95 backdrop-blur-md p-2 rounded-xl border border-white/[0.08] shadow-2xl">
                            {NAV_ITEMS.map((item) => {
                                const isActive = pathname === "/" && activeSection === item.id;
                                return (
                                    <button
                                        type="button"
                                        key={item.name}
                                        onClick={() => handleNavigation(item)}
                                        className={`px-3.5 py-2.5 text-left text-xs font-mono uppercase tracking-wider rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                                                : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                                        }`}
                                    >
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
