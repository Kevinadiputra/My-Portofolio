"use client";

import { useMemo } from "react";
import { Award, Calendar, BarChart3, Tag } from "lucide-react";
import { useCertificates } from "@/context/CertificatesContext";
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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const cardVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const Certificates = () => {
    const { certificates, loading } = useCertificates();

    // Live Statistics Calculations
    const stats = useMemo(() => {
        const total = certificates.length;
        
        // Skill occurrence counts
        const skillCounts = {};
        certificates.forEach(c => {
            c.skills.forEach(s => {
                skillCounts[s] = (skillCounts[s] || 0) + 1;
            });
        });
        const top = Object.entries(skillCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
            
        // Timeline counting (explicitly chronological: 2024 -> 2026)
        const timeline = { "2024": 0, "2025": 0, "2026": 0 };
        certificates.forEach(c => {
            if (c.date in timeline) {
                timeline[c.date] += 1;
            } else {
                timeline[c.date] = 1;
            }
        });
        const timelineYears = ["2024", "2025", "2026"];
        
        // Category counting
        const categories = {};
        certificates.forEach(c => {
            const cat = c.category || "Other";
            categories[cat] = (categories[cat] || 0) + 1;
        });
        const topCategories = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
            
        return { total, top, timeline, timelineYears, topCategories };
    }, [certificates]);

    // Chronological sort by default (Newest first, secondary by ID desc)
    const sortedCertificates = useMemo(() => {
        return [...certificates].sort((a, b) => {
            const dateA = parseInt(a.date) || 0;
            const dateB = parseInt(b.date) || 0;
            if (dateB !== dateA) return dateB - dateA;
            return b.id - a.id;
        });
    }, [certificates]);

    const handleKeyDown = (e, url) => {
        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            window.open(url, "_blank", "noopener,noreferrer");
        }
    };

    if (loading) {
        return (
            <section id="certificates" className="relative bg-[#0b0b12] py-24 text-white">
                <div className="section-shell grid gap-6 md:grid-cols-3">
                    {[0, 1, 2].map((item) => <div key={item} className="skeleton h-80" />)}
                </div>
            </section>
        );
    }

    return (
        <section id="certificates" className="relative overflow-hidden bg-[#0b0b12] py-24 text-white">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="section-shell relative z-10">
                
                {/* Section Header */}
                <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-4 block">
                            Verification
                        </span>
                        <motion.h3
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-none"
                        >
                            CREDENTIALS & DEGREES
                        </motion.h3>
                    </div>
                    <p className="text-white/60 font-body text-base sm:text-lg leading-relaxed max-w-xl lg:ml-auto">
                        Academic proof and professional certifications supporting the engineering systems. 
                        Verified credentials validate our expertise in core disciplines.
                    </p>
                </div>

                {/* Elegant Statistics Section */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-16">
                    {/* Stat Card 1: Total */}
                    <div className="surface-card p-6 bg-[#12151d]/40 backdrop-blur-md relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(104,212,204,0.06)] hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Credentials</span>
                            <Award className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <div>
                            <span className="block text-5xl font-display font-extrabold text-white leading-none tracking-tighter mb-2">
                                {stats.total}
                            </span>
                            <span className="block text-[10px] font-mono text-accent uppercase tracking-widest font-semibold">
                                Total Certifications
                            </span>
                        </div>
                    </div>

                    {/* Stat Card 2: Top Skills */}
                    <div className="surface-card p-6 bg-[#12151d]/40 backdrop-blur-md relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(104,212,204,0.06)] hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Top Focus Areas</span>
                            <Tag className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <div className="space-y-1.5">
                            {stats.top.map(([skillName, count]) => (
                                <div key={skillName} className="flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-white/60 truncate max-w-[140px]">{skillName}</span>
                                    <span className="text-accent font-semibold bg-accent/5 px-1.5 py-0.5 border border-accent/10">x{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stat Card 3: Journey Timeline */}
                    <div className="surface-card p-6 bg-[#12151d]/40 backdrop-blur-md relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(104,212,204,0.06)] hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Learning Timeline</span>
                            <Calendar className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <div className="flex items-center gap-3">
                            {stats.timelineYears.map((yearVal, i) => (
                                <div key={yearVal} className="flex items-center gap-3 flex-1 flex-row">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-sm font-bold text-accent leading-none mb-1">{yearVal}</span>
                                        <span className="text-[9px] font-mono text-white/40 leading-none">{stats.timeline[yearVal]} certs</span>
                                    </div>
                                    {i < stats.timelineYears.length - 1 && (
                                        <div className="w-[1px] h-6 bg-white/10 ml-auto" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stat Card 4: Expertise Domains */}
                    <div className="surface-card p-6 bg-[#12151d]/40 backdrop-blur-md relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none transition-all duration-300 hover:border-accent/30 hover:shadow-[0_0_20px_rgba(104,212,204,0.06)] hover:-translate-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">Expertise Domains</span>
                            <BarChart3 className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors duration-300" />
                        </div>
                        <div className="space-y-1.5">
                            {stats.topCategories.map(([categoryName, count]) => (
                                <div key={categoryName} className="flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-white/60 truncate max-w-[140px]">{categoryName}</span>
                                    <span className="text-accent font-semibold bg-accent/5 px-1.5 py-0.5 border border-accent/10">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recruiter-Friendly Certifications Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {sortedCertificates.map((certificate) => {
                        const isFeatured = certificate.featured;
                        
                        return (
                            <motion.a 
                                href={certificate.verifyUrl || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                key={certificate.id} 
                                variants={cardVariants}
                                whileHover={{ 
                                    y: -8, 
                                    boxShadow: "0 0 20px rgba(104, 212, 204, 0.15)",
                                }}
                                whileTap={{ 
                                    y: -3, 
                                    scale: 0.98 
                                }}
                                onKeyDown={(e) => handleKeyDown(e, certificate.verifyUrl)}
                                transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
                                className={`group flex flex-col p-8 bg-[#12151d]/40 backdrop-blur-md relative border ${
                                    isFeatured ? "border-accent/30 shadow-[0_0_20px_rgba(104,212,204,0.04)]" : "border-white/10"
                                } hover:border-accent/40 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent cursor-pointer rounded-none transition-colors duration-300`}
                                aria-label={`Open certification for ${certificate.title} by ${certificate.issuer}`}
                            >
                                {/* Holographic Scan Effect */}
                                <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/80 shadow-[0_0_8px_rgba(104,212,204,0.8)] animate-scan-line" />
                                </div>
                                
                                {/* External Link Indicator - Pojok Kanan Atas */}
                                <div className="absolute top-6 right-6 text-white/30 group-hover:text-accent transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 font-mono text-lg leading-none z-20">
                                    ↗
                                </div>

                                {/* Card Header */}
                                <div className="mb-6 flex items-start justify-between z-20 pr-6">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-none border border-white/10 group-hover:border-accent/30 text-white/50 group-hover:text-accent transition-colors duration-500 bg-white/[0.02]">
                                        <Award size={20} />
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <span className="block text-[8px] font-mono text-white/30 tracking-widest uppercase">ID</span>
                                        <span className="block text-[9px] font-mono text-accent/80 font-medium tracking-wider leading-none truncate max-w-[120px]">{certificate.credentialId}</span>
                                    </div>
                                </div>
                                
                                {/* Card Body */}
                                <div className="mb-6 flex-grow z-20 flex flex-col">
                                    {/* Featured Badge */}
                                    {isFeatured && (
                                        <div className="mb-3 flex">
                                            <span className="px-2 py-0.5 text-[8px] font-mono font-bold tracking-wider text-accent border border-accent/30 bg-accent/10 uppercase select-none rounded-none shadow-[0_0_12px_rgba(104,212,204,0.15)] flex items-center">
                                                🏆 Featured Certification
                                            </span>
                                        </div>
                                    )}

                                    <h4 className="mb-1 font-display text-lg font-bold text-white group-hover:text-accent transition-colors duration-300 uppercase tracking-tight leading-tight">
                                        {certificate.title}
                                    </h4>
                                    <span className="text-xs font-mono text-white/50 mb-3 block">
                                        {certificate.issuer}
                                    </span>
                                    
                                    {/* Detailed Dates */}
                                    <div className="mb-4 font-mono text-[9px] text-white/40 flex flex-wrap gap-x-2 items-center leading-none">
                                        <span>Issued: <span className="text-white/60">{certificate.issued}</span></span>
                                        {certificate.expires && (
                                            <>
                                                <span>•</span>
                                                <span>Expires: <span className="text-white/60">{certificate.expires}</span></span>
                                            </>
                                        )}
                                    </div>

                                    <p className="text-xs leading-relaxed text-white/50 mb-6 line-clamp-3 font-body">
                                        {certificate.description}
                                    </p>
                                    
                                    {/* Skill Tags */}
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {certificate.skills.map((skillItem) => (
                                            <span key={skillItem} className="text-[9px] font-mono bg-white/[0.02] border border-white/5 px-2 py-0.5 text-white/40 group-hover:text-white/70 group-hover:border-white/10 transition-colors">
                                                {skillItem}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Card Level Badge Footer */}
                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 z-20">
                                    <span>Verified Certification</span>
                                    <span className="uppercase tracking-wider text-white/50">{certificate.level}</span>
                                </div>
                            </motion.a>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default Certificates;
