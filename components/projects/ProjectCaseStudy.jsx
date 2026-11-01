"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Cpu,
    Calendar,
    Clock,
    CheckCircle2,
    ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUpVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const CATEGORY_LABELS = {
    "deep-learning": "DEEP LEARNING",
    "machine-learning": "MACHINE LEARNING",
    nlp: "NATURAL LANGUAGE PROCESSING",
    "data-science": "DATA SCIENCE",
    "data-engineering": "DATA ENGINEERING",
    mlops: "MLOPS",
};

function formatCategory(cat) {
    return CATEGORY_LABELS[cat] || String(cat || "DATA SCIENCE").toUpperCase();
}

export default function ProjectCaseStudy({ project, relatedProjects = [] }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [project?.slug]);

    const primaryRole =
        project.projectRole ||
        (project.category === "data-engineering"
            ? "Data Engineer"
            : project.category === "mlops"
            ? "MLOps Engineer"
            : "ML Engineer & Data Scientist");

    return (
        <div className="min-h-screen bg-primary text-white selection:bg-accent selection:text-primary pb-28">
            {/* Sticky Navigation Bar */}
            <div className="sticky top-0 z-40 bg-primary/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/#projects"
                        className="group flex items-center gap-2 text-white/70 hover:text-accent font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Projects</span>
                    </Link>
                    <span className="font-mono text-[11px] text-white/45 tracking-wider uppercase">
                        CASE STUDY / {formatCategory(project.category)}
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* 1. Project Hero */}
                <div className="border-b border-white/10 pb-12 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-10 items-start">
                        <div>
                            <span className="font-mono text-xs text-accent uppercase tracking-[0.2em] mb-3 block">
                                {formatCategory(project.category)} / {project.year || "2026"}
                            </span>
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                                {project.title}
                            </h1>
                            <p className="mt-5 text-white/75 font-body text-base sm:text-lg leading-relaxed max-w-3xl">
                                {project.tagline || project.description}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {(project.technologies || []).map((tech) => (
                                    <span key={tech} className="chip border-accent/25 text-accent">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Action Links in Hero */}
                            <div className="mt-7 flex flex-wrap gap-3">
                                {project.liveUrl && project.liveUrl !== "#" && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 border border-accent bg-accent hover:bg-accent-hover text-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                                    >
                                        <ExternalLink size={14} />
                                        <span>Open Live Demo / Notebook</span>
                                    </a>
                                )}
                                {project.githubUrl && project.githubUrl !== "#" && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 border border-white/20 hover:border-accent hover:text-accent px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors bg-secondary/70"
                                    >
                                        <Github size={14} />
                                        <span>View Repository</span>
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Metadata Summary Panel */}
                        <div className="border border-white/10 bg-secondary/70 p-6 sm:p-7 grid grid-cols-2 gap-y-6 gap-x-4 font-mono">
                            <div className="border-r border-white/10 pr-4">
                                <span className="block text-[10px] uppercase tracking-wider text-white/45 mb-1">
                                    Role
                                </span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-semibold">
                                    <Cpu size={14} className="text-accent shrink-0" />
                                    <span>{primaryRole}</span>
                                </div>
                            </div>
                            <div className="pl-2">
                                <span className="block text-[10px] uppercase tracking-wider text-white/45 mb-1">
                                    Status
                                </span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-semibold">
                                    <CheckCircle2 size={14} className="text-accent shrink-0" />
                                    <span>{project.status || "Completed"}</span>
                                </div>
                            </div>
                            <div className="border-t border-r border-white/10 pt-5 pr-4">
                                <span className="block text-[10px] uppercase tracking-wider text-white/45 mb-1">
                                    Category
                                </span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-semibold">
                                    <Clock size={14} className="text-accent shrink-0" />
                                    <span>{formatCategory(project.category)}</span>
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-5 pl-2">
                                <span className="block text-[10px] uppercase tracking-wider text-white/45 mb-1">
                                    Year
                                </span>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-semibold">
                                    <Calendar size={14} className="text-accent shrink-0" />
                                    <span>{project.year || "2026"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Featured Visual */}
                {project.image && (
                    <div className="mb-16 overflow-hidden border border-white/10 aspect-[16/9] max-h-[520px] w-full bg-secondary relative">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Case Study Body */}
                <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-16 items-start mb-20">
                    {/* Section Jump Links */}
                    <nav
                        aria-label="Case study sections"
                        className="lg:sticky lg:top-24 space-y-3 text-xs font-mono border-l border-white/10 pl-4"
                    >
                        <a href="#overview" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                            01. Overview
                        </a>
                        {project.challenge && (
                            <a href="#challenge" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                                02. Challenge
                            </a>
                        )}
                        {project.solution && (
                            <a href="#solution" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                                03. Solution
                            </a>
                        )}
                        {project.process?.length > 0 && (
                            <a href="#process" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                                04. Engineering Process
                            </a>
                        )}
                        {project.metrics?.length > 0 && (
                            <a href="#results" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                                05. Verifiable Metrics
                            </a>
                        )}
                        {project.gallery?.length > 0 && (
                            <a href="#gallery" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                                06. Artifacts & Visuals
                            </a>
                        )}
                        {project.learnings?.length > 0 && (
                            <a href="#learnings" className="block uppercase tracking-wider text-white/55 hover:text-accent transition-colors">
                                07. Key Learnings
                            </a>
                        )}
                    </nav>

                    <div className="space-y-16">
                        {/* Overview */}
                        <motion.section
                            id="overview"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUpVariants}
                            className="scroll-mt-24 space-y-3"
                        >
                            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                                01. Overview
                            </h2>
                            <p className="text-white/75 leading-relaxed font-body text-base">
                                {project.overview || project.fullDescription || project.description}
                            </p>
                        </motion.section>

                        {/* Challenge */}
                        {project.challenge && (
                            <motion.section
                                id="challenge"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariants}
                                className="scroll-mt-24 space-y-3"
                            >
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                                    02. Problem & Technical Challenge
                                </h2>
                                <p className="text-white/75 leading-relaxed font-body text-base">
                                    {project.challenge}
                                </p>
                            </motion.section>
                        )}

                        {/* Solution */}
                        {project.solution && (
                            <motion.section
                                id="solution"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariants}
                                className="scroll-mt-24 space-y-3 border-l-2 border-accent pl-5"
                            >
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-accent">
                                    03. Engineering Approach & Solution
                                </h2>
                                <p className="text-white/80 leading-relaxed font-body text-base">
                                    {project.solution}
                                </p>
                            </motion.section>
                        )}

                        {/* Process */}
                        {project.process && project.process.length > 0 && (
                            <motion.section
                                id="process"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariants}
                                className="scroll-mt-24 space-y-6"
                            >
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                                    04. Engineering Process
                                </h2>
                                <div className="relative pl-8 border-l border-white/15 space-y-8 py-1">
                                    {project.process.map((step, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[41px] top-0.5 flex h-6 w-6 items-center justify-center border border-accent bg-primary text-[10px] font-mono text-accent">
                                                {String(i + 1).padStart(2, "0")}
                                            </div>
                                            <h3 className="font-display text-base font-bold text-white mb-1">
                                                {step.phase}
                                            </h3>
                                            <p className="text-white/70 text-sm leading-relaxed font-body">
                                                {step.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Metrics */}
                        {project.metrics && project.metrics.length > 0 && (
                            <motion.section
                                id="results"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariants}
                                className="scroll-mt-24 space-y-5"
                            >
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                                    05. Verifiable Results & Metrics
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {project.metrics.map((metric, i) => (
                                        <div
                                            key={i}
                                            className="border border-white/10 bg-secondary/70 p-6"
                                        >
                                            <span className="block text-3xl sm:text-4xl font-display font-bold text-accent leading-none mb-2">
                                                {metric.value}
                                            </span>
                                            <span className="block font-mono text-xs uppercase tracking-wider text-white font-semibold mb-1">
                                                {metric.label}
                                            </span>
                                            <span className="block text-xs text-white/55">
                                                {metric.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Gallery */}
                        {project.gallery && project.gallery.length > 0 && (
                            <motion.section
                                id="gallery"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariants}
                                className="scroll-mt-24 space-y-5"
                            >
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                                    06. Artifacts, Plots & Dashboards
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {project.gallery.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="border border-white/10 bg-secondary/60 p-4 space-y-3"
                                        >
                                            <div className="overflow-hidden aspect-[4/3] w-full border border-white/10 bg-primary">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-display font-bold text-white text-sm">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Learnings */}
                        {project.learnings && project.learnings.length > 0 && (
                            <motion.section
                                id="learnings"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUpVariants}
                                className="scroll-mt-24 space-y-4"
                            >
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                                    07. Key Technical Learnings
                                </h2>
                                <div className="grid gap-3">
                                    {project.learnings.map((learning, i) => (
                                        <div
                                            key={i}
                                            className="flex gap-3.5 items-start border border-white/10 bg-secondary/50 p-4 text-sm text-white/75"
                                        >
                                            <span className="font-mono text-xs text-accent font-semibold mt-0.5">
                                                {String(i + 1).padStart(2, "0")}.
                                            </span>
                                            <span className="leading-relaxed">{learning}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </div>

                {/* Related Case Studies */}
                {relatedProjects && relatedProjects.length > 0 && (
                    <div className="border-t border-white/10 pt-16">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent block mb-1">
                                    Continue Exploring
                                </span>
                                <h2 className="font-display text-2xl font-bold text-white">
                                    Other Case Studies
                                </h2>
                            </div>
                            <Link
                                href="/#projects"
                                className="font-mono text-xs text-accent hover:underline"
                            >
                                View all projects →
                            </Link>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {relatedProjects.map((proj) => (
                                <Link
                                    key={proj.id || proj.slug}
                                    href={`/projects/${proj.slug}`}
                                    className="group border border-white/10 bg-secondary/60 hover:border-accent/40 p-5 flex flex-col justify-between gap-4 transition-colors"
                                >
                                    <div>
                                        <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                                            {formatCategory(proj.category)}
                                        </span>
                                        <h3 className="font-display text-base font-bold text-white group-hover:text-accent transition-colors mt-1.5 leading-snug">
                                            {proj.title}
                                        </h3>
                                        <p className="text-xs text-white/60 mt-2 line-clamp-2">
                                            {proj.description || proj.tagline}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-xs text-accent">
                                        <span>Read case study</span>
                                        <ArrowUpRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}