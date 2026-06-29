"use client";

import { useState, useEffect } from "react";
import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { motion } from "framer-motion";

const phrases = [
    "Data Scientist",
    "Machine Learning Engineer",
    "MLOps Enthusiast",
    "Data Analyst",
];

const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const Hero = () => {
    const [displayText, setDisplayText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const { profile } = useProfile();

    useEffect(() => {
        const phrase = phrases[currentPhrase];

        if (currentIndex < phrase.length) {
            const timer = setTimeout(() => {
                setDisplayText(phrase.substring(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }, 90);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCurrentIndex(0);
            setDisplayText("");
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        }, 1800);
        return () => clearTimeout(timer);
    }, [currentIndex, currentPhrase]);

    const scrollToAbout = () => {
        document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
    };

    const highlights = ["Data Science", "Machine Learning", "MLOps Pipelines", "Data Analytics"];
    const heroStats = [
        { value: "2+", label: "Years Experience" },
        { value: "15+", label: "Projects Completed" },
        { value: "5+", label: "Model Deployments" },
    ];

    return (
        <section id="home" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden py-16 md:py-24 lg:py-32">
            <div className="absolute inset-0 hero-surface" />
            <div className="absolute inset-0 hero-grid" />
            <div className="absolute inset-0 noise-overlay" />
            
            {/* Ambient Spinning Globe */}
            <div className="absolute right-[-8%] top-[-5%] w-[35vw] h-[35vw] min-w-[320px] min-h-[320px] opacity-[0.03] pointer-events-none z-0 animate-[spin_60s_linear_infinite] select-none">
                <img src="/globe.svg" alt="" className="w-full h-full invert" />
            </div>

            <div className="relative z-10 section-shell w-full mt-8 lg:mt-4">
                <div className="grid lg:grid-cols-[55fr_45fr] gap-16 items-center">
                    
                    {/* Hero Left: Text Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-xs text-white/50">
                            <span className="inline-flex items-center gap-2 rounded-none border border-accent/30 bg-accent/10 px-3 py-1 text-accent font-semibold tracking-wide">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                Available
                            </span>
                            <span className="text-white/30 tracking-wider">Portfolio 2026</span>
                        </div>

                        <div className="space-y-4">
                            <motion.h1
                                initial="hidden"
                                animate="visible"
                                variants={fadeUpVariants}
                                className="font-display text-4xl sm:text-5xl md:text-[56px] lg:text-[64px] xl:text-[72px] font-extrabold tracking-tight text-white leading-[1.1] xl:leading-[1.05]"
                            >
                                Building Machine Learning Systems and Transforming Data into Actionable Insights.
                            </motion.h1>
                            
                            <p className="text-lg md:text-xl font-display font-semibold text-white/80">
                                Hi, I'm <span className="text-accent">{profile?.name || "Kevin Adiputra"}</span>.
                            </p>

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono px-2 py-0.5 border border-white/10 bg-white/[0.02] text-white/40 tracking-wider uppercase">
                                    Current focus
                                </span>
                                <h2 className="text-base md:text-lg font-bold font-display text-white/80">
                                    {displayText}
                                    <span className="text-accent animate-pulse">|</span>
                                </h2>
                            </div>
                        </div>

                        <p className="text-sm md:text-base text-white/60 max-w-[540px] leading-[1.6]">
                            I design practical data products: models that explain their work, dashboards
                            that guide decisions, and pipelines that keep running after the demo.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="/Kevin-Adiputra-CV.pdf" 
                                className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-none border border-accent bg-accent hover:bg-accent-hover text-primary transition-all duration-300 active:scale-[0.98] gap-2 shadow-[0_12px_40px_rgba(104,212,204,0.12)]"
                            >
                                <Download size={16} />
                                Download CV
                            </a>
                            <button 
                                onClick={scrollToAbout} 
                                className="inline-flex items-center justify-center h-12 px-6 text-sm font-semibold rounded-none border border-white/10 bg-tertiary hover:bg-tertiary-hover text-white transition-all duration-300 active:scale-[0.98] shadow-md"
                            >
                                See how I work
                            </button>
                        </div>

                        {/* Hero Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4 max-w-[540px]">
                            {heroStats.map((stat) => (
                                <div 
                                    key={stat.label} 
                                    className="surface-card py-3 px-4 flex flex-col justify-center h-24 hover:border-accent/30 hover:shadow-[0_0_15px_rgba(104,212,204,0.04)] transition-all duration-300"
                                >
                                    <div className="text-2xl md:text-3xl lg:text-[36px] font-display font-extrabold text-accent leading-none mb-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-[9px] md:text-[10px] font-mono tracking-wider text-white/40 uppercase leading-none truncate">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Social Icons & Scroll */}
                        <div className="flex items-center justify-between pt-2 max-w-[540px]">
                            <div className="flex items-center gap-3">
                                {[
                                    { icon: Github, label: "GitHub profile", url: "https://github.com/Kevinadiputra" },
                                    { icon: Linkedin, label: "LinkedIn profile", url: "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/" },
                                    { icon: Mail, label: "Email Kevin", url: `mailto:${profile?.email || "kevinadiputra1704@gmail.com"}` }
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={item.url}
                                            target={item.url.startsWith("mailto:") ? undefined : "_blank"}
                                            rel={item.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                            className="w-10 h-10 bg-tertiary/60 hover:bg-accent hover:text-primary rounded-none border border-white/5 hover:border-accent/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_12px_rgba(104,212,204,0.25)]"
                                            aria-label={item.label}
                                        >
                                            <Icon size={16} />
                                        </a>
                                    );
                                })}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-white/40">
                                <div className="h-px w-8 bg-white/20" />
                                <button
                                    onClick={scrollToAbout}
                                    className="flex items-center gap-1.5 text-white/50 hover:text-accent transition-colors font-mono uppercase tracking-wider text-[10px]"
                                >
                                    Scroll
                                    <ArrowDown size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Hero Right: Profile Card Column */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="notch-card glass-panel p-5 md:p-6 w-full max-w-[310px] relative overflow-hidden flex flex-col gap-4">
                            {/* Card Header */}
                            <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/5 pb-3">
                                <span className="inline-flex items-center gap-1.5 font-mono">
                                    <Sparkles size={14} className="text-accent" />
                                    Profile index
                                </span>
                                <span className="text-accent font-mono text-[10px]">ID-ML-1704</span>
                            </div>

                            {/* Photo Container */}
                            <div className="relative group cursor-pointer w-full max-w-[260px] mx-auto">
                                {/* Technical decorative corners */}
                                <div className="absolute -inset-1.5 border border-white/5 bg-transparent z-0 transition-colors duration-500 group-hover:border-accent/20 group-hover:bg-accent/[0.02]" />
                                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/60 -translate-x-1.5 -translate-y-1.5 transition-transform duration-500 group-hover:-translate-x-2.5 group-hover:-translate-y-2.5 z-20" />
                                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/60 translate-x-1.5 -translate-y-1.5 transition-transform duration-500 group-hover:translate-x-2.5 group-hover:-translate-y-2.5 z-20" />
                                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/60 -translate-x-1.5 translate-y-1.5 transition-transform duration-500 group-hover:-translate-x-2.5 group-hover:translate-y-2.5 z-20" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/60 translate-x-1.5 translate-y-1.5 transition-transform duration-500 group-hover:translate-x-2.5 group-hover:translate-y-2.5 z-20" />

                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary z-10 border border-white/10">
                                    {/* Scanning line overlay */}
                                    <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(104,212,204,0.05)_50%)] bg-[length:100%_3px]" />
                                        <div className="absolute top-0 left-0 w-full h-[1.5px] bg-accent/80 shadow-[0_0_12px_3px_rgba(104,212,204,0.6)] animate-scan-line" />
                                    </div>
                                    
                                    {profile?.profilePicture && profile.profilePicture !== "/api/placeholder/400/400" ? (
                                        <img
                                            src={profile.profilePicture}
                                            alt={profile?.name || "Kevin Adiputra"}
                                            className="w-full h-full object-cover object-center grayscale-[0.8] opacity-80 mix-blend-luminosity transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-display text-white">
                                            {profile?.name?.split(" ").map((n) => n.charAt(0)).join("") || "KA"}
                                        </div>
                                    )}
                                </div>

                                {/* Data readout overlay */}
                                <div className="absolute bottom-3 left-3 z-30 flex flex-col gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    <span className="text-[8px] font-mono text-accent bg-primary/90 px-1.5 py-0.5 border border-accent/20 tracking-wider">
                                        SRC: {profile?.name || "KEVIN_A"}
                                    </span>
                                    <span className="text-[8px] font-mono text-accent/80 bg-primary/90 px-1.5 py-0.5 border border-accent/20 tracking-wider">
                                        STATUS: ONLINE_
                                    </span>
                                </div>
                            </div>

                            {/* Card Footer / Highlights & Based In */}
                            <div className="mt-2 flex flex-col gap-3">
                                <div className="flex flex-wrap gap-1.5">
                                    {highlights.map((item) => (
                                        <span key={item} className="text-[9px] font-mono px-2 py-0.5 bg-white/[0.02] border border-white/5 text-white/50 tracking-wider">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-white/40 font-mono">
                                    <span>Location:</span>
                                    <span className="text-accent font-semibold">Based in Indonesia</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Rotating Ribbon */}
            <div className="data-ribbon absolute left-[-2%] right-[-2%] bottom-10 md:bottom-12 rotate-[-0.75deg] h-[48px] md:h-[54px] flex items-center overflow-hidden select-none">
                <div className="data-ribbon__track flex items-center gap-12 md:gap-16 whitespace-nowrap">
                    {["Data Science", "MLOps Automation", "Machine Learning", "Data Analytics", "Data Science", "MLOps Automation", "Machine Learning", "Data Analytics"].map((item, index) => (
                        <span key={`${item}-${index}`} className="inline-flex items-center gap-12 md:gap-16 text-[13px] md:text-[14px] font-medium tracking-[0.22em] text-white/65 uppercase">
                            {item}
                            <span className="text-white/20 select-none font-mono">/</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Hero;
