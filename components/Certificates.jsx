"use client";

import { Award, Calendar } from "lucide-react";
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

const Certificates = () => {
    const { certificates, loading } = useCertificates();

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

                <div className="grid gap-px bg-white/10 border border-white/10 rounded-none overflow-hidden md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((certificate) => (
                        <article 
                            key={certificate.id} 
                            className="group flex flex-col p-8 bg-[#0b0b12] hover:bg-[#12151d] transition-colors duration-500 relative"
                        >
                            {/* Holographic Scan Effect */}
                            <div className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-accent/80 shadow-[0_0_8px_rgba(104,212,204,0.8)] animate-scan-line" />
                            </div>
                            
                            <div className="mb-8 flex items-center justify-between z-20">
                                <div className="flex h-12 w-12 items-center justify-center rounded-none border border-white/10 group-hover:border-accent/30 text-white/50 group-hover:text-accent transition-colors duration-500 bg-white/[0.02]">
                                    <Award size={20} />
                                </div>
                                <div className="text-right">
                                    <span className="block text-[8px] font-mono text-white/30 tracking-widest uppercase">ID</span>
                                    <span className="block text-[10px] font-mono text-accent/80 font-medium tracking-wider">{certificate.credentialId}</span>
                                </div>
                            </div>
                            
                            <div className="mb-6 flex-grow z-20">
                                <h4 className="mb-2 font-display text-lg font-semibold text-white group-hover:text-accent transition-colors duration-300">
                                    {certificate.title}
                                </h4>
                                <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-accent/80 bg-accent/10 border border-accent/20 px-2 py-0.5 mb-4">
                                    {certificate.issuer}
                                </span>
                                <p className="text-sm leading-relaxed text-white/50 line-clamp-3">
                                    {certificate.description}
                                </p>
                            </div>
                            
                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40 z-20">
                                <div className="flex items-center gap-2">
                                    <Calendar size={13} className="text-white/30" />
                                    <span>{certificate.date}</span>
                                </div>
                                <span className="uppercase tracking-wider text-white/50">{certificate.level}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
