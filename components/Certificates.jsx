"use client";

import { useState, useMemo } from "react";
import { Award, Calendar, Search, Filter, RefreshCw } from "lucide-react";
import { useCertificates } from "@/context/CertificatesContext";
import { motion, AnimatePresence } from "framer-motion";

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
            staggerChildren: 0.04,
        },
    },
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
};

const Certificates = () => {
    const { certificates, loading } = useCertificates();

    // Filter, Search, Sort States
    const [search, setSearch] = useState("");
    const [issuer, setIssuer] = useState("all");
    const [year, setYear] = useState("all");
    const [skill, setSkill] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Dynamic filter options based on raw dataset
    const filterOptions = useMemo(() => {
        const uniqueIssuers = ["all", ...Array.from(new Set(certificates.map(c => c.issuer))).sort()];
        const uniqueYears = ["all", ...Array.from(new Set(certificates.map(c => c.date))).sort((a, b) => b - a)];
        const uniqueSkills = ["all", ...Array.from(new Set(certificates.flatMap(c => c.skills))).sort()];
        return { issuers: uniqueIssuers, years: uniqueYears, skills: uniqueSkills };
    }, [certificates]);

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
            
        // Timeline counting
        const timeline = {};
        certificates.forEach(c => {
            timeline[c.date] = (timeline[c.date] || 0) + 1;
        });
        const timelineYears = Object.keys(timeline).sort((a, b) => b - a);
        
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

    // Apply filtering and sorting logic
    const sortedCertificates = useMemo(() => {
        let result = certificates.filter(c => {
            const matchesSearch = 
                c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.issuer.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase()) ||
                c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
                
            const matchesIssuer = issuer === "all" || c.issuer === issuer;
            const matchesYear = year === "all" || c.date === year;
            const matchesSkill = skill === "all" || c.skills.includes(skill);
            
            return matchesSearch && matchesIssuer && matchesYear && matchesSkill;
        });
        
        return result.sort((a, b) => {
            const dateA = parseInt(a.date) || 0;
            const dateB = parseInt(b.date) || 0;
            if (sortBy === "newest") {
                if (dateB !== dateA) return dateB - dateA;
                return b.id - a.id;
            } else {
                if (dateA !== dateB) return dateA - dateB;
                return a.id - b.id;
            }
        });
    }, [certificates, search, issuer, year, skill, sortBy]);

    const resetFilters = () => {
        setSearch("");
        setIssuer("all");
        setYear("all");
        setSkill("all");
        setSortBy("newest");
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
                <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
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

                {/* Certification Statistics Summary */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    {/* Stat: Total */}
                    <div className="surface-card p-6 border border-white/10 bg-white/[0.01] relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Credentials</span>
                            <Award className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                            <span className="block text-4xl font-display font-extrabold text-white leading-none tracking-tighter mb-1">
                                {stats.total}
                            </span>
                            <span className="block text-[10px] font-mono text-accent uppercase tracking-widest font-semibold">
                                Total Certifications
                            </span>
                        </div>
                    </div>

                    {/* Stat: Top Skills */}
                    <div className="surface-card p-6 border border-white/10 bg-white/[0.01] relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Top Skills</span>
                            <Award className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors" />
                        </div>
                        <div className="space-y-1">
                            {stats.top.map(([skillName, count]) => (
                                <div key={skillName} className="flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-white/60 truncate max-w-[140px]">{skillName}</span>
                                    <span className="text-accent font-semibold">x{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stat: Learning Journey Timeline */}
                    <div className="surface-card p-6 border border-white/10 bg-white/[0.01] relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Timeline Journey</span>
                            <Calendar className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors" />
                        </div>
                        <div className="flex items-center gap-3">
                            {stats.timelineYears.slice(0, 3).map((yearVal, i) => (
                                <div key={yearVal} className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-xs font-bold text-accent">{yearVal}</span>
                                        <span className="text-[9px] font-mono text-white/40">{stats.timeline[yearVal]} certs</span>
                                    </div>
                                    {i < Math.min(stats.timelineYears.length, 3) - 1 && (
                                        <div className="w-[1px] h-6 bg-white/10" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stat: Category Distribution */}
                    <div className="surface-card p-6 border border-white/10 bg-white/[0.01] relative overflow-hidden group min-h-[140px] flex flex-col justify-between rounded-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">Expertise Domains</span>
                            <Filter className="w-4 h-4 text-accent/60 group-hover:text-accent transition-colors" />
                        </div>
                        <div className="space-y-1">
                            {stats.topCategories.map(([categoryName, count]) => (
                                <div key={categoryName} className="flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-white/60 truncate max-w-[140px]">{categoryName}</span>
                                    <span className="text-accent font-semibold">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filter and Search Panel */}
                <div className="mb-10 flex flex-col gap-4 bg-white/[0.01] border border-white/10 p-6 rounded-none">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Search Input */}
                        <div className="relative w-full md:max-w-xs">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search className="w-4 h-4 text-white/40" />
                            </span>
                            <input 
                                type="text"
                                placeholder="Search certificates, skills..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-[#0b0b12] border border-white/10 rounded-none text-xs font-mono text-white placeholder-white/30 focus:border-accent focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Filter Selects */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                            {/* Issuer */}
                            <select
                                value={issuer}
                                onChange={(e) => setIssuer(e.target.value)}
                                className="px-3 py-2 bg-[#0b0b12] border border-white/10 rounded-none text-[10px] font-mono text-white/80 focus:border-accent focus:outline-none transition-colors uppercase tracking-wider cursor-pointer"
                            >
                                <option value="all">All Issuers</option>
                                {filterOptions.issuers.filter(i => i !== "all").map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>

                            {/* Year */}
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="px-3 py-2 bg-[#0b0b12] border border-white/10 rounded-none text-[10px] font-mono text-white/80 focus:border-accent focus:outline-none transition-colors uppercase tracking-wider cursor-pointer"
                            >
                                <option value="all">All Years</option>
                                {filterOptions.years.filter(y => y !== "all").map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            {/* Skill */}
                            <select
                                value={skill}
                                onChange={(e) => setSkill(e.target.value)}
                                className="px-3 py-2 bg-[#0b0b12] border border-white/10 rounded-none text-[10px] font-mono text-white/80 focus:border-accent focus:outline-none transition-colors uppercase tracking-wider cursor-pointer"
                            >
                                <option value="all">All Skills</option>
                                {filterOptions.skills.filter(s => s !== "all").map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            {/* Sort Order */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 bg-[#0b0b12] border border-white/10 rounded-none text-[10px] font-mono text-white/80 focus:border-accent focus:outline-none transition-colors uppercase tracking-wider cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {(search !== "" || issuer !== "all" || year !== "all" || skill !== "all" || sortBy !== "newest") && (
                        <div className="flex justify-end border-t border-white/5 pt-4">
                            <button 
                                onClick={resetFilters}
                                className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-accent hover:text-white transition-colors focus:outline-none"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Certificates Grid */}
                {sortedCertificates.length === 0 ? (
                    <div className="border border-white/10 rounded-none p-16 text-center bg-white/[0.01]">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-none border border-accent/30 text-accent">
                            <Award size={24} />
                        </div>
                        <h3 className="mb-2 font-display text-xl font-bold uppercase tracking-wider text-white">No certificates found</h3>
                        <p className="text-white/50 font-mono text-xs uppercase tracking-wider">Try clearing filters or adjusting search queries.</p>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {sortedCertificates.map((certificate) => {
                                const isFeatured = certificate.featured;
                                const isNew = certificate.date === "2026";
                                
                                return (
                                    <motion.article 
                                        key={certificate.id} 
                                        layout
                                        variants={cardVariants}
                                        exit="exit"
                                        className={`group flex flex-col p-8 bg-[#0b0b12] hover:bg-[#12151d] transition-all duration-300 relative border ${
                                            isFeatured ? "border-accent/30 shadow-[0_0_20px_rgba(104,212,204,0.05)]" : "border-white/10"
                                        } hover:border-accent/40 hover:shadow-[0_0_30px_rgba(104,212,204,0.08)] hover:-translate-y-1 hover:z-10 cursor-default rounded-none`}
                                    >
                                        {/* Holographic Scan Effect */}
                                        <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/80 shadow-[0_0_8px_rgba(104,212,204,0.8)] animate-scan-line" />
                                        </div>
                                        
                                        {/* Card Header */}
                                        <div className="mb-8 flex items-center justify-between z-20">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-none border border-white/10 group-hover:border-accent/30 text-white/50 group-hover:text-accent transition-colors duration-500 bg-white/[0.02]">
                                                <Award size={20} />
                                            </div>
                                            <div className="text-right flex flex-col items-end gap-1">
                                                <div className="flex gap-1">
                                                    {isFeatured && (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-primary bg-accent uppercase select-none rounded-none shadow-[0_0_8px_rgba(104,212,204,0.4)]">
                                                            Featured
                                                        </span>
                                                    )}
                                                    {isNew && (
                                                        <span className="px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider text-primary bg-[#8ae4dc] uppercase select-none rounded-none shadow-[0_0_8px_rgba(138,228,220,0.4)]">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="block text-[8px] font-mono text-white/30 tracking-widest uppercase mt-0.5">ID</span>
                                                <span className="block text-[10px] font-mono text-accent/80 font-medium tracking-wider leading-none">{certificate.credentialId}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Card Body */}
                                        <div className="mb-6 flex-grow z-20 flex flex-col">
                                            <h4 className="mb-2 font-display text-lg font-semibold text-white group-hover:text-accent transition-colors duration-300">
                                                {certificate.title}
                                            </h4>
                                            <span className="inline-block self-start text-[10px] font-mono uppercase tracking-widest text-accent/80 bg-accent/10 border border-accent/20 px-2 py-0.5 mb-4">
                                                {certificate.issuer}
                                            </span>
                                            <p className="text-sm leading-relaxed text-white/50 mb-6 line-clamp-3">
                                                {certificate.description}
                                            </p>
                                            
                                            {/* Skill Chips */}
                                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                                {certificate.skills.map((skillItem) => (
                                                    <span key={skillItem} className="text-[9px] font-mono bg-white/[0.02] border border-white/5 px-2 py-0.5 text-white/40 group-hover:text-white/70 group-hover:border-white/10 transition-colors">
                                                        {skillItem}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Card Footer */}
                                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 z-20">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={13} className="text-white/30" />
                                                <span>{certificate.date}</span>
                                            </div>
                                            <span className="uppercase tracking-wider text-white/50">{certificate.level}</span>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
