"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Eye } from "lucide-react";
import { useProjects } from "@/context/ProjectsContext";
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from "framer-motion";

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

const Projects = () => {
    const [filter, setFilter] = useState("all");
    const [hoveredSlug, setHoveredSlug] = useState(null);
    const [isMobile, setIsMobile] = useState(true);
    const { projects, loading } = useProjects();
    const router = useRouter();

    const containerRef = useRef(null);

    // Mouse tracking for floating preview
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    // Horizontal speed-based tilt
    const xVelocity = useVelocity(mouseX);
    const rotate = useTransform(xVelocity, [-2000, 2000], [-10, 10]);
    const rotateSpring = useSpring(rotate, { damping: 30, stiffness: 180 });

    // Floating preview appearance
    const scale = useSpring(0.85, { damping: 20, stiffness: 200 });
    const opacity = useSpring(0, { damping: 20, stiffness: 200 });

    useEffect(() => {
        const checkDevice = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    useEffect(() => {
        if (hoveredSlug !== null) {
            scale.set(1.0);
            opacity.set(1);
        } else {
            scale.set(0.85);
            opacity.set(0);
        }
    }, [hoveredSlug, scale, opacity]);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
    };

    const filters = [
        { key: "all", label: "All work" },
        { key: "highlight", label: "Case studies" },
        { key: "deep-learning", label: "Deep learning" },
        { key: "nlp", label: "NLP" },
        { key: "data-science", label: "Data science" },
    ];

    const getProjectCount = (category) => {
        if (category === "all") return projects.length;
        if (category === "highlight") return projects.filter(p => p.highlight).length;
        return projects.filter(p => p.category === category).length;
    };

    const filteredProjects = projects.filter((project) => {
        if (filter === "all") return true;
        if (filter === "highlight") return project.highlight;
        return project.category === filter;
    });

    const formatCategory = (cat) => {
        const mapping = {
            "deep-learning": "DEEP LEARNING",
            "nlp": "NATURAL LANGUAGE PROCESSING",
            "data-science": "DATA SCIENCE",
            "data-engineering": "DATA ENGINEERING",
        };
        return mapping[cat] || cat.toUpperCase();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const rowVariants = {
        hidden: { y: 60, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    if (loading) {
        return (
            <section id="projects" className="relative bg-secondary py-24">
                <div className="section-shell grid gap-6 md:grid-cols-3">
                    {[0, 1, 2].map((item) => <div key={item} className="skeleton h-80" />)}
                </div>
            </section>
        );
    }

    return (
        <section id="projects" className="relative overflow-hidden bg-[#0b0b12] py-24 text-white">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="section-shell relative z-10">
                
                {/* Editorial Header */}
                <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-3 block">
                            Archive & Learning
                        </span>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-none"
                        >
                            SELECTED WORK & EVIDENCE
                        </motion.h2>
                    </div>
                    <p className="text-white/60 font-body text-base leading-relaxed max-w-xl lg:ml-auto">
                        An editorial library documenting machine learning models, predictive intelligence, 
                        and engineering certifications. Select a project to view details, architecture diagram, and key metrics.
                    </p>
                </div>

                {/* Filter Navigation */}
                <div className="mb-12 flex flex-wrap gap-x-8 gap-y-4 border-b border-white/10 pb-5 text-sm font-mono">
                    {filters.map((filterOption) => {
                        const isActive = filter === filterOption.key;
                        const count = getProjectCount(filterOption.key);
                        return (
                            <button
                                key={filterOption.key}
                                onClick={() => setFilter(filterOption.key)}
                                className={`relative py-2 text-[10px] sm:text-xs uppercase tracking-widest transition-colors duration-300 focus:outline-none ${
                                    isActive ? "text-accent font-semibold" : "text-white/50 hover:text-white"
                                }`}
                            >
                                <span>{filterOption.label}</span>
                                <span className="ml-1 text-[9px] text-white/30 font-normal">({count})</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeFilterUnderline"
                                        className="absolute bottom-0 left-0 h-0.5 w-full bg-accent"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Project Archive List */}
                {filteredProjects.length === 0 ? (
                    <div className="border border-white/10 rounded-none p-16 text-center bg-white/[0.02]">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-none border border-accent/30 text-accent">
                            <Eye size={24} />
                        </div>
                        <h3 className="mb-2 font-display text-xl font-bold uppercase tracking-wider text-white">No projects found</h3>
                        <p className="text-white/50 font-mono text-xs uppercase tracking-wider">Try selecting another filter category.</p>
                    </div>
                ) : (
                    <motion.div 
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredSlug(null)}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative border-t border-white/10"
                    >
                        {/* Cursor Following Floating Preview */}
                        {!isMobile && (
                            <motion.div
                                className="pointer-events-none absolute z-50 overflow-hidden bg-primary border border-white/20 shadow-2xl rounded-none"
                                style={{
                                    x: cursorX,
                                    y: cursorY,
                                    rotate: rotateSpring,
                                    scale,
                                    opacity,
                                    width: 380,
                                    height: 250,
                                    translateX: "-50%",
                                    translateY: "-50%",
                                }}
                            >
                                {projects.map((project) => (
                                    <motion.img
                                        key={project.id}
                                        src={project.image}
                                        alt={project.title}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: hoveredSlug === project.slug ? 1 : 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                    />
                                ))}
                            </motion.div>
                        )}

                        {/* Project Rows */}
                        {filteredProjects.map((project, index) => {
                            const isHovered = hoveredSlug === project.slug;
                            const isAnyHovered = hoveredSlug !== null;
                            const displayIndex = String(index + 1).padStart(2, "0");

                            return (
                                <motion.div
                                    key={project.id}
                                    variants={rowVariants}
                                    className="group relative border-b border-white/10"
                                    onMouseEnter={() => setHoveredSlug(project.slug)}
                                    onMouseLeave={() => setHoveredSlug(null)}
                                    animate={{
                                        opacity: isAnyHovered ? (isHovered ? 1 : 0.25) : 1,
                                    }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <Link
                                        href={`/projects/${project.slug}`}
                                        scroll={true}
                                        className="grid w-full py-6 md:py-8 grid-cols-1 md:grid-cols-[50px_1fr_auto_40px] items-center gap-4 md:gap-8 focus:outline-none text-left"
                                        aria-label={`Open ${project.title} showcase`}
                                    >
                                        {/* 1. Project Number */}
                                        <span className="font-mono text-xs md:text-sm tracking-wider text-white/40 group-hover:text-accent transition-colors duration-300">
                                            {displayIndex}.
                                        </span>

                                        {/* 2. Project Title */}
                                        <div className="flex flex-col gap-2">
                                            <h3
                                                className="font-display text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold uppercase tracking-tight leading-none transition-all duration-300 ease-out"
                                                style={{
                                                    WebkitTextStroke: isHovered 
                                                        ? '1px transparent' 
                                                        : '1px rgba(255, 255, 255, 0.25)',
                                                    color: isHovered ? 'var(--color-accent)' : 'transparent',
                                                }}
                                            >
                                                {project.title}
                                            </h3>
                                            
                                            {/* Mobile Image (Inline) */}
                                            <div className="block md:hidden overflow-hidden rounded-none bg-tertiary border border-white/10 aspect-video w-full mt-2">
                                                <img 
                                                    src={project.image} 
                                                    alt={project.title} 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* 3. Metadata */}
                                        <div className="flex flex-col items-start md:items-end gap-1 font-mono md:text-right text-xs md:text-sm">
                                            <span className="text-[10px] tracking-[0.2em] font-semibold text-accent uppercase">
                                                {formatCategory(project.category)}
                                            </span>
                                            <span className="text-white/60 uppercase">
                                                {project.technologies.slice(0, 2).join(" / ")}
                                            </span>
                                            <span className="text-white/30">
                                                {project.date}
                                            </span>
                                        </div>

                                        {/* 4. Minimal Arrow Icon */}
                                        <div className="flex justify-end">
                                            <ArrowUpRight 
                                                className="w-5 h-5 text-white/40 group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 ease-out" 
                                            />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}            </div>
        </section>
    );
};

export default Projects;
