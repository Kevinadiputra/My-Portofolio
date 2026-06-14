"use client";

import { Briefcase, Calendar, MapPin } from "lucide-react";
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

const Experience = () => {
    const experiences = [
        {
            company: "Build with AI 2026",
            role: "Project Officer",
            period: "2026",
            location: "Palembang, Indonesia",
            focus: [
                "AI community leadership and strategy coordination",
                "Workshop planning, coordination, and developer engagement",
                "Technical event management for regional AI initiatives"
            ],
            tech: ["Generative AI", "Developer Relations", "Community Management"]
        },
        {
            company: "GDGoC Universitas Sriwijaya",
            role: "Core Team Machine Learning",
            period: "2024 - 2025",
            location: "Palembang, Indonesia",
            focus: [
                "Led machine learning mentoring cohorts and knowledge sharing sessions",
                "Designed and coordinated hands-on technical workshops",
                "Fostered machine learning community growth and developer collaboration"
            ],
            tech: ["Machine Learning", "TensorFlow", "Mentorship", "Technical Workshops"]
        },
        {
            company: "PT Pupuk Sriwidjaja Palembang",
            role: "IT Intern (Data & ML Focus)",
            period: "2024",
            location: "Palembang, Indonesia",
            focus: [
                "Conducted Exploratory Data Analysis (EDA) on agricultural and operational data",
                "Built and evaluated predictive machine learning models for carbon stock estimation",
                "Performed data preprocessing, feature engineering, and model validation",
                "Generated explanatory data analyses and insights to support data-driven decision-making"
            ],
            tech: ["Python", "Pandas", "Scikit-Learn", "XGBoost", "Data Analytics"]
        }
    ];

    return (
        <section id="experience" className="relative overflow-hidden bg-secondary py-24 text-white">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            <div className="section-shell relative z-10">
                <div className="mb-16 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-4 block">
                            Path & Progression
                        </span>
                        <motion.h3
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-none"
                        >
                            RELEVANT EXPERIENCE
                        </motion.h3>
                    </div>
                    <p className="text-white/60 font-body text-base sm:text-lg leading-relaxed max-w-xl lg:ml-auto">
                        A history of technical leadership, data science research, and machine learning development. 
                        Focused on building AI communities and engineering analytics pipelines.
                    </p>
                </div>

                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <div 
                            key={index}
                            className="group border border-white/10 rounded-none bg-primary/40 p-8 hover:bg-[#12151d] hover:border-accent/30 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                                            {exp.role}
                                        </h4>
                                        <span className="text-white/30 hidden sm:inline">•</span>
                                        <span className="text-accent font-mono text-sm tracking-wide">
                                            {exp.company}
                                        </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-white/50">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} className="text-accent" />
                                            <span>{exp.period}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-accent" />
                                            <span>{exp.location}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-2.5 mt-4 list-none pl-0">
                                        {exp.focus.map((item, fIdx) => (
                                            <li key={fIdx} className="text-sm sm:text-base text-white/75 font-body flex items-start gap-3">
                                                <span className="h-1.5 w-1.5 rounded-none bg-accent shrink-0 mt-2" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-wrap md:flex-col md:items-end gap-2 shrink-0">
                                    {exp.tech.map((t, tIdx) => (
                                        <span 
                                            key={tIdx} 
                                            className="text-[10px] font-mono uppercase tracking-widest text-white/55 bg-white/5 border border-white/10 px-2.5 py-1 rounded-none hover:border-accent/40 hover:text-accent transition-colors duration-300"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
