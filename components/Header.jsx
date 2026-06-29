"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 30);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Home", href: "/", type: "route" },
        { name: "About", href: "#about", type: "section" },
        { name: "Work", href: "#projects", type: "section" },
        { name: "Certificates", href: "#certificates", type: "section" },
        { name: "Experience", href: "#experience", type: "section" },
        { name: "Contact", href: "#contact", type: "section" },
    ];

    const handleNavigation = (item, forceNewTab = false) => {
        if (item.type === "route") {
            if (forceNewTab) {
                window.open(item.href, '_blank', 'noopener,noreferrer');
            } else {
                if (item.href === "/" && pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    router.push(item.href);
                }
            }
        } else if (item.type === "section") {
            if (forceNewTab) {
                window.open(`/${item.href}`, '_blank', 'noopener,noreferrer');
            } else {
                if (pathname !== "/") {
                    router.push(`/${item.href}`);
                } else {
                    const element = document.querySelector(item.href);
                    if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
        }
        setIsOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
                scrolled 
                    ? "bg-primary/80 backdrop-blur-xl border-b border-white/10" 
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
                <div className="flex justify-between items-center h-full">
                    <button
                        onClick={() => router.push("/")}
                        className="text-base md:text-lg font-display font-bold hover:text-accent transition-colors"
                        aria-label="Go to homepage"
                    >
                        <span className="text-accent">Kevin</span> Adiputra
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-0.5">
                        {navItems.map((item) => {
                            const isActive = (item.type === "route" && pathname === item.href) ||
                                (item.type === "section" && pathname === "/");

                            return (
                                <button
                                    key={item.name}
                                    onClick={(e) => handleNavigation(item, e.ctrlKey || e.metaKey)}
                                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                                        isActive && item.type === "route"
                                            ? "bg-accent text-primary"
                                            : "text-white/70 hover:bg-white/5 hover:text-accent"
                                    }`}
                                >
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden rounded-xl border border-white/10 p-2 text-white hover:text-accent transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 border-t border-white/10 bg-primary/95 backdrop-blur-xl">
                        <nav className="mt-4 grid gap-1 rounded-2xl bg-secondary/95 p-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item)}
                                    className="rounded-xl px-3 py-3 text-left text-xs font-semibold text-white/70 transition-colors duration-200 hover:bg-white/5 hover:text-accent"
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
