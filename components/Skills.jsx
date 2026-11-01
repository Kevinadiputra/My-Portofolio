"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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

const CATEGORY_ORDER = [
    "Programming",
    "Data Science",
    "Machine Learning",
    "MLOps",
    "Data Analytics",
    "Tools & Infrastructure",
];

const CATEGORY_DESCRIPTIONS = {
    Programming: "Core languages used for data manipulation, algorithmic modeling, and automation.",
    "Data Science": "Statistical profiling, exploratory analysis, feature engineering, and spatial datasets.",
    "Machine Learning": "Supervised learning, ensemble methods, deep learning (CNN), and NLP pipelines.",
    MLOps: "Workflow orchestration, experiment tracking, containerization, CI/CD, and runtime monitoring.",
    "Data Analytics": "Interactive web dashboards, geospatial mapping, and visual reporting.",
    "Tools & Infrastructure": "Testing frameworks, ETL engineering, version control, and cloud fundamentals.",
};

const Skills = () => {
    const { skills } = useProfile();
    const [activeCategory, setActiveCategory] = useState("all");

    const groupedSkills = useMemo(() => {
        const groups = {};
        (skills || []).forEach((skill) => {
            const cat = skill.category || "Tools & Infrastructure";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(skill);
        });

        const sortedCategories = Object.keys(groups).sort((a, b) => {
            const idxA = CATEGORY_ORDER.indexOf(a);
            const idxB = CATEGORY_ORDER.indexOf(b);
            if (idxA === -1 && idxB === -1) return a.localeCompare(b);
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
        });

        return sortedCategories.map((category) => ({
            category,
            description:
                CATEGORY_DESCRIPTIONS[category] ||
                "Applied technical tools and frameworks used in portfolio projects.",
            items: groups[category].sort(
                (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
            ),
        }));
    }, [skills]);

    const visibleGroups = useMemo(() => {
        if (activeCategory === "all") return groupedSkills;
        return groupedSkills.filter((group) => group.category === activeCategory);
    }, [groupedSkills, activeCategory]);

    return (
        <section id="skills" className="relative bg-secondary py-24 border-b border-white/10">
            <div className="section-shell">
                <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2">
                            03 / Technical Capabilities
                        </p>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Skills & Engineering Stack
                        </motion.h2>
                    </div>
                    <p className="text-sm sm:text-base text-white/65 max-w-xl">
                        Grouped by functional domain and backed by documented projects and certifications—without arbitrary percentage bars.
                    </p>
                </div>

                {/* Category Filter */}
                <div className="mb-10 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveCategory("all")}
                        className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-colors duration-200 ${
                            activeCategory === "all"
                                ? "border-accent bg-accent text-primary font-semibold"
                                : "border-white/10 bg-primary/60 text-white/65 hover:border-accent/40 hover:text-white"
                        }`}
                    >
                        All Categories ({skills?.length || 0})
                    </button>
                    {groupedSkills.map((group) => (
                        <button
                            type="button"
                            key={group.category}
                            onClick={() => setActiveCategory(group.category)}
                            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-colors duration-200 ${
                                activeCategory === group.category
                                    ? "border-accent bg-accent text-primary font-semibold"
                                    : "border-white/10 bg-primary/60 text-white/65 hover:border-accent/40 hover:text-white"
                            }`}
                        >
                            {group.category} ({group.items.length})
                        </button>
                    ))}
                </div>

                {/* Grouped Skill Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visibleGroups.map((group, idx) => (
                        <motion.article
                            key={group.category}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                            variants={fadeUpVariants}
                            className="border border-white/10 bg-primary/60 p-6 flex flex-col justify-between hover:border-accent/35 transition-colors duration-200"
                        >
                            <div>
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                                    <span className="font-mono text-xs text-accent font-semibold">
                                        {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-mono text-[11px] text-white/45">
                                        {group.items.length} technologies
                                    </span>
                                </div>

                                <h3 className="font-display text-lg font-bold text-white">
                                    {group.category}
                                </h3>
                                <p className="text-xs text-white/60 leading-relaxed mt-1.5 mb-5">
                                    {group.description}
                                </p>

                                <ul className="space-y-2">
                                    {group.items.map((skill) => (
                                        <li
                                            key={skill.id || skill.name}
                                            className="flex items-center justify-between gap-2 border border-white/8 bg-secondary/70 px-3 py-2"
                                        >
                                            <span className="text-xs sm:text-sm font-medium text-white/90">
                                                {skill.name}
                                            </span>
                                            {skill.proficiency && (
                                                <span className="font-mono text-[10px] text-accent/85 bg-accent/10 border border-accent/20 px-2 py-0.5 shrink-0">
                                                    {skill.proficiency}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
