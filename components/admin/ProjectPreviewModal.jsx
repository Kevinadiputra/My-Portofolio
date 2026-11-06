"use client";

import {
    Calendar,
    CheckCircle2,
    Cpu,
    ExternalLink,
    Github,
    Sparkles,
    X,
} from "lucide-react";

const CATEGORY_LABELS = {
    "deep-learning": "DEEP LEARNING",
    "machine-learning": "MACHINE LEARNING",
    nlp: "NATURAL LANGUAGE PROCESSING",
    "data-science": "DATA SCIENCE",
    "data-engineering": "DATA ENGINEERING",
    mlops: "MLOPS",
};

export default function ProjectPreviewModal({ project, onClose }) {
    if (!project) return null;

    const categoryLabel =
        CATEGORY_LABELS[project.category] ||
        String(project.category || "DATA SCIENCE").toUpperCase();

    const technologies = Array.isArray(project.technologies) ? project.technologies : [];
    const gallery = Array.isArray(project.gallery_urls) ? project.gallery_urls : [];
    const learnings = Array.isArray(project.learnings) ? project.learnings : [];

    let metrics = [];
    if (Array.isArray(project.metrics)) {
        metrics = project.metrics;
    } else if (typeof project.metrics === "string" && project.metrics.trim()) {
        try {
            metrics = JSON.parse(project.metrics);
        } catch {
            metrics = [];
        }
    }

    let process = [];
    if (Array.isArray(project.process)) {
        process = project.process;
    } else if (typeof project.process === "string" && project.process.trim()) {
        try {
            process = JSON.parse(project.process);
        } catch {
            process = [];
        }
    }

    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div
                className="w-[94vw] max-w-4xl max-h-[90dvh] overflow-y-auto bg-primary border border-white/15 p-6 sm:p-8 space-y-8 shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Bar */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="font-mono text-xs text-accent tracking-widest uppercase font-semibold">
                            PUBLIC CASE STUDY PREVIEW
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-white/10 text-white/70">
                            {project.is_published ? "Published" : "Draft"}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="admin-icon-btn h-8 w-8"
                        aria-label="Close preview"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Cover Image Hero */}
                {project.thumbnail_url && (
                    <div className="w-full aspect-[16/9] max-h-[380px] overflow-hidden border border-white/10 bg-secondary relative">
                        <img
                            src={project.thumbnail_url}
                            alt={project.title || "Project Cover"}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-accent text-primary px-2.5 py-1 text-[11px] font-mono font-bold tracking-wider uppercase">
                            Cover Image
                        </div>
                    </div>
                )}

                {/* Title & Metadata Hero */}
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-accent">
                        <span>{categoryLabel}</span>
                        {project.project_role && <span>· {project.project_role}</span>}
                        {project.start_date && (
                            <span className="text-white/45">
                                · {project.start_date} {project.end_date ? `— ${project.end_date}` : ""}
                            </span>
                        )}
                    </div>

                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                        {project.title || "Untitled Project"}
                    </h1>

                    {(project.tagline || project.short_description) && (
                        <p className="text-base sm:text-lg text-white/80 font-body leading-relaxed max-w-3xl">
                            {project.tagline || project.short_description}
                        </p>
                    )}

                    {/* Technologies Tags */}
                    {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 text-xs font-mono bg-accent/15 text-accent border border-accent/30"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Links */}
                    {(project.live_url || project.github_url) && (
                        <div className="flex flex-wrap gap-3 pt-3">
                            {project.live_url && (
                                <a
                                    href={project.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-primary-action inline-flex items-center gap-1.5 text-xs py-2 px-4"
                                >
                                    <ExternalLink size={13} />
                                    <span>Live Demo</span>
                                </a>
                            )}
                            {project.github_url && (
                                <a
                                    href={project.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="admin-secondary-action inline-flex items-center gap-1.5 text-xs py-2 px-4"
                                >
                                    <Github size={13} />
                                    <span>Source Code</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* Full Description / Overview */}
                {(project.full_description || project.overview) && (
                    <div className="space-y-2 border-t border-white/10 pt-6">
                        <h3 className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
                            01. Project Overview &amp; Architecture
                        </h3>
                        <p className="text-sm text-white/75 leading-relaxed whitespace-pre-line font-body">
                            {project.full_description || project.overview}
                        </p>
                    </div>
                )}

                {/* Challenge & Solution */}
                {(project.challenge || project.solution) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6">
                        {project.challenge && (
                            <div className="p-4 bg-secondary/50 border border-white/10 space-y-2">
                                <h4 className="font-mono text-xs font-bold text-amber-300 tracking-wider uppercase">
                                    Problem / Challenge
                                </h4>
                                <p className="text-xs text-white/70 leading-relaxed font-body">
                                    {project.challenge}
                                </p>
                            </div>
                        )}
                        {project.solution && (
                            <div className="p-4 bg-secondary/50 border border-white/10 space-y-2">
                                <h4 className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
                                    Technical Solution
                                </h4>
                                <p className="text-xs text-white/70 leading-relaxed font-body">
                                    {project.solution}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Verifiable Metrics */}
                {metrics.length > 0 && (
                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
                            Verifiable Metrics &amp; Performance
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {metrics.map((m, idx) => (
                                <div key={idx} className="p-4 bg-secondary/70 border border-white/10 space-y-1">
                                    <span className="block text-2xl font-display font-bold text-accent">
                                        {m.value}
                                    </span>
                                    <span className="block font-mono text-xs uppercase text-white font-semibold">
                                        {m.label}
                                    </span>
                                    {m.description && (
                                        <span className="block text-[11px] text-white/50">
                                            {m.description}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Engineering Process Steps */}
                {process.length > 0 && (
                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
                            Engineering Process &amp; Methodology
                        </h3>
                        <div className="space-y-2">
                            {process.map((step, idx) => (
                                <div key={idx} className="p-3 bg-secondary/50 border border-white/10 space-y-1">
                                    <span className="font-mono text-xs text-accent font-semibold block">
                                        {step.phase || `Phase ${idx + 1}`}
                                    </span>
                                    <p className="text-xs text-white/70 leading-relaxed font-body">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Screenshot Gallery */}
                {gallery.length > 0 && (
                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
                            Visual Artifacts &amp; Screenshots ({gallery.length})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gallery.map((imgUrl, idx) => (
                                <div key={idx} className="border border-white/10 bg-secondary/40 overflow-hidden space-y-2 p-2">
                                    <div className="aspect-video w-full overflow-hidden bg-primary">
                                        <img
                                            src={imgUrl}
                                            alt={`Artifact ${idx + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    </div>
                                    <span className="text-[11px] font-mono text-white/50 px-1 block truncate">
                                        Screenshot #{idx + 1}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Key Learnings */}
                {learnings.length > 0 && (
                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="font-mono text-xs font-bold text-accent tracking-wider uppercase">
                            Key Engineering Learnings
                        </h3>
                        <ul className="space-y-2">
                            {learnings.map((learning, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs text-white/75 font-body">
                                    <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                                    <span>{learning}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-white/10 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="admin-secondary-action"
                    >
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}
