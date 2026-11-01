"use client";

import { ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { useProjects } from "@/context/ProjectsContext";
import { useCertificates } from "@/context/CertificatesContext";
import { motion } from "framer-motion";

const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            delay,
            ease: [0.22, 1, 0.36, 1],
        },
    },
});

const Hero = () => {
    const { profile, education } = useProfile();
    const { projects } = useProjects();
    const { certificates } = useCertificates();

    const scrollToSection = (selector) => {
        document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    };

    const primaryEducation = education?.[0];
    const focusDomains = [
        "Data Science & EDA",
        "Predictive Machine Learning",
        "MLOps & Workflow Orchestration",
        "Spatial & BI Dashboards",
    ];

    const summaryMetrics = [
        {
            value: String(projects?.length || 6),
            label: "Documented Case Studies",
        },
        {
            value: String(certificates?.length || 11),
            label: "Verified Certifications",
        },
        {
            value: "End-to-End",
            label: "Data, Modeling & MLOps",
        },
    ];

    return (
        <section
            id="home"
            className="relative w-full min-h-[88vh] flex flex-col justify-between overflow-hidden pt-24 pb-12 border-b border-white/10"
        >
            <div className="absolute inset-0 hero-surface pointer-events-none" />
            <div className="absolute inset-0 hero-grid pointer-events-none" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex items-center">
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16 items-center w-full py-6 lg:py-10">
                    {/* Left Column: Identity, Headline, CTAs */}
                    <div className="flex flex-col">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp(0)}
                            className="flex flex-wrap items-center gap-3"
                        >
                            <span className="inline-flex items-center gap-2 border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium text-accent">
                                <span className="w-1.5 h-1.5 bg-accent" />
                                {profile?.availabilityStatus || "Available for Data Science, ML & MLOps Roles"}
                            </span>
                            <span className="font-mono text-[11px] text-white/45 uppercase tracking-wider">
                                {primaryEducation?.institution || "Universitas Sriwijaya"} · Computer Systems
                            </span>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp(0.05)}
                            className="mt-5"
                        >
                            <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-accent font-semibold">
                                {profile?.name || "Kevin Adiputra Mahesa"} —{" "}
                                <span className="text-white/80">
                                    {profile?.title || "Machine Learning Engineer & Data Scientist"}
                                </span>
                            </p>
                            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold tracking-tight text-white leading-[1.12] mt-3 max-w-2xl">
                                Building machine learning models, analytical dashboards, and reproducible data pipelines.
                            </h1>
                        </motion.div>

                        <motion.p
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp(0.1)}
                            className="mt-5 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed"
                        >
                            {profile?.bio ||
                                "Computer Systems undergraduate at Universitas Sriwijaya focused on Data Science, Machine Learning, and MLOps. Experienced in building predictive models, spatial analytics dashboards, automated ETL workflows, and reproducible deployment pipelines."}
                        </motion.p>

                        {/* Primary & Secondary CTAs */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp(0.15)}
                            className="flex flex-wrap items-center gap-3.5 mt-7"
                        >
                            <button
                                type="button"
                                onClick={() => scrollToSection("#projects")}
                                className="inline-flex items-center justify-center h-12 px-6 text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold border border-accent bg-accent hover:bg-accent-hover text-primary transition-all duration-200 active:translate-y-0 gap-2"
                            >
                                <span>View Selected Projects</span>
                                <ArrowRight size={15} />
                            </button>

                            {profile?.cvUrl && (
                                <a
                                    href={profile.cvUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center h-12 px-6 text-xs sm:text-sm font-mono uppercase tracking-wider font-medium border border-white/15 bg-secondary/90 hover:border-accent/50 hover:text-accent text-white/85 transition-colors duration-200 gap-2"
                                >
                                    <Download size={15} />
                                    <span>Download CV</span>
                                </a>
                            )}
                        </motion.div>

                        {/* Verifiable Portfolio Summary */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp(0.2)}
                            className="grid grid-cols-3 gap-3 mt-9 pt-7 border-t border-white/10 max-w-xl"
                        >
                            {summaryMetrics.map((stat) => (
                                <div key={stat.label} className="border border-white/10 bg-secondary/60 p-3.5">
                                    <div className="text-lg sm:text-xl font-display font-bold text-accent leading-none">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1.5 text-[11px] font-mono text-white/55 leading-snug">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Direct Social & Contact Links */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp(0.24)}
                            className="flex flex-wrap items-center gap-4 mt-6"
                        >
                            <div className="flex items-center gap-2.5">
                                {[
                                    {
                                        icon: Github,
                                        label: "GitHub profile",
                                        url: profile?.github || "https://github.com/Kevinadiputra",
                                    },
                                    {
                                        icon: Linkedin,
                                        label: "LinkedIn profile",
                                        url:
                                            profile?.linkedin ||
                                            "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/",
                                    },
                                    {
                                        icon: Mail,
                                        label: "Send email",
                                        url: `mailto:${profile?.email || "kevinadiputra66@gmail.com"}`,
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;
                                    const isMail = item.url.startsWith("mailto:");
                                    return (
                                        <a
                                            key={item.label}
                                            href={item.url}
                                            target={isMail ? undefined : "_blank"}
                                            rel={isMail ? undefined : "noopener noreferrer"}
                                            className="w-9 h-9 bg-secondary border border-white/10 hover:border-accent hover:text-accent text-white/75 flex items-center justify-center transition-colors duration-200"
                                            aria-label={item.label}
                                        >
                                            <Icon size={15} />
                                        </a>
                                    );
                                })}
                            </div>
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-white/50">
                                <MapPin size={13} className="text-accent" />
                                {profile?.location || "Palembang, Indonesia"}
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Column: Structured Profile Card */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp(0.12)}
                        className="flex justify-center lg:justify-end w-full"
                    >
                        <div className="border border-white/12 bg-secondary/90 p-5 sm:p-6 w-full max-w-[350px] flex flex-col gap-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-[11px]">
                                <span className="text-white/60 uppercase tracking-wider">Engineer Profile</span>
                                <span className="text-accent">S1 Sistem Komputer</span>
                            </div>

                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-primary border border-white/10">
                                {profile?.profilePicture &&
                                profile.profilePicture !== "/api/placeholder/400/400" ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt={profile?.name || "Kevin Adiputra Mahesa"}
                                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-display text-white">
                                        KA
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-1">
                                <div>
                                    <div className="font-mono text-[10px] uppercase tracking-wider text-white/45 mb-2">
                                        Technical Focus
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {focusDomains.map((item) => (
                                            <span
                                                key={item}
                                                className="text-[11px] font-mono px-2 py-0.5 bg-primary/70 border border-white/10 text-white/75"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs font-mono">
                                    <span className="text-white/45">Primary Stack</span>
                                    <span className="text-accent">Python · SQL · Airflow · MLflow</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
