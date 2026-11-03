"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Trophy,
    Award,
    ExternalLink,
    Medal,
    Sparkles,
    Calendar,
    Building2,
    X,
    Eye,
} from "lucide-react";
import { useProfile } from "@/context/ProfileContext";

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

const LEVEL_STYLES = {
    International: "border-purple-400/40 text-purple-300 bg-purple-500/10",
    National: "border-accent/40 text-accent bg-accent/10",
    Regional: "border-blue-400/40 text-blue-300 bg-blue-500/10",
    University: "border-emerald-400/40 text-emerald-300 bg-emerald-500/10",
};

export default function Achievements() {
    const { achievements } = useProfile();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [previewDoc, setPreviewDoc] = useState(null);

    const publishedAchievements = useMemo(
        () => (achievements || []).filter((a) => a.isPublished !== false),
        [achievements]
    );

    const categories = useMemo(() => {
        const unique = Array.from(
            new Set(publishedAchievements.map((a) => a.category).filter(Boolean))
        );
        return ["all", ...unique];
    }, [publishedAchievements]);

    const filtered = useMemo(() => {
        if (selectedCategory === "all") return publishedAchievements;
        return publishedAchievements.filter((a) => a.category === selectedCategory);
    }, [publishedAchievements, selectedCategory]);

    // Do not render empty section if no achievements exist
    if (!publishedAchievements || publishedAchievements.length === 0) {
        return null;
    }

    return (
        <section
            id="achievements"
            className="relative bg-secondary py-24 text-white border-b border-white/10"
        >
            <div className="section-shell relative z-10">
                {/* Section Header */}
                <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2 block">
                            03 / Honors & Recognitions
                        </span>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Achievements & Awards
                        </motion.h2>
                    </div>
                    <p className="text-white/65 font-body text-sm sm:text-base leading-relaxed max-w-xl">
                        Competitive hackathons, technology innovation challenges, and academic excellence
                        validating practical machine learning and engineering problem-solving.
                    </p>
                </div>

                {/* Category Filters */}
                {categories.length > 2 && (
                    <div
                        role="tablist"
                        aria-label="Filter achievements by category"
                        className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-4"
                    >
                        {categories.map((cat) => {
                            const isActive = selectedCategory === cat;
                            const count =
                                cat === "all"
                                    ? publishedAchievements.length
                                    : publishedAchievements.filter((a) => a.category === cat).length;

                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    role="tab"
                                    aria-selected={isActive}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider border transition-colors duration-200 ${
                                        isActive
                                            ? "border-accent bg-accent text-primary font-semibold"
                                            : "border-white/10 bg-primary/70 text-white/65 hover:border-accent/40 hover:text-white"
                                    }`}
                                >
                                    <span>{cat === "all" ? "All Achievements" : cat}</span>
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
                )}

                {/* Grid of Achievements */}
                <div className="grid gap-6 md:grid-cols-2">
                    {filtered.map((item, index) => {
                        const levelClass =
                            LEVEL_STYLES[item.level] || "border-white/20 text-white/70 bg-white/5";

                        return (
                            <motion.article
                                key={item.id || index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={fadeUpVariants}
                                className={`relative flex flex-col justify-between border p-6 transition-all duration-300 ${
                                    item.isFeatured || item.featured
                                        ? "border-accent/40 bg-primary/90 shadow-[0_0_24px_rgba(104,212,204,0.06)]"
                                        : "border-white/10 bg-primary/50 hover:border-white/20"
                                }`}
                            >
                                <div>
                                    {/* Top Bar: Level Badge, Award, Year */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono font-medium border ${levelClass}`}
                                            >
                                                <Medal size={11} />
                                                <span>{item.level || "Award"}</span>
                                            </span>

                                            {item.award && (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-mono text-amber-300 border border-amber-400/30 bg-amber-400/10">
                                                    <Trophy size={11} />
                                                    <span>{item.award}</span>
                                                </span>
                                            )}

                                            {(item.isFeatured || item.featured) && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-accent uppercase tracking-wider">
                                                    <Sparkles size={10} />
                                                    <span>Featured</span>
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-xs font-mono text-white/40 flex items-center gap-1">
                                            <Calendar size={12} />
                                            <span>{item.year || "2024"}</span>
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-display text-lg font-bold text-white tracking-tight leading-snug">
                                        {item.title}
                                    </h3>

                                    {/* Event / Organizer */}
                                    {(item.eventName || item.event_name || item.organizer) && (
                                        <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs font-mono text-accent/90">
                                            <span>{item.eventName || item.event_name}</span>
                                            {item.organizer && (
                                                <>
                                                    <span className="text-white/30">·</span>
                                                    <span className="text-white/60 flex items-center gap-1">
                                                        <Building2 size={11} />
                                                        {item.organizer}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {/* Description */}
                                    <p className="mt-3 text-sm text-white/70 leading-relaxed font-body">
                                        {item.shortDescription || item.short_description}
                                    </p>
                                </div>

                                {/* Bottom Links & Verification Actions */}
                                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                                    <div className="flex items-center gap-3">
                                        {(item.certificateImageUrl || item.certificate_image_url) && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPreviewDoc({
                                                        title: item.title,
                                                        image:
                                                            item.certificateImageUrl ||
                                                            item.certificate_image_url,
                                                    })
                                                }
                                                className="inline-flex items-center gap-1.5 text-white/75 hover:text-accent transition-colors"
                                            >
                                                <Eye size={13} />
                                                <span>View Certificate</span>
                                            </button>
                                        )}

                                        {(item.credentialUrl || item.credential_url) && (
                                            <a
                                                href={item.credentialUrl || item.credential_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-accent hover:underline"
                                            >
                                                <span>Verify Credential</span>
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>

                                    {(item.projectUrl || item.project_url) && (
                                        <a
                                            href={item.projectUrl || item.project_url}
                                            className="text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
                                        >
                                            <span>Related Case Study</span>
                                            <span>→</span>
                                        </a>
                                    )}
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>

            {/* Certificate Document Modal */}
            {previewDoc && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setPreviewDoc(null)}
                >
                    <div
                        className="relative max-w-3xl w-full bg-secondary border border-white/20 p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                            <span className="font-mono text-xs text-accent uppercase">
                                Certificate Documentation
                            </span>
                            <button
                                type="button"
                                onClick={() => setPreviewDoc(null)}
                                className="text-white/60 hover:text-white"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <h4 className="font-display font-bold text-white text-base mb-3">
                            {previewDoc.title}
                        </h4>
                        <div className="aspect-[4/3] w-full overflow-hidden bg-primary border border-white/10 flex items-center justify-center">
                            {previewDoc.image?.endsWith(".pdf") ? (
                                <iframe
                                    src={previewDoc.image}
                                    title={previewDoc.title}
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <img
                                    src={previewDoc.image}
                                    alt={previewDoc.title}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
