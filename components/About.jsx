"use client";

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

const About = () => {
    const stats = [
        { number: "2+", label: "Years experience" },
        { number: "15+", label: "Projects completed" },
        { number: "10M+", label: "Data points analyzed" },
        { number: "100%", label: "Reproducible pipelines" },
    ];

    const areasOfInterest = [
        { num: "01", name: "Data Science" },
        { num: "02", name: "Machine Learning" },
        { num: "03", name: "Deep Learning" },
        { num: "04", name: "Computer Vision" },
        { num: "05", name: "Natural Language Processing" },
        { num: "06", name: "MLOps" },
        { num: "07", name: "Data Analytics" },
        { num: "08", name: "Remote Sensing Analytics" },
    ];

    return (
        <section id="about" className="relative bg-secondary py-24">
            <div className="section-shell">
                <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-kicker mb-3">About</p>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            How I approach data work
                        </motion.h2>
                    </div>
                    <p className="section-copy lg:text-right">
                        I like the full path: understanding the problem, shaping the dataset,
                        testing the model, then shipping the smallest useful product.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="h3 text-white">
                                Data Scientist and Machine Learning Engineer passionate about data-driven solutions.
                            </h3>
                            <p className="section-copy">
                                I am a Computer Systems undergraduate at Sriwijaya University with a strong passion for Data Science, Machine Learning, and MLOps. My experience spans exploratory data analysis, predictive modeling, deep learning, and workflow orchestration using Apache Airflow. I enjoy transforming complex datasets into actionable insights and developing scalable machine learning solutions that solve real-world problems.
                            </p>
                            <p className="section-copy">
                                I build end-to-end ML pipelines and scalable data workflows, from orchestration and data cleaning to automated model deployment, experiment tracking, and monitoring. The goal is a maintainable and high-performance system that delivers real value.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {stats.map((stat) => (
                                <div key={stat.label} className="surface-card p-6">
                                    <div className="font-display text-2xl sm:text-3xl font-semibold text-accent md:text-4xl">
                                        {stat.number}
                                    </div>
                                    <div className="mt-2 text-xs font-mono uppercase tracking-wider text-white/55">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="border border-white/10 p-6 md:p-8 bg-primary/20 rounded-none relative">
                            <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent mb-6 block">
                                Areas of Interest
                            </span>
                            <div className="divide-y divide-white/10">
                                {areasOfInterest.map((area) => (
                                    <div key={area.num} className="group py-3.5 flex items-center justify-between transition-all duration-300 hover:pl-2">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-[10px] text-accent/50 tracking-wider">
                                                {area.num}
                                            </span>
                                            <span className="font-display text-base sm:text-lg font-bold tracking-tight uppercase text-white group-hover:text-accent transition-colors duration-300">
                                                {area.name}
                                              </span>
                                        </div>
                                        <div className="h-1.5 w-1.5 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
