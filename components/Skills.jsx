"use client";

import { useState } from "react";
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

const Skills = () => {
    const [activeCategory, setActiveCategory] = useState("data-science");

    const skillCategories = {
        "data-science": {
            title: "Data Science",
            skills: [
                { name: "Python", level: 95 },
                { name: "Pandas", level: 90 },
                { name: "NumPy", level: 90 },
                { name: "Scikit-Learn", level: 90 },
                { name: "Data Visualization", level: 85 },
                { name: "Exploratory Data Analysis", level: 95 },
                { name: "Statistical Analysis", level: 85 },
            ],
        },
        "machine-learning": {
            title: "Machine Learning",
            skills: [
                { name: "Supervised Learning", level: 90 },
                { name: "Regression", level: 95 },
                { name: "Classification", level: 90 },
                { name: "Model Evaluation", level: 85 },
                { name: "Feature Engineering", level: 90 },
            ],
        },
        "deep-learning": {
            title: "Deep Learning",
            skills: [
                { name: "TensorFlow", level: 80 },
                { name: "Keras", level: 80 },
                { name: "CNN", level: 85 },
                { name: "Computer Vision", level: 80 },
                { name: "NLP", level: 80 },
            ],
        },
        "mlops": {
            title: "Data Engineering & MLOps",
            skills: [
                { name: "Apache Airflow", level: 90 },
                { name: "SQL", level: 90 },
                { name: "Workflow Automation", level: 85 },
                { name: "Data Pipelines", level: 90 },
                { name: "Model Lifecycle", level: 80 },
                { name: "Experiment Tracking", level: 80 },
                { name: "ML Deployment Fundamentals", level: 75 },
            ],
        },
        "cloud": {
            title: "Cloud",
            skills: [
                { name: "Google Cloud Platform", level: 80 },
                { name: "Amazon Web Services", level: 75 },
            ],
        },
    };

    const getLevel = (level) => {
        if (level >= 85) return "Expert";
        if (level >= 70) return "Advanced";
        return "Intermediate";
    };

    return (
        <section id="skills" className="relative bg-primary py-24">
            <div className="section-shell">
                <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-kicker mb-3">Skills</p>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="h2 mb-4 text-white"
                        >
                            Technical stack
                        </motion.h2>
                        <p className="section-copy">
                            A practical toolkit for building, evaluating, and deploying
                            intelligent data products.
                        </p>
                    </div>
                    <div className="hidden h-px w-32 bg-accent/40 lg:block" />
                </div>

                <div className="mb-10 flex flex-wrap gap-3">
                    {Object.keys(skillCategories).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`chip px-4 py-2 transition-all duration-300 ${
                                activeCategory === category ? "chip-active" : "hover:border-accent/40 hover:text-white"
                            }`}
                        >
                            {skillCategories[category].title}
                        </button>
                    ))}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {skillCategories[activeCategory].skills.map((skill) => (
                        <article key={skill.name} className="surface-card p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold text-white">{skill.name}</h3>
                                <span className="font-mono text-sm text-accent">{skill.level}%</span>
                            </div>

                            <div className="mb-4 h-2.5 overflow-hidden rounded-none bg-primary/80">
                                <div
                                    className="h-full rounded-none bg-accent shadow-[0_0_24px_rgba(104,212,204,0.35)] transition-all duration-1000 ease-out"
                                    style={{ width: `${skill.level}%` }}
                                />
                            </div>

                            <span className="chip">{getLevel(skill.level)}</span>
                        </article>
                    ))}
                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className="surface-card p-6">
                        <p className="section-kicker mb-2">Now learning</p>
                        <h3 className="h4 text-white">Kubernetes, MLOps Pipelines, & Distributed Systems</h3>
                    </div>
                    <div className="glass-panel rounded-none p-6">
                        <p className="text-white/70 leading-relaxed font-body">
                            I am focusing on production-grade infrastructure: orchestrating ML models on Kubernetes,
                            deploying robust data orchestration systems, configuring GitOps pipelines, and optimizing
                            Airflow runners for automated data retraining cycles.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
