"use client";

import { createContext, useContext, useState } from 'react';

const CertificatesContext = createContext();

export const useCertificates = () => {
    const context = useContext(CertificatesContext);
    if (!context) {
        throw new Error('useCertificates must be used within a CertificatesProvider');
    }
    return context;
};

const certificatesData = [
    {
        id: 12,
        title: "Belajar Pengembangan Machine Learning",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2025",
        image: "/api/placeholder/400/300",
        credentialId: "ML-DEV-DICODING-2025",
        skills: ["Machine Learning", "TensorFlow", "NLP", "Time Series Forecasting", "Image Classification"],
        description: "Advanced machine learning developer path covering deep neural networks, natural language processing with text embeddings, and time-series forecasting with TensorFlow.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: true,
        category: "Machine Learning",
        level: "Intermediate",
        duration: "2 months"
    },
    {
        id: 11,
        title: "Belajar Machine Learning untuk Pemula",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "ML-PEMULA-DICODING-2024",
        skills: ["Machine Learning", "Supervised Learning", "Regression", "Classification", "Scikit-Learn"],
        description: "Learned basic concepts of machine learning, classification, regression, and data clustering, implementing algorithms in Python using Scikit-Learn.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "Machine Learning",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 13,
        title: "Belajar Dasar Data Science",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "DS-BASICS-DICODING-2024",
        skills: ["Data Science", "Data Analytics", "Statistics", "Pandas", "Matplotlib"],
        description: "Learned data science methodology, statistical analysis, data modeling, exploratory data analysis, and uncovering meaningful patterns from unstructured datasets.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "Data Science",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 14,
        title: "Belajar Analisis Data dengan Python",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "DA-PYTHON-DICODING-2024",
        skills: ["Data Analysis", "Python", "Data Wrangling", "Exploratory Data Analysis", "Streamlit"],
        description: "Focused on end-to-end data analysis workflow: gathering data, assessing and cleaning data, exploratory data analysis, and building interactive data dashboards using Streamlit.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "Data Science",
        level: "Intermediate",
        duration: "1 month"
    },
    {
        id: 8,
        title: "Belajar SQL",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "SQL-DICODING-2024",
        skills: ["SQL", "Relational Databases", "Data Querying", "Database Schemas", "MySQL"],
        description: "Learned core database principles and SQL querying, including data manipulation (DML), data definition (DDL), joins, indexing, and aggregate functions.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "Database",
        level: "Intermediate",
        duration: "1 month"
    },
    {
        id: 1,
        title: "Apache Airflow Certified (DAG Authoring)",
        issuer: "Astronomer",
        platform: "Astronomer Academy",
        date: "2025",
        image: "/api/placeholder/400/300",
        credentialId: "AA-DAG-2025",
        skills: ["Apache Airflow", "DAG Authoring", "Data Orchestration", "Python", "Data Pipelines"],
        description: "Official certification validating advanced proficiency in designing, writing, scheduling, and troubleshooting Apache Airflow Directed Acyclic Graphs (DAGs) for orchestrating data and machine learning workflows.",
        verifyUrl: "https://www.credly.com/org/astronomer",
        featured: true,
        category: "MLOps & Infrastructure",
        level: "Professional",
        duration: "2 months",
        overview: {
            summary: "Validated expertise in writing and orchestrating complex data workflows, managing dependency graphs, and building robust data pipelines using Apache Airflow.",
            projects: [
                {
                    title: "Automated Data Pipeline Orchestration",
                    description: "Built and orchestrated an end-to-end ETL and model training pipeline. Configured task dependencies, dynamic task generation, and custom operators in Apache Airflow.",
                    image: "/api/placeholder/600/400",
                    tech: ["Apache Airflow", "Python", "PostgreSQL", "Docker"],
                    highlights: [
                        "Automated ingestion of 10M+ daily events",
                        "Designed dynamic DAGs with task mapping",
                        "Configured failure alerting via Slack",
                        "Integrated Spark processing jobs"
                    ]
                }
            ],
            achievements: [
                "Achieved Astronomer DAG Authoring Certification",
                "Reduced data processing failures by 35% through robust Airflow retries and callbacks",
                "Designed reusable custom plugins and operators",
                "Orchestrated ML model retraining schedule based on data drift indicators"
            ]
        }
    },
    {
        id: 7,
        title: "Belajar Dasar-Dasar DevOps",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "DEVOPS-DICODING-2024",
        skills: ["DevOps Culture", "CI/CD Pipelines", "Git", "GitHub Actions", "Shell Scripting", "YAML"],
        description: "Learned the foundational principles of DevOps culture, continuous integration and continuous delivery (CI/CD), automating build/test workflows, and configuration management.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "MLOps & Infrastructure",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 6,
        title: "Google Cloud Arcade Facilitator",
        issuer: "Google Cloud",
        platform: "Qwiklabs / Google Cloud Skills Boost",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "GCA-FAC-2024",
        skills: ["Google Cloud Platform (GCP)", "Compute Engine", "Cloud Storage", "IAM", "Kubernetes Engine"],
        description: "Guided and facilitated Google Cloud learning pathways, helping participants complete hands-on labs, deploy cloud architectures, and master GCP fundamentals.",
        verifyUrl: "https://www.qwiklabs.com",
        featured: false,
        category: "Cloud",
        level: "Intermediate",
        duration: "3 months"
    },
    {
        id: 9,
        title: "Memulai Pemrograman dengan Python",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "PYTHON-DICODING-2024",
        skills: ["Python", "Control Flow", "Object-Oriented Programming (OOP)", "Functions", "Data Structures"],
        description: "Introduction to software development with Python, mastering basic data types, control flow statements, building reusable functions, OOP, and data parsing.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "Programming",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 10,
        title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        image: "/api/placeholder/400/300",
        credentialId: "SE-BASICS-DICODING-2024",
        skills: ["Software Engineering Basics", "Programming Logic", "Flowcharts", "Algorithmic Thinking"],
        description: "Learned computational thinking, software lifecycle basics, flowchart designing, logic gates, and the foundational algorithms necessary for professional software development.",
        verifyUrl: "https://www.dicoding.com/certificates/verify",
        featured: false,
        category: "Programming",
        level: "Beginner",
        duration: "1 month"
    }
];

export const CertificatesProvider = ({ children }) => {
    const [certificates] = useState(certificatesData);
    const [loading] = useState(false);

    const getCertificate = (id) => {
        return certificates.find(certificate => certificate.id === Number(id));
    };

    const value = {
        certificates,
        loading,
        getCertificate,
    };

    return (
        <CertificatesContext.Provider value={value}>
            {children}
        </CertificatesContext.Provider>
    );
};
