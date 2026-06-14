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
        { value: "2+", label: "Years" },
        { value: "15+", label: "Projects" },
        { value: "5+", label: "Orchestrations" },
    ];

    return (
        <section id="home" className="relative min-h-[100dvh] overflow-hidden">
            <div className="absolute inset-0 hero-surface" />
            <div className="absolute inset-0 hero-grid" />
            <div className="absolute inset-0 noise-overlay" />
            
            {/* Ambient Spinning Wireframe Globe */}
            <div className="absolute right-[-10%] top-[-5%] w-[40vw] h-[40vw] min-w-[350px] min-h-[350px] opacity-[0.04] pointer-events-none z-0 animate-[spin_50s_linear_infinite] select-none">
                <img src="/globe.svg" alt="" className="w-full h-full invert" />
            </div>

            <div className="relative z-10 section-shell pt-28 pb-40">
                <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-12 items-center">
                    <div className="space-y-8">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                            <span className="inline-flex items-center gap-2 rounded-none border border-accent/30 bg-accent/10 px-3 py-1.5 text-accent">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                Available
                            </span>
                            <span className="text-white/40">Portfolio 2026</span>
                        </div>

                        <div className="space-y-4">
                            <motion.h1
                                initial="hidden"
                                animate="visible"
                                variants={fadeUpVariants}
                                className="h1 text-white"
                            >
                                Building Machine Learning Systems and Transforming Data into Actionable Insights.
                            </motion.h1>
                            <p className="text-xl md:text-2xl font-display font-semibold text-white/80">
                                Hi, I'm <span className="text-accent">{profile?.name || "Kevin Adiputra"}</span>.
                            </p>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="chip">Current focus</span>
                                <h2 className="h3 text-white/80">
                                    {displayText}
                                    <span className="text-accent">|</span>
                                </h2>
                            </div>
                        </div>

                        <p className="text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
                            I design practical data products: models that explain their work, dashboards
                            that guide decisions, and pipelines that keep running after the demo.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a href="/Kevin-Adiputra-CV.pdf" className="btn btn-lg btn-accent gap-2">
                                <Download size={18} />
                                Download CV
                            </a>
                            <button onClick={scrollToAbout} className="btn btn-lg btn-tertiary">
                                See how I work
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-4 sm:max-w-xl">
                            {heroStats.map((stat) => (
                                <div key={stat.label} className="surface-card p-4">
                                    <div className="text-2xl md:text-3xl font-display font-semibold text-accent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-white/50">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/Kevinadiputra"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-tertiary hover:bg-accent hover:text-primary rounded-none border border-white/5 hover:border-accent/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                                aria-label="GitHub profile"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 bg-tertiary hover:bg-accent hover:text-primary rounded-none border border-white/5 hover:border-accent/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                                aria-label="LinkedIn profile"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href={`mailto:${profile?.email || "kevinadiputra1704@gmail.com"}`}
                                className="w-12 h-12 bg-tertiary hover:bg-accent hover:text-primary rounded-none border border-white/5 hover:border-accent/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                                aria-label="Email Kevin"
                            >
                                <Mail size={20} />
                            </a>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-white/50">
                            <div className="h-px w-10 bg-white/30" />
                            <button
                                onClick={scrollToAbout}
                                className="flex items-center gap-2 text-white/60 hover:text-accent transition-colors"
                            >
                                Scroll
                                <ArrowDown size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="notch-card glass-panel p-6 md:p-8">
                            <div className="flex items-center justify-between text-sm text-white/50">
                                <span className="inline-flex items-center gap-2">
                                    <Sparkles size={16} className="text-accent" />
                                    Profile index
                                </span>
                                <span className="text-accent">ID-ML-1704</span>
                            </div>

                            <div className="mt-8 relative group cursor-pointer w-full max-w-sm mx-auto">
                                {/* Technical decorative corners */}
                                <div className="absolute -inset-2 border border-white/5 bg-transparent z-0 transition-colors duration-500 group-hover:border-accent/20 group-hover:bg-accent/[0.02]" />
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/60 -translate-x-2 -translate-y-2 transition-transform duration-500 group-hover:-translate-x-3 group-hover:-translate-y-3 z-20" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/60 translate-x-2 -translate-y-2 transition-transform duration-500 group-hover:translate-x-3 group-hover:-translate-y-3 z-20" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/60 -translate-x-2 translate-y-2 transition-transform duration-500 group-hover:-translate-x-3 group-hover:translate-y-3 z-20" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/60 translate-x-2 translate-y-2 transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3 z-20" />

                                <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary z-10 border border-white/10">
                                    {/* Scanning line overlay */}
                                    <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(104,212,204,0.05)_50%)] bg-[length:100%_4px]" />
                                        <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/80 shadow-[0_0_12px_3px_rgba(104,212,204,0.6)] animate-scan-line" />
                                    </div>
                                    
                                    {profile?.profilePicture && profile.profilePicture !== "/api/placeholder/400/400" ? (
                                        <img
                                            src={profile.profilePicture}
                                            alt={profile?.name || "Kevin Adiputra"}
                                            className="w-full h-full object-cover object-center grayscale-[0.8] opacity-80 mix-blend-luminosity transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-5xl font-display text-white">
                                            {profile?.name?.split(" ").map((n) => n.charAt(0)).join("") || "KA"}
                                        </div>
                                    )}
                                </div>

                                {/* Data readout overlay */}
                                <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    <span className="text-[10px] font-mono text-accent bg-primary/90 px-2 py-1 border border-accent/30 tracking-wider">
                                        SRC: {profile?.name || "KEVIN_A"}
                                    </span>
                                    <span className="text-[10px] font-mono text-accent/80 bg-primary/90 px-2 py-1 border border-accent/30 tracking-wider">
                                        STATUS: ONLINE_
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {highlights.map((item) => (
                                    <span key={item} className="chip border-accent/40 text-accent">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="absolute -right-3 -bottom-5 rounded-none bg-secondary/95 border border-white/10 px-4 py-3 text-sm text-white/60 shadow-2xl">
                            Based in Indonesia
                        </div>
                    </div>
                </div>
            </div>

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
