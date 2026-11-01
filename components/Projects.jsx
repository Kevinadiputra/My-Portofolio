"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github, FolderGit2 } from "lucide-react";
import { useProjects } from "@/context/ProjectsContext";
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
    "deep-learning": "Deep Learning",
    "machine-learning": "Machine Learning",
    nlp: "Natural Language Processing",
    "data-science": "Data Science",
    "data-engineering": "Data Engineering",
    mlops: "MLOps",
};

function formatCategory(cat) {
    if (!cat) return "Data Science";
    return CATEGORY_LABELS[cat] || cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const Projects = () => {
    const [filter, setFilter] = useState("all");
    const { projects, loading } = useProjects();

    const homepageProjects = useMemo(
        () => (projects || []).filter((p) => p.showOnHomepage !== false),
        [projects]
    );

    const filters = useMemo(() => {
        const base = [
            { key: "all", label: "All Projects" },
            { key: "featured", label: "Featured Case Studies" },
            { key: "mlops", label: "MLOps" },
            { key: "data-engineering", label: "Data Engineering" },
            { key: "data-science", label: "Data Science" },
            { key: "deep-learning", label: "Deep Learning" },
            { key: "nlp", label: "NLP" },
        ];
        return base.filter(
            (item) =>
                item.key === "all" ||
                item.key === "featured" ||
                homepageProjects.some((p) => p.category === item.key)
        );
    }, [homepageProjects]);

    const getProjectCount = (key) => {
        if (key === "all") return homepageProjects.length;
        if (key === "featured") return homepageProjects.filter((p) => p.featured || p.highlight).length;
        return homepageProjects.filter((p) => p.category === key).length;
    };

    const filteredProjects = useMemo(() => {
        return homepageProjects.filter((project) => {
            if (filter === "all") return true;
            if (filter === "featured") return project.featured || project.highlight;
            return project.category === filter;
        });
    }, [homepageProjects, filter]);

    const featuredList = useMemo(
        () => filteredProjects.filter((p) => p.featured || p.highlight),
        [filteredProjects]
    );

    const standardList = useMemo(
        () =>
            filter === "featured"
                ? []
                : filteredProjects.filter((p) => !(p.featured || p.highlight)),
        [filteredProjects, filter]
    );

    if (loading) {
        return (
            <section id="projects" className="relative bg-primary py-24 border-b border-white/10">
                <div className="section-shell grid gap-6 md:grid-cols-2">
                    {[0, 1, 2, 3].map((item) => (
                        <div key={item} className="skeleton h-80" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="relative bg-primary py-24 text-white border-b border-white/10">
            <div className="section-shell relative z-10">
                {/* Section Header */}
                <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2 block">
                            02 / Selected Work & Case Studies
                        </span>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Projects & Engineering Evidence
                        </motion.h2>
                    </div>
                    <p className="text-white/65 font-body text-sm sm:text-base leading-relaxed max-w-xl">
                        Each case study documents the problem statement, technical approach, core stack, and
                        verifiable evaluation metrics.
                    </p>
                </div>

                {/* Category Filter Tabs */}
                <div
                    role="tablist"
                    aria-label="Filter projects by category"
                    className="mb-12 flex flex-wrap gap-2 border-b border-white/10 pb-5"
                >
                    {filters.map((filterOption) => {
                        const isActive = filter === filterOption.key;
                        const count = getProjectCount(filterOption.key);
                        return (
                            <button
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                key={filterOption.key}
                                onClick={() => setFilter(filterOption.key)}
                                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-colors duration-200 ${
                                    isActive
                                        ? "border-accent bg-accent text-primary font-semibold"
                                        : "border-white/10 bg-secondary/70 text-white/65 hover:border-accent/40 hover:text-white"
                                }`}
                            >
                                <span>{filterOption.label}</span>
                                <span
                                    className={`ml-1.5 text-[10px] ${
                                        isActive ? "text-primary/80" : "text-white/40"
                                    }`}
                                >
                                    ({count})
                                </span>
                            </button>
                        );
                    })}
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="border border-white/10 p-14 text-center bg-secondary/40">
                        <FolderGit2 size={28} className="text-accent mx-auto mb-3" />
                        <h3 className="font-display text-lg font-bold text-white">
                            No projects in this category
                        </h3>
                        <p className="text-white/55 font-mono text-xs mt-1">
                            Select another filter above to view all documented projects.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Featured Case Studies */}
                        {featuredList.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                                        Featured Case Studies ({featuredList.length})
                                    </h3>
                                    <span className="font-mono text-[11px] text-white/45">
                                        Primary Engineering Systems
                                    </span>
                                </div>

                                <div className="grid gap-8">
                                    {featuredList.map((project, index) => (
                                        <FeaturedProjectCard
                                            key={project.id || project.slug}
                                            project={project}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional / Technical Archive Projects */}
                        {standardList.length > 0 && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-white/75 font-semibold">
                                        Additional Experiments & Models ({standardList.length})
                                    </h3>
                                    <span className="font-mono text-[11px] text-white/45">
                                        Applied Deep Learning & NLP
                                    </span>
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {standardList.map((project, index) => (
                                        <StandardProjectCard
                                            key={project.id || project.slug}
                                            project={project}
                                            index={index + featuredList.length}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

function FeaturedProjectCard({ project, index }) {
    const hasGithub = project.githubUrl && project.githubUrl !== "#";
    const hasLive = project.liveUrl && project.liveUrl !== "#";
    const topMetrics = Array.isArray(project.metrics) ? project.metrics.slice(0, 4) : [];

    return (
        <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUpVariants}
            className="group border border-white/12 bg-secondary/75 hover:border-accent/40 transition-colors duration-200"
        >
            <div className="grid lg:grid-cols-[0.95fr_1.25fr] gap-0">
                {/* Project Visual */}
                <Link
                    href={`/projects/${project.slug}`}
                    className="relative block bg-primary border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[320px]"
                    aria-label={`View ${project.title} case study`}
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        loading={index < 2 ? "eager" : "lazy"}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-primary/90 border border-accent/40 font-mono text-[10px] uppercase tracking-wider text-accent font-semibold">
                            Featured · {formatCategory(project.category)}
                        </span>
                        {project.year && (
                            <span className="px-2 py-1 bg-primary/90 border border-white/15 font-mono text-[10px] text-white/80">
                                {project.year}
                            </span>
                        )}
                    </div>
                </Link>

                {/* Case Study Details */}
                <div className="p-6 sm:p-8 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-white/50">
                            <span>
                                {String(index + 1).padStart(2, "0")} ·{" "}
                                {project.projectRole || "ML Engineer & Data Scientist"}
                            </span>
                            <span className="text-accent">{project.status || "Completed"}</span>
                        </div>

                        <Link href={`/projects/${project.slug}`} className="block group/title">
                            <h4 className="font-display text-xl sm:text-2xl font-bold text-white group-hover/title:text-accent transition-colors leading-snug">
                                {project.title}
                            </h4>
                        </Link>

                        <p className="text-sm text-white/75 leading-relaxed">
                            {project.description || project.tagline}
                        </p>

                        {/* Problem & Approach Summary */}
                        <div className="grid sm:grid-cols-2 gap-3 pt-1">
                            {project.challenge && (
                                <div className="border-l-2 border-white/20 pl-3 py-0.5">
                                    <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                                        Problem Addressed
                                    </div>
                                    <p className="text-xs text-white/70 mt-1 line-clamp-3 leading-relaxed">
                                        {project.challenge}
                                    </p>
                                </div>
                            )}
                            {project.solution && (
                                <div className="border-l-2 border-accent pl-3 py-0.5">
                                    <div className="font-mono text-[10px] uppercase tracking-wider text-accent">
                                        Technical Approach
                                    </div>
                                    <p className="text-xs text-white/70 mt-1 line-clamp-3 leading-relaxed">
                                        {project.solution}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Verifiable Results / Metrics */}
                        {topMetrics.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                                {topMetrics.map((metric, mIdx) => (
                                    <div
                                        key={mIdx}
                                        className="border border-white/10 bg-primary/60 px-3 py-2"
                                    >
                                        <div className="font-display text-sm sm:text-base font-bold text-accent leading-tight">
                                            {metric.value}
                                        </div>
                                        <div className="font-mono text-[10px] text-white/55 truncate mt-0.5">
                                            {metric.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer: Technologies & Action Links */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-1.5">
                            {(project.technologies || []).slice(0, 6).map((tech) => (
                                <span
                                    key={tech}
                                    className="font-mono text-[11px] px-2.5 py-0.5 border border-white/10 bg-primary/70 text-white/75"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                            {hasGithub && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/15 bg-primary/80 hover:border-accent hover:text-accent text-xs font-mono text-white/80 transition-colors"
                                >
                                    <Github size={13} />
                                    <span>Repository</span>
                                </a>
                            )}
                            {hasLive && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/15 bg-primary/80 hover:border-accent hover:text-accent text-xs font-mono text-white/80 transition-colors"
                                >
                                    <ExternalLink size={13} />
                                    <span>Live Demo</span>
                                </a>
                            )}
                            <Link
                                href={`/projects/${project.slug}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 border border-accent bg-accent hover:bg-accent-hover text-primary text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
                            >
                                <span>Case Study</span>
                                <ArrowUpRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

function StandardProjectCard({ project, index }) {
    const hasGithub = project.githubUrl && project.githubUrl !== "#";
    const hasLive = project.liveUrl && project.liveUrl !== "#";
    const topMetrics = Array.isArray(project.metrics) ? project.metrics.slice(0, 2) : [];

    return (
        <motion.article
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUpVariants}
            className="group border border-white/10 bg-secondary/60 hover:border-accent/40 transition-colors duration-200 flex flex-col justify-between"
        >
            <div>
                <Link
                    href={`/projects/${project.slug}`}
                    className="relative block aspect-[16/9] w-full overflow-hidden bg-primary border-b border-white/10"
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 bg-primary/90 border border-white/15 font-mono text-[10px] uppercase tracking-wider text-accent">
                            {formatCategory(project.category)}
                        </span>
                        {project.year && (
                            <span className="px-2 py-0.5 bg-primary/90 border border-white/10 font-mono text-[10px] text-white/70">
                                {project.year}
                            </span>
                        )}
                    </div>
                </Link>

                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between font-mono text-[11px] text-white/45">
                        <span>
                            {String(index + 1).padStart(2, "0")} ·{" "}
                            {project.projectRole || "ML Engineer"}
                        </span>
                        <span>{project.status || "Completed"}</span>
                    </div>

                    <Link href={`/projects/${project.slug}`} className="block group/title">
                        <h4 className="font-display text-lg sm:text-xl font-bold text-white group-hover/title:text-accent transition-colors leading-snug">
                            {project.title}
                        </h4>
                    </Link>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                        {project.description || project.tagline}
                    </p>

                    {project.solution && (
                        <div className="border-l-2 border-accent/60 pl-3 py-0.5">
                            <span className="font-mono text-[10px] uppercase text-accent block">
                                Approach
                            </span>
                            <p className="text-xs text-white/65 line-clamp-2 mt-0.5">
                                {project.solution}
                            </p>
                        </div>
                    )}

                    {topMetrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            {topMetrics.map((metric, mIdx) => (
                                <div
                                    key={mIdx}
                                    className="border border-white/10 bg-primary/50 px-3 py-2"
                                >
                                    <div className="font-display text-sm font-bold text-accent">
                                        {metric.value}
                                    </div>
                                    <div className="font-mono text-[10px] text-white/50 truncate">
                                        {metric.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-white/10 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                    {(project.technologies || []).slice(0, 5).map((tech) => (
                        <span
                            key={tech}
                            className="font-mono text-[10px] px-2 py-0.5 border border-white/10 bg-primary/60 text-white/70"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <div className="flex items-center gap-2">
                        {hasGithub && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-white/15 hover:border-accent hover:text-accent text-xs font-mono text-white/75 transition-colors"
                            >
                                <Github size={12} />
                                <span>Code</span>
                            </a>
                        )}
                        {hasLive && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-white/15 hover:border-accent hover:text-accent text-xs font-mono text-white/75 transition-colors"
                            >
                                <ExternalLink size={12} />
                                <span>Demo / Notebook</span>
                            </a>
                        )}
                    </div>

                    <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-accent hover:underline"
                    >
                        <span>Read Case Study</span>
                        <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>
        </motion.article>
    );
}

export default Projects;
