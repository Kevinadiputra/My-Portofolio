"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    Calendar,
    MapPin,
    ExternalLink,
    ChevronRight,
    X,
    ChevronLeft,
    CheckCircle2,
    GraduationCap,
    Building2,
    ArrowUpRight,
    Layers,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

const fadeUpVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function Experience() {
    const { experiences, education } = useProfile();
    const [selectedExp, setSelectedExp] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    // Filter published experiences
    const publishedExperiences = useMemo(
        () => (experiences || []).filter((e) => e.isPublished !== false),
        [experiences]
    );

    // Check URL query on mount for direct experience deep-link (?exp=slug)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const expSlug = params.get("exp");
        if (expSlug && publishedExperiences.length > 0) {
            const found = publishedExperiences.find(
                (e) => e.slug === expSlug || String(e.id) === expSlug
            );
            if (found) {
                setSelectedExp(found);
            }
        }
    }, [publishedExperiences]);

    function openExperienceDetail(exp) {
        setSelectedExp(exp);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("exp", exp.slug || exp.id);
            window.history.pushState({}, "", url.toString());
        }
    }

    function closeExperienceDetail() {
        setSelectedExp(null);
        setLightboxIndex(null);
        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("exp");
            window.history.pushState({}, "", url.toString());
        }
    }

    return (
        <section
            id="experience"
            className="relative bg-secondary py-24 text-white border-b border-white/10 overflow-hidden"
        >
            <div className="section-shell relative z-10">
                {/* 1. Heading and Section Identity */}
                <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-white/10 pb-8">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2.5 block font-semibold">
                            05 / CAREER & LEADERSHIP
                        </span>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Experience
                        </motion.h2>
                    </div>
                    <p className="text-white/65 font-body text-sm sm:text-base leading-relaxed max-w-xl">
                        A collection of my professional experiences, internships, organizational roles, and contributions in technology communities.
                    </p>
                </div>

                {/* 2. Timeline Component */}
                <div className="relative mt-10">
                    {/* Central Vertical Spine: centered on desktop, left-aligned on mobile */}
                    <div
                        aria-hidden="true"
                        className="absolute top-4 bottom-4 left-5 sm:left-6 lg:left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-accent/70 via-accent/30 to-white/10 pointer-events-none"
                    />

                    <div className="space-y-12 lg:space-y-16">
                        {publishedExperiences.map((exp, index) => {
                            const isEven = index % 2 === 0;
                            const roles = exp.roles && exp.roles.length > 0 ? exp.roles : [];
                            const roleCount = roles.length;
                            const isCurrent = Boolean(exp.isCurrent || exp.is_current);

                            return (
                                <motion.div
                                    key={exp.id || index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-60px" }}
                                    variants={fadeUpVariants}
                                    className={`relative flex flex-col lg:flex-row items-start ${
                                        isEven ? "lg:flex-row-reverse" : ""
                                    }`}
                                >
                                    {/* Timeline Node on the Spine */}
                                    <div className="absolute left-5 sm:left-6 lg:left-1/2 -translate-x-1/2 top-6 flex items-center justify-center z-20">
                                        <div
                                            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center border transition-all duration-300 ${
                                                isCurrent
                                                    ? "border-accent bg-primary text-accent shadow-[0_0_14px_rgba(104,212,204,0.35)]"
                                                    : "border-white/20 bg-primary text-white/70 hover:border-accent hover:text-accent"
                                            }`}
                                        >
                                            {exp.logoUrl || exp.logo_url ? (
                                                <img
                                                    src={exp.logoUrl || exp.logo_url}
                                                    alt=""
                                                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                                                />
                                            ) : (
                                                <Briefcase size={16} className={isCurrent ? "text-accent" : "text-white/70"} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Container (Single line on mobile, alternating on desktop) */}
                                    <div
                                        className={`w-full lg:w-[calc(50%-2.5rem)] pl-14 sm:pl-16 lg:pl-0`}
                                    >
                                        <article
                                            onClick={() => openExperienceDetail(exp)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    e.preventDefault();
                                                    openExperienceDetail(exp);
                                                }
                                            }}
                                            tabIndex={0}
                                            role="button"
                                            aria-label={`View experience details at ${exp.organization || exp.company}`}
                                            className="group relative border border-white/10 bg-primary/75 p-6 sm:p-7 hover:border-accent/45 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-2xl hover:translate-y-[-2px] text-left"
                                        >
                                            {/* Connector indicator for desktop & mobile */}
                                            <span
                                                aria-hidden="true"
                                                className={`hidden lg:block absolute top-10 w-10 h-px bg-white/15 group-hover:bg-accent/40 transition-colors pointer-events-none ${
                                                    isEven ? "-left-10" : "-right-10"
                                                }`}
                                            />
                                            <span
                                                aria-hidden="true"
                                                className="block lg:hidden absolute top-10 -left-6 sm:-left-7 w-6 sm:w-7 h-px bg-white/15 group-hover:bg-accent/40 transition-colors pointer-events-none"
                                            />

                                            {/* Top Row: Organization Logo + Header Information */}
                                            <div className="flex items-start gap-3.5 mb-4">
                                                {/* 3. Organization Logo */}
                                                <div className="w-11 h-11 shrink-0 border border-white/15 bg-secondary/90 flex items-center justify-center p-1.5 overflow-hidden">
                                                    {exp.logoUrl || exp.logo_url ? (
                                                        <img
                                                            src={exp.logoUrl || exp.logo_url}
                                                            alt={exp.organization || exp.company}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <Building2 size={20} className="text-accent" />
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                                                        <span className="font-mono text-xs text-accent font-semibold truncate block">
                                                            {exp.organization || exp.company}
                                                        </span>
                                                        {isCurrent ? (
                                                            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-accent bg-accent/10 border border-accent/30 px-2 py-0.5 font-medium shrink-0">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                                                Currently Active
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-mono text-white/45 shrink-0">
                                                                Completed
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-accent transition-colors leading-snug mt-0.5">
                                                        {exp.position || exp.role}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Period, Location & Type Badges */}
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-white/55 pb-3 border-b border-white/10">
                                                <span className="px-2 py-0.5 border border-white/10 bg-secondary text-[10px] text-white/75 uppercase tracking-wider">
                                                    {exp.organizationType || exp.employmentType || "Organization"}
                                                </span>
                                                <div className="flex items-center gap-1 text-[11px]">
                                                    <Calendar size={12} className="text-accent shrink-0" />
                                                    <span>{exp.period}</span>
                                                </div>
                                                {exp.location && (
                                                    <div className="flex items-center gap-1 text-[11px]">
                                                        <MapPin size={12} className="text-accent shrink-0" />
                                                        <span>{exp.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Multiple Roles Hierarchy (e.g. GDGoC multiple positions) */}
                                            {roleCount > 1 && (
                                                <div className="mt-3.5 p-3 bg-secondary/80 border border-white/5 space-y-2">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">
                                                        <Layers size={13} />
                                                        <span>{roleCount} Roles & Positions Held:</span>
                                                    </div>
                                                    <ul className="space-y-1.5 pl-0.5 list-none">
                                                        {roles.map((r, rIdx) => (
                                                            <li
                                                                key={r.id || rIdx}
                                                                className="text-xs font-mono flex items-center justify-between gap-2"
                                                            >
                                                                <span className="flex items-center gap-2 truncate">
                                                                    <span className="w-1.5 h-1.5 bg-accent/80 shrink-0" />
                                                                    <span className="text-white/90 font-medium truncate">
                                                                        {r.position}
                                                                    </span>
                                                                </span>
                                                                <span className="text-[10px] text-white/45 shrink-0">
                                                                    {r.period ||
                                                                        (r.start_date
                                                                            ? `${r.start_date.slice(0, 7)} — ${
                                                                                  r.is_current ? "Present" : r.end_date?.slice(0, 7)
                                                                              }`
                                                                            : "")}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Short Description (Clamped 2-3 lines) */}
                                            <p className="text-xs sm:text-sm text-white/65 font-body line-clamp-2 sm:line-clamp-3 mt-3 leading-relaxed">
                                                {exp.description || exp.overview || "Click to explore responsibilities and documentation."}
                                            </p>

                                            {/* Relevant Skills / Contribution Tags */}
                                            {exp.technologies && exp.technologies.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-white/5">
                                                    {exp.technologies.slice(0, 4).map((tech, tIdx) => (
                                                        <span
                                                            key={tIdx}
                                                            className="text-[10px] font-mono px-2 py-0.5 border border-white/10 bg-secondary/60 text-white/75"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {exp.technologies.length > 4 && (
                                                        <span className="text-[10px] font-mono px-1.5 py-0.5 text-white/40">
                                                            +{exp.technologies.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Link */}
                                            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/70 group-hover:text-accent transition-colors">
                                                <span className="font-semibold tracking-wide">
                                                    Explore Roles & Documentation
                                                </span>
                                                <ChevronRight
                                                    size={14}
                                                    className="group-hover:translate-x-1 transition-transform text-accent"
                                                />
                                            </div>
                                        </article>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Academic Education Section */}
                {education && education.length > 0 && (
                    <div className="mt-20 pt-14 border-t border-white/10">
                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="p-2 border border-accent/40 bg-accent/10 text-accent">
                                <GraduationCap size={20} />
                            </div>
                            <div>
                                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                                    Formal Academic Education
                                </h3>
                                <p className="text-xs text-white/50 font-mono mt-0.5">
                                    Degree programs, specialized coursework & university research
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {education.map((edu, idx) => (
                                <motion.article
                                    key={edu.id || idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUpVariants}
                                    className="border border-white/10 bg-primary/60 p-6 sm:p-7 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-accent mb-2">
                                        <span className="font-semibold">{edu.institution}</span>
                                        <span className="text-white/50">{edu.period}</span>
                                    </div>
                                    <h4 className="font-display text-lg font-bold text-white mb-1">
                                        {edu.degree}
                                    </h4>
                                    {edu.fieldOfStudy && (
                                        <p className="font-mono text-xs text-white/70 mb-3">
                                            Major / Focus: {edu.fieldOfStudy}
                                        </p>
                                    )}
                                    {edu.location && (
                                        <p className="flex items-center gap-1.5 text-xs font-mono text-white/45 mb-3">
                                            <MapPin size={12} className="text-accent" />
                                            <span>{edu.location}</span>
                                        </p>
                                    )}
                                    {edu.description && (
                                        <p className="text-sm text-white/65 font-body leading-relaxed pt-2 border-t border-white/5">
                                            {edu.description}
                                        </p>
                                    )}
                                </motion.article>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 4. Experience Detail View (Slide-over Drawer with Back to Experience) */}
            <AnimatePresence>
                {selectedExp && (
                    <ExperienceDetailModal
                        exp={selectedExp}
                        onClose={closeExperienceDetail}
                        onOpenLightbox={(idx) => setLightboxIndex(idx)}
                    />
                )}
            </AnimatePresence>

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {selectedExp && lightboxIndex !== null && selectedExp.gallery?.[lightboxIndex] && (
                    <LightboxModal
                        gallery={selectedExp.gallery}
                        currentIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

// 4. EXPERIENCE DETAIL MODAL
function ExperienceDetailModal({ exp, onClose, onOpenLightbox }) {
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const roles = exp.roles && exp.roles.length > 0 ? exp.roles : [];
    const gallery = exp.gallery || [];
    const links = exp.links || [];
    const isCurrent = Boolean(exp.isCurrent || exp.is_current);

    return (
        <div
            className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="experience-modal-title"
        >
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-[#0c1017] border-l border-white/10 h-full flex flex-col shadow-2xl overflow-hidden"
            >
                {/* Drawer Sticky Header with Explicit "← Back to Experience" Button */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0e141d] shrink-0 sticky top-0 z-30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 text-xs font-mono text-white/85 hover:text-accent border border-white/15 hover:border-accent px-3 py-1.5 bg-primary/80 transition-colors"
                        aria-label="Back to Experience"
                    >
                        <ChevronLeft size={14} className="text-accent" />
                        <span>Back to Experience</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/45 hidden sm:inline truncate max-w-[200px]">
                            {exp.organization || exp.company}
                        </span>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 border border-white/10 text-white/60 hover:text-white hover:border-accent transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Drawer Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                    {/* Organization Overview Hero Card */}
                    <div className="border border-white/10 bg-primary/60 p-6 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-14 h-14 border border-white/15 bg-secondary flex items-center justify-center shrink-0 p-1">
                                    {exp.logoUrl || exp.logo_url ? (
                                        <img
                                            src={exp.logoUrl || exp.logo_url}
                                            alt={exp.organization}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 size={24} className="text-accent" />
                                    )}
                                </div>
                                <div>
                                    <h2
                                        id="experience-modal-title"
                                        className="font-display text-xl sm:text-2xl font-bold text-white leading-tight"
                                    >
                                        {exp.organization || exp.company}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="font-mono text-xs text-accent font-medium">
                                            {exp.position || exp.role}
                                        </span>
                                        <span className="text-white/30">•</span>
                                        <span className="font-mono text-xs text-white/60">
                                            {exp.organizationType || exp.employmentType}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs font-mono">
                            <div>
                                <span className="text-white/40 block text-[10px] uppercase">Period</span>
                                <span className="text-white font-medium">{exp.period}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block text-[10px] uppercase">Location</span>
                                <span className="text-white font-medium">{exp.location || "Indonesia"}</span>
                            </div>
                            <div>
                                <span className="text-white/40 block text-[10px] uppercase">Status</span>
                                <span className={isCurrent ? "text-accent font-semibold" : "text-white/70"}>
                                    {isCurrent ? "Currently Active" : "Completed"}
                                </span>
                            </div>
                        </div>

                        {/* External Organization Links */}
                        {(exp.websiteUrl || exp.linkedinUrl) && (
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                                {exp.websiteUrl && (
                                    <a
                                        href={exp.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-accent text-xs font-mono text-white/80 hover:text-accent transition-colors bg-secondary/40"
                                    >
                                        <span>Official Website</span>
                                        <ArrowUpRight size={12} />
                                    </a>
                                )}
                                {exp.linkedinUrl && (
                                    <a
                                        href={exp.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 hover:border-accent text-xs font-mono text-white/80 hover:text-accent transition-colors bg-secondary/40"
                                    >
                                        <span>LinkedIn Profile</span>
                                        <ArrowUpRight size={12} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Section: Overview & Context */}
                    {(exp.overview || exp.description) && (
                        <div className="space-y-2">
                            <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                Organization Overview & Context
                            </h3>
                            <p className="text-sm text-white/75 font-body leading-relaxed bg-primary/40 border border-white/5 p-4">
                                {exp.overview || exp.description}
                            </p>
                        </div>
                    )}

                    {/* Section: Roles & Responsibilities */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                {roles.length > 1
                                    ? `Roles & Positions (${roles.length})`
                                    : "Role & Key Responsibilities"}
                            </h3>
                            {roles.length > 1 && (
                                <span className="text-[11px] font-mono text-white/40">Chronological Order</span>
                            )}
                        </div>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-white/15">
                            {roles.map((role, idx) => (
                                <div key={role.id || idx} className="relative space-y-2">
                                    {/* Role Node */}
                                    <div
                                        className={`absolute -left-6 top-1 w-3.5 h-3.5 border ${
                                            role.isCurrent || role.is_current
                                                ? "border-accent bg-accent"
                                                : "border-accent/60 bg-primary"
                                        }`}
                                    />

                                    <div className="border border-white/10 bg-primary/50 p-4 space-y-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <h4 className="font-display text-base font-bold text-white">
                                                {role.position}
                                            </h4>
                                            <span className="font-mono text-xs text-white/50 bg-secondary px-2 py-0.5 border border-white/5">
                                                {role.period ||
                                                    (role.start_date
                                                        ? `${role.start_date} — ${role.is_current ? "Present" : role.end_date}`
                                                        : "")}
                                            </span>
                                        </div>

                                        {role.description && (
                                            <p className="text-xs text-white/70 font-body leading-relaxed">
                                                {role.description}
                                            </p>
                                        )}

                                        {/* Responsibilities */}
                                        {role.responsibilities && role.responsibilities.length > 0 && (
                                            <div className="space-y-1.5 pt-2 border-t border-white/5">
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-white/45 block">
                                                    Key Responsibilities & Deliverables
                                                </span>
                                                <ul className="space-y-1.5 pl-0 list-none">
                                                    {role.responsibilities.map((resp, rIdx) => (
                                                        <li
                                                            key={rIdx}
                                                            className="text-xs text-white/80 font-body flex items-start gap-2.5 leading-relaxed"
                                                        >
                                                            <span className="w-1.5 h-1.5 bg-accent shrink-0 mt-1.5" />
                                                            <span>{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Achievements in Role */}
                                        {role.achievements && role.achievements.length > 0 && (
                                            <div className="space-y-1.5 pt-2 border-t border-white/5">
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-accent block">
                                                    Key Outcomes & Impact
                                                </span>
                                                <ul className="space-y-1.5 pl-0 list-none">
                                                    {role.achievements.map((ach, aIdx) => (
                                                        <li
                                                            key={aIdx}
                                                            className="text-xs text-accent/90 font-body flex items-start gap-2.5 leading-relaxed"
                                                        >
                                                            <CheckCircle2 size={13} className="shrink-0 mt-0.5 text-accent" />
                                                            <span>{ach}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Technologies for Role */}
                                        {role.technologies && role.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                                                {role.technologies.map((t, tIdx) => (
                                                    <span
                                                        key={tIdx}
                                                        className="text-[10px] font-mono px-2 py-0.5 border border-white/10 bg-secondary text-white/70"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Media & Documentation Gallery */}
                    {gallery && gallery.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                    Media & Activity Documentation ({gallery.length})
                                </h3>
                                <span className="text-[11px] font-mono text-white/40">Click photo to enlarge</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {gallery.map((item, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => onOpenLightbox(idx)}
                                        className="group relative aspect-video bg-primary border border-white/10 overflow-hidden cursor-pointer hover:border-accent transition-colors"
                                    >
                                        <img
                                            src={item.url}
                                            alt={item.caption || "Activity photo"}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                                            <p className="text-[10px] font-mono text-white/90 line-clamp-2">
                                                {item.caption || "Click to view in lightbox"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Section: External Links */}
                    {links && links.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                External Links & References
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {links.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 border border-white/10 bg-primary/70 hover:border-accent text-xs font-mono text-white/80 hover:text-accent transition-colors"
                                    >
                                        <ExternalLink size={13} />
                                        <span>{link.title || link.url}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Drawer Footer with Back to Experience Button */}
                <div className="p-4 border-t border-white/10 bg-[#0e141d] flex items-center justify-between shrink-0">
                    <span className="text-xs font-mono text-white/45">
                        {isCurrent ? "Active Role" : "Archived Experience"}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="admin-secondary-action text-xs inline-flex items-center gap-1.5"
                    >
                        <ChevronLeft size={13} />
                        <span>Back to Experience</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// 5. FULLSCREEN LIGHTBOX MODAL
function LightboxModal({ gallery = [], currentIndex = 0, onClose, onNavigate }) {
    const item = gallery[currentIndex] || {};

    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
            if (e.key === "ArrowRight" && currentIndex < gallery.length - 1) onNavigate(currentIndex + 1);
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, gallery.length, onClose, onNavigate]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative max-w-5xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Top Bar */}
                <div className="w-full flex items-center justify-between text-xs font-mono text-white/60 mb-3">
                    <span>
                        Photo {currentIndex + 1} of {gallery.length}
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 border border-white/20 text-white/80 hover:text-white hover:border-accent transition-colors"
                        aria-label="Close Lightbox"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Image Container */}
                <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden border border-white/10 bg-black">
                    <img
                        src={item.url}
                        alt={item.caption || "Enlarged view"}
                        className="max-h-[75vh] max-w-full object-contain"
                    />

                    {/* Navigation Buttons */}
                    {currentIndex > 0 && (
                        <button
                            type="button"
                            onClick={() => onNavigate(currentIndex - 1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 border border-white/20 text-white hover:border-accent hover:text-accent transition-colors"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {currentIndex < gallery.length - 1 && (
                        <button
                            type="button"
                            onClick={() => onNavigate(currentIndex + 1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-black/70 border border-white/20 text-white hover:border-accent hover:text-accent transition-colors"
                            aria-label="Next photo"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>

                {/* Caption Bar */}
                {item.caption && (
                    <div className="w-full mt-3 p-3 border border-white/10 bg-[#0e141d] text-center font-mono text-xs text-white/80">
                        {item.caption}
                    </div>
                )}
            </div>
        </div>
    );
}
