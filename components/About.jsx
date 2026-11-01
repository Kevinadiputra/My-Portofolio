"use client";

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

const WORKFLOW_PILLARS = [
    {
        step: "01",
        title: "Problem Framing & Data Profiling",
        detail:
            "Auditing raw distributions, handling missing values or extreme skewness (IQR, log1p), and eliminating multicollinearity before model selection.",
    },
    {
        step: "02",
        title: "Predictive & Spatial Modeling",
        detail:
            "Training and benchmarking supervised learning, ensemble (XGBoost, Random Forest), CNN, and lexicon NLP models with K-Fold cross-validation.",
    },
    {
        step: "03",
        title: "Pipeline & DAG Orchestration",
        detail:
            "Structuring modular Extract-Transform-Load workflows with Python, Pandas, Pytest coverage, and Apache Airflow DAG scheduling.",
    },
    {
        step: "04",
        title: "Deployment, Tracking & Monitoring",
        detail:
            "Logging experiments in MLflow, packaging inference APIs with FastAPI and Docker, and tracking runtime metrics with Prometheus and Grafana.",
    },
];

const About = () => {
    const { profile, education } = useProfile();
    const primaryEdu = education?.[0];

    return (
        <section id="about" className="relative bg-secondary py-24 border-b border-white/10">
            <div className="section-shell">
                <div className="mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2">
                            01 / Engineering Approach
                        </p>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            How I Approach Data & ML Systems
                        </motion.h2>
                    </div>
                    <p className="text-sm sm:text-base text-white/65 max-w-xl">
                        Focusing on the complete lifecycle: from exploratory data validation and feature
                        engineering to reproducible pipelines and decision-ready interfaces.
                    </p>
                </div>

                <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 items-start">
                    <div className="space-y-6">
                        <div className="border border-white/10 bg-primary/50 p-6 sm:p-8 space-y-4">
                            <div className="font-mono text-xs uppercase tracking-wider text-accent">
                                Background & Focus
                            </div>
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                                Computer Systems Undergraduate Specializing in Data Science, Machine Learning, and MLOps
                            </h3>
                            <p className="text-sm sm:text-base text-white/75 leading-relaxed">
                                {profile?.bio ||
                                    "I am a Computer Systems undergraduate at Universitas Sriwijaya focused on Data Science, Machine Learning, and MLOps. My work spans exploratory data analysis, predictive modeling, computer vision, and automated workflow orchestration."}
                            </p>
                            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                                Rather than treating models as isolated notebooks, I focus on how data is ingested,
                                validated, tested with unit tests, tracked in MLflow, and served through interactive
                                dashboards or containerized APIs.
                            </p>

                            {primaryEdu && (
                                <div className="pt-4 mt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                                    <div>
                                        <span className="text-white font-semibold">{primaryEdu.institution}</span>
                                        <span className="text-white/50"> · {primaryEdu.degree}</span>
                                    </div>
                                    <span className="text-accent">{primaryEdu.period}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                        {WORKFLOW_PILLARS.map((pillar) => (
                            <div
                                key={pillar.step}
                                className="border border-white/10 bg-primary/40 p-5 flex flex-col justify-between hover:border-accent/35 transition-colors duration-200"
                            >
                                <div>
                                    <span className="font-mono text-xs text-accent font-semibold">
                                        {pillar.step}
                                    </span>
                                    <h4 className="font-display text-base font-bold text-white mt-2">
                                        {pillar.title}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-white/65 leading-relaxed mt-2">
                                        {pillar.detail}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
