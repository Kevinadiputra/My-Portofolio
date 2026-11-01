"use client";

import { useMemo, useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { useCertificates } from "@/context/CertificatesContext";
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

const Certificates = () => {
    const { certificates, loading } = useCertificates();
    const [activeFilter, setActiveFilter] = useState("all");

    const categories = useMemo(() => {
        const set = new Set();
        (certificates || []).forEach((c) => {
            if (c.category) set.add(c.category);
        });
        return ["all", "featured", ...Array.from(set)];
    }, [certificates]);

    const sortedCertificates = useMemo(() => {
        const list = [...(certificates || [])].sort((a, b) => {
            if (a.displayOrder !== undefined && b.displayOrder !== undefined && a.displayOrder !== b.displayOrder) {
                return a.displayOrder - b.displayOrder;
            }
            const dateA = parseInt(a.date, 10) || 0;
            const dateB = parseInt(b.date, 10) || 0;
            return dateB - dateA;
        });

        if (activeFilter === "all") return list;
        if (activeFilter === "featured") return list.filter((c) => c.featured);
        return list.filter((c) => c.category === activeFilter);
    }, [certificates, activeFilter]);

    if (loading) {
        return (
            <section id="certificates" className="relative bg-primary py-24 text-white border-b border-white/10">
                <div className="section-shell grid gap-6 md:grid-cols-3">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="skeleton h-72" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="certificates" className="relative bg-primary py-24 text-white border-b border-white/10">
            <div className="section-shell relative z-10">
                {/* Section Header */}
                <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2 block">
                            04 / Verified Credentials
                        </span>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Certifications & Technical Training
                        </motion.h2>
                    </div>
                    <p className="text-white/65 font-body text-sm sm:text-base leading-relaxed max-w-xl">
                        Verifiable certifications across Machine Learning, Apache Airflow orchestration, Data
                        Engineering, and Python analytics.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="mb-10 flex flex-wrap gap-2 border-b border-white/10 pb-5">
                    {categories.map((cat) => {
                        const isActive = activeFilter === cat;
                        const label =
                            cat === "all"
                                ? `All Credentials (${certificates?.length || 0})`
                                : cat === "featured"
                                ? "Featured"
                                : cat;
                        return (
                            <button
                                type="button"
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider border transition-colors duration-200 ${
                                    isActive
                                        ? "border-accent bg-accent text-primary font-semibold"
                                        : "border-white/10 bg-secondary/70 text-white/65 hover:border-accent/40 hover:text-white"
                                }`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Certifications Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedCertificates.map((certificate) => {
                        const isFeatured = Boolean(certificate.featured);
                        const hasUrl = Boolean(certificate.credentialUrl);
                        const hasImage =
                            certificate.image &&
                            !String(certificate.image).startsWith("/api/placeholder");

                        return (
                            <motion.article
                                key={certificate.id || certificate.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUpVariants}
                                className={`group flex flex-col justify-between p-6 bg-secondary/70 border transition-colors duration-200 ${
                                    isFeatured
                                        ? "border-accent/35 hover:border-accent"
                                        : "border-white/10 hover:border-accent/40"
                                }`}
                            >
                                <div>
                                    {hasImage && (
                                        <div className="mb-4 aspect-[16/10] w-full overflow-hidden border border-white/10 bg-primary">
                                            <img
                                                src={certificate.image}
                                                alt={certificate.title}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Card Header */}
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center border border-white/10 bg-primary text-accent">
                                                <Award size={16} />
                                            </div>
                                            {isFeatured && (
                                                <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/30 bg-accent/10">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {certificate.credentialId && (
                                            <div className="text-right font-mono">
                                                <span className="block text-[9px] text-white/40 uppercase">
                                                    Credential ID
                                                </span>
                                                <span className="block text-[11px] text-white/75 truncate max-w-[130px]">
                                                    {certificate.credentialId}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-accent transition-colors leading-snug">
                                        {certificate.title}
                                    </h3>
                                    <p className="text-xs font-mono text-accent/90 mt-1">
                                        {certificate.issuer}
                                    </p>

                                    <div className="mt-2.5 mb-3 font-mono text-[11px] text-white/50 flex flex-wrap gap-x-2 items-center">
                                        <span>Issued: {certificate.issued}</span>
                                        {certificate.expires && (
                                            <>
                                                <span>·</span>
                                                <span>Expires: {certificate.expires}</span>
                                            </>
                                        )}
                                    </div>

                                    {certificate.description && (
                                        <p className="text-xs leading-relaxed text-white/65 mb-4">
                                            {certificate.description}
                                        </p>
                                    )}

                                    {Array.isArray(certificate.skills) && certificate.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                            {certificate.skills.map((skillItem) => (
                                                <span
                                                    key={skillItem}
                                                    className="text-[10px] font-mono bg-primary/70 border border-white/10 px-2 py-0.5 text-white/70"
                                                >
                                                    {skillItem}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                                    <span className="text-white/45 uppercase text-[10px]">
                                        {certificate.category || certificate.level || "Verified"}
                                    </span>

                                    {hasUrl ? (
                                        <a
                                            href={certificate.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-accent hover:underline font-medium"
                                        >
                                            <span>Verify Credential</span>
                                            <ExternalLink size={12} />
                                        </a>
                                    ) : (
                                        <span className="text-white/35 text-[11px]">Archived</span>
                                    )}
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
