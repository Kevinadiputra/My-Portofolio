"use client";

import React, { useState, useEffect } from "react";
import { useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github, Cpu, Calendar, Clock, CheckCircle2, ChevronRight, ArrowUpRight } from "lucide-react";
import { useProjects } from "@/context/ProjectsContext";
import { motion } from "framer-motion";

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

export default function ProjectPage({ params }) {
    const resolvedParams = React.use(params);
    const { slug } = resolvedParams;
    const { projects, loading } = useProjects();
    const router = useRouter();
    const [hoveredSlug, setHoveredSlug] = useState(null);

    // Find current project
    const project = projects?.find((p) => p.slug === slug);
    // Find related projects (filter out current project and show up to 3)
    const relatedProjects = projects?.filter((p) => p.slug !== slug).slice(0, 3);

    useEffect(() => {
        // Enforce scroll to top on page mount / slug transition
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-6 w-6 animate-spin border-2 border-accent border-t-transparent" />
                    <span>Loading Case Study...</span>
                </div>
            </div>
        );
    }

    // Trigger Next.js native 404 page if project is not found
    if (!project) {
        notFound();
    }

    // Format categories for heading
    const formatCategory = (cat) => {
        const mapping = {
            "deep-learning": "DEEP LEARNING",
            "nlp": "NATURAL LANGUAGE PROCESSING",
            "data-science": "DATA SCIENCE",
            "data-engineering": "DATA ENGINEERING",
        };
        return mapping[cat] || cat.toUpperCase();
    };

    const isAnyHovered = hoveredSlug !== null;

    return (
        <div className="min-h-screen bg-[#0b0b12] text-white selection:bg-accent selection:text-primary pb-32">
            
            {/* Fine Header Line */}
            <div className="sticky top-0 z-40 bg-[#0b0b12]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <Link 
                        href="/" 
                        scroll={true}
                        className="group flex items-center gap-2 text-white/60 hover:text-accent font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-colors focus:outline-none"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Index</span>
                    </Link>
                    <span className="font-mono text-[10px] text-white/40 tracking-wider">
                        PROJECT CASE STUDY / {formatCategory(project.category)}
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                
                {/* 1. Project Hero */}
                <div className="border-b border-white/10 pb-12 mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
                        <div>
                            <span className="font-mono text-xs text-accent uppercase tracking-[0.25em] mb-4 block">
                                {formatCategory(project.category)} / {project.year}
                            </span>
                            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[0.95] text-white">
                                {project.title}
                            </h1>
                            <p className="mt-6 text-white/70 font-body text-lg sm:text-xl leading-relaxed max-w-3xl">
                                {project.tagline}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-2">
                                {project.technologies.slice(0, 4).map((tech) => (
                                    <span key={tech} className="chip border-accent/20 text-accent">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Top quick stats cards */}
                        <div className="border border-white/10 bg-white/[0.01] p-8 grid grid-cols-2 gap-y-6 gap-x-4 font-mono font-bold">
                            <div className="border-r border-white/5 pr-4">
                                <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Duration</span>
                                <div className="flex items-center gap-2 text-sm text-white/85">
                                    <Clock size={14} className="text-accent" />
                                    <span>{project.details?.duration || "3 months"}</span>
                                </div>
                            </div>
                            <div className="pl-4">
                                <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Status</span>
                                <div className="flex items-center gap-2 text-sm text-white/85">
                                    <CheckCircle2 size={14} className="text-accent" />
                                    <span>{project.status || "Completed"}</span>
                                </div>
                            </div>
                            <div className="border-t border-r border-white/5 pt-6 pr-4">
                                <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Primary Role</span>
                                <div className="flex items-center gap-2 text-sm text-white/85">
                                    <Cpu size={14} className="text-accent" />
                                    <span>{project.category === "data-engineering" ? "Data Engineer" : "ML Engineer"}</span>
                                </div>
                            </div>
                            <div className="border-t border-white/5 pt-6 pl-4">
                                <span className="block text-[9px] uppercase tracking-widest text-white/40 mb-1">Timeline</span>
                                <div className="flex items-center gap-2 text-sm text-white/85">
                                    <Calendar size={14} className="text-accent" />
                                    <span>{project.year}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Featured Visual */}
                <div className="mb-20 overflow-hidden rounded-2xl border border-white/10 aspect-[21/9] w-full bg-white/[0.01] group relative">
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12]/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Editorial Sections Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-12 lg:gap-20 items-start mb-24">
                    
                    {/* Sidebar Section Indicators */}
                    <div className="lg:sticky lg:top-28 space-y-4 text-xs font-mono border-l border-white/10 pl-4">
                        <a href="#overview" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">01. Overview</a>
                        <a href="#challenge" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">02. Challenge</a>
                        <a href="#solution" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">03. Solution</a>
                        <a href="#process" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">04. Timeline</a>
                        <a href="#tech" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">05. Tech Stack</a>
                        <a href="#results" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">06. Impact</a>
                        <a href="#learnings" className="block uppercase tracking-wider text-white/45 hover:text-accent transition-colors">07. Learnings</a>
                    </div>

                    {/* Case Study Body Content */}
                    <div className="space-y-20">
                        
                        {/* 3. Project Overview */}
                        <motion.section 
                            id="overview"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-4"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white">
                                01. Overview
                            </h2>
                            <p className="text-white/70 leading-relaxed font-body text-base md:text-lg">
                                {project.overview}
                            </p>
                        </motion.section>

                        {/* 4. Challenge */}
                        <motion.section 
                            id="challenge"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-4"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white">
                                02. Challenge
                            </h2>
                            <p className="text-white/70 leading-relaxed font-body text-base md:text-lg">
                                {project.challenge}
                            </p>
                        </motion.section>

                        {/* 5. Solution */}
                        <motion.section 
                            id="solution"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-4"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-accent">
                                03. Solution
                            </h2>
                            <p className="text-white/70 leading-relaxed font-body text-base md:text-lg">
                                {project.solution}
                            </p>
                        </motion.section>

                        {/* 6. Development Process Timeline */}
                        <motion.section 
                            id="process"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-6"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white mb-8">
                                04. Development Process
                            </h2>
                            <div className="relative pl-8 border-l-2 border-white/10 space-y-10 py-2">
                                {project.process.map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[41px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-[#0b0b12] text-[10px] font-mono text-accent">
                                            {String(i + 1).padStart(2, "0")}
                                        </div>
                                        <h4 className="font-display text-base font-bold text-white uppercase tracking-tight mb-2">
                                            {step.phase}
                                        </h4>
                                        <p className="text-white/60 text-sm leading-relaxed font-body">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                        {/* 7. Technology Stack */}
                        <motion.section 
                            id="tech"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-6"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white">
                                05. Technology Stack
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {project.technologies.map((tech) => (
                                    <span 
                                        key={tech} 
                                        className="bg-white/[0.03] border border-white/10 text-white/80 hover:border-accent/30 hover:text-accent font-mono text-xs px-4 py-2.5 transition-all duration-300 rounded-none cursor-default"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.section>

                        {/* 8. Results & Impact Statistics */}
                        <motion.section 
                            id="results"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-6"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white mb-6">
                                06. Results & Impact
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
                                {project.metrics.map((metric, i) => (
                                    <motion.div 
                                        key={i} 
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                        className="bg-[#0b0b12] p-8"
                                    >
                                        <span className="block text-4xl sm:text-5xl font-display font-extrabold text-accent leading-none mb-2 tracking-tighter">
                                            {metric.value}
                                        </span>
                                        <span className="block font-mono text-[10px] uppercase tracking-widest text-white mb-1 font-bold font-bold">
                                            {metric.label}
                                        </span>
                                        <span className="block text-xs text-white/45 leading-normal">
                                            {metric.description}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* 9. Gallery Section */}
                        {project.gallery && project.gallery.length > 0 && (
                            <motion.section 
                                id="gallery"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeUpVariants}
                                className="scroll-mt-28 space-y-6"
                            >
                                <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white mb-6">
                                    Visualizations & Dashboards
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {project.gallery.map((item, idx) => (
                                        <div key={idx} className="surface-card border border-white/10 p-5 space-y-4">
                                            <div className="overflow-hidden rounded-none aspect-[4/3] w-full border border-white/5 bg-[#12151d]">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.title} 
                                                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 hover:scale-[1.03] transition-all duration-500" 
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white uppercase text-sm">{item.title}</h4>
                                                <p className="mt-1 text-xs text-white/50 leading-relaxed font-body">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* 10. Key Learnings */}
                        <motion.section 
                            id="learnings"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="scroll-mt-28 space-y-6"
                        >
                            <h2 className="font-display text-2xl uppercase tracking-wider font-semibold text-white">
                                07. Key Learnings
                            </h2>
                            <div className="grid gap-4">
                                {project.learnings.map((learning, i) => (
                                    <div key={i} className="flex gap-4 items-start border border-white/5 bg-white/[0.01] p-5 font-mono text-xs text-white/70">
                                        <span className="text-accent font-semibold">{String(i + 1).padStart(2, "0")}.</span>
                                        <span className="leading-relaxed">{learning}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.section>

                    </div>
                </div>

                {/* External links and footer actions */}
                <div className="border-t border-white/10 pt-16 flex flex-col sm:flex-row justify-between items-center gap-8 mb-24">
                    <div className="flex gap-4 font-mono text-xs uppercase">
                        {project.liveUrl && project.liveUrl !== "#" && (
                            <a 
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-white/20 hover:border-accent hover:text-accent px-6 py-3 transition-colors bg-white/[0.01]"
                            >
                                <ExternalLink size={14} />
                                Live Demo
                            </a>
                        )}
                        {project.githubUrl && project.githubUrl !== "#" && (
                            <a 
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-white/20 hover:border-accent hover:text-accent px-6 py-3 transition-colors bg-white/[0.01]"
                            >
                                <Github size={14} />
                                Source Code
                            </a>
                        )}
                    </div>
                    
                    <Link 
                        href="/" 
                        scroll={true}
                        className="inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent hover:text-primary px-8 py-3 text-xs uppercase tracking-widest transition-all duration-300 font-mono font-bold"
                    >
                        Return to Index
                    </Link>
                </div>

                {/* 11. Related Projects */}
                {relatedProjects && relatedProjects.length > 0 && (
                    <div className="border-t border-white/10 pt-20">
                        <div className="mb-12">
                            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-3 block">
                                Recommendation
                            </span>
                            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white uppercase leading-none">
                                Related Projects
                            </h3>
                        </div>

                        <div className="relative border-t border-white/10">
                            {relatedProjects.map((proj, index) => {
                                const isHovered = hoveredSlug === proj.slug;
                                const displayIndex = String(index + 1).padStart(2, "0");

                                return (
                                    <motion.div
                                        key={proj.id}
                                        className="group relative border-b border-white/10"
                                        onMouseEnter={() => setHoveredSlug(proj.slug)}
                                        onMouseLeave={() => setHoveredSlug(null)}
                                        animate={{
                                            opacity: isAnyHovered ? (isHovered ? 1 : 0.25) : 1,
                                        }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        <Link
                                            href={`/projects/${proj.slug}`}
                                            scroll={true}
                                            className="grid w-full py-6 md:py-8 grid-cols-1 md:grid-cols-[50px_1fr_auto_40px] items-center gap-4 md:gap-8 focus:outline-none text-left"
                                            aria-label={`Open ${proj.title} case study`}
                                        >
                                            {/* Number */}
                                            <span className="font-mono text-xs md:text-sm tracking-wider text-white/40 group-hover:text-accent transition-colors duration-300">
                                                {displayIndex}.
                                            </span>

                                            {/* Title */}
                                            <div className="flex flex-col gap-2">
                                                <h3
                                                    className="font-display text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight leading-none transition-all duration-300 ease-out"
                                                    style={{
                                                        WebkitTextStroke: isHovered 
                                                            ? '1px transparent' 
                                                            : '1px rgba(255, 255, 255, 0.25)',
                                                        color: isHovered ? 'var(--color-accent)' : 'transparent',
                                                    }}
                                                >
                                                    {proj.title}
                                                </h3>
                                            </div>

                                            {/* Category / Metadata */}
                                            <div className="flex flex-col items-start md:items-end gap-1 font-mono md:text-right text-xs md:text-sm">
                                                <span className="text-[10px] tracking-[0.2em] font-semibold text-accent uppercase">
                                                    {formatCategory(proj.category)}
                                                </span>
                                                <span className="text-white/60 uppercase">
                                                    {proj.technologies.slice(0, 2).join(" / ")}
                                                </span>
                                            </div>

                                            {/* Arrow Icon */}
                                            <div className="flex justify-end">
                                                <ArrowUpRight 
                                                    className="w-5 h-5 text-white/40 group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ease-out" 
                                                />
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
