"use client";

import { Calendar, GraduationCap, MapPin, Briefcase } from "lucide-react";
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

const Experience = () => {
    const { experiences, education } = useProfile();

    return (
        <section id="experience" className="relative bg-secondary py-24 text-white border-b border-white/10">
            <div className="section-shell relative z-10">
                <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2 block">
                            05 / Experience & Education
                        </span>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Professional, Organizational & Academic Path
                        </motion.h2>
                    </div>
                    <p className="text-white/65 font-body text-sm sm:text-base leading-relaxed max-w-xl">
                        Industry internship, machine learning mentorship, community leadership, and formal Computer Systems education.
                    </p>
                </div>

                {/* Experience List */}
                <div className="space-y-6">
                    {(experiences || []).map((exp, index) => {
                        const achievements =
                            Array.isArray(exp.achievements) && exp.achievements.length > 0
                                ? exp.achievements
                                : Array.isArray(exp.focus) && exp.focus.length > 0
                                ? exp.focus
                                : exp.description
                                ? [exp.description]
                                : [];
                        const technologies = exp.tech || exp.technologies || [];

                        return (
                            <motion.article
                                key={exp.id || index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUpVariants}
                                className="border border-white/10 bg-primary/55 p-6 sm:p-8 hover:border-accent/35 transition-colors duration-200"
                            >
                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                    <div className="space-y-3 max-w-3xl">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            {exp.logoUrl && (
                                                <img
                                                    src={exp.logoUrl}
                                                    alt={exp.company || exp.organization}
                                                    className="h-7 w-7 object-contain border border-white/10 bg-secondary p-0.5"
                                                />
                                            )}
                                            <h3 className="font-display text-xl font-bold text-white">
                                                {exp.role || exp.position}
                                            </h3>
                                            <span className="text-white/30">·</span>
                                            <span className="text-accent font-mono text-sm font-medium">
                                                {exp.company || exp.organization}
                                            </span>
                                            {exp.employmentType && (
                                                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 border border-white/10 bg-secondary text-white/70">
                                                    {exp.employmentType}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-mono text-white/55">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-accent" />
                                                <span>{exp.period}</span>
                                            </div>
                                            {exp.location && (
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={13} className="text-accent" />
                                                    <span>{exp.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {achievements.length > 0 && (
                                            <ul className="space-y-2 pt-2 list-none pl-0">
                                                {achievements.map((item, fIdx) => (
                                                    <li
                                                        key={fIdx}
                                                        className="text-sm text-white/75 font-body flex items-start gap-3 leading-relaxed"
                                                    >
                                                        <span className="h-1.5 w-1.5 bg-accent shrink-0 mt-2" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {technologies.length > 0 && (
                                        <div className="flex flex-wrap md:flex-col md:items-end gap-1.5 shrink-0">
                                            {technologies.map((t, tIdx) => (
                                                <span
                                                    key={tIdx}
                                                    className="text-[11px] font-mono text-white/70 bg-secondary border border-white/10 px-2.5 py-1"
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.article>
                        );
                    })}
                </div>

                {/* Academic Background / Education Section */}
                {education && education.length > 0 && (
                    <div className="mt-14 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-2.5 mb-6">
                            <GraduationCap size={18} className="text-accent" />
                            <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                                Academic Education
                            </h3>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {education.map((edu, idx) => (
                                <motion.article
                                    key={edu.id || idx}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUpVariants}
                                    className="border border-white/10 bg-primary/55 p-6 sm:p-7"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-accent mb-2">
                                        <span>{edu.institution}</span>
                                        <span>{edu.period}</span>
                                    </div>
                                    <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                                        {edu.degree}
                                    </h4>
                                    {edu.fieldOfStudy && (
                                        <p className="font-mono text-xs text-white/60 mt-1">
                                            Focus: {edu.fieldOfStudy}
                                        </p>
                                    )}
                                    {edu.description && (
                                        <p className="text-sm text-white/70 leading-relaxed mt-3">
                                            {edu.description}
                                        </p>
                                    )}
                                </motion.article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Experience;
