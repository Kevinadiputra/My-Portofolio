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
            setScrolled(window.scrollY > 50);
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-primary/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <button
                        onClick={() => router.push("/")}
                        className="text-lg md:text-xl font-display font-semibold hover:text-accent transition-colors"
                        aria-label="Go to homepage"
                    >
                        <span className="text-accent">Kevin</span> Adiputra
                    </button>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
                        {navItems.map((item) => {
                            const isActive = (item.type === "route" && pathname === item.href) ||
                                (item.type === "section" && pathname === "/");

                            return (
                                <button
                                    key={item.name}
                                    onClick={(e) => handleNavigation(item, e.ctrlKey || e.metaKey)}
                                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive && item.type === "route"
                                        ? "bg-accent text-primary"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
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
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4 border-t border-white/10">
                        <nav className="mt-4 grid gap-2 rounded-2xl bg-secondary/95 p-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item)}
                                    className="rounded-xl px-3 py-3 text-left text-sm font-medium text-white/70 transition-colors duration-200 hover:bg-white/10 hover:text-accent"
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
