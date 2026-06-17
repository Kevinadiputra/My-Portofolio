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
        id: 1,
        title: "Membangun Sistem Machine Learning",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2026",
        issued: "June 2026",
        expires: "June 2029",
        image: "/api/placeholder/400/300",
        credentialId: "98XW07580XM3",
        skills: ["Machine Learning", "Machine Learning Pipeline", "Model Deployment", "MLflow", "MLOps"],
        description: "Sertifikasi yang memvalidasi kemampuan dalam membangun sistem machine learning end-to-end mulai dari preprocessing data, training model, evaluasi, deployment, hingga monitoring performa model pada lingkungan produksi.",
        credentialUrl: "https://www.dicoding.com/certificates/98XW07580XM3",
        featured: true,
        category: "Machine Learning",
        level: "Advanced",
        duration: "1 month"
    },
    {
        id: 2,
        title: "Astronomer Certification DAG Authoring for Apache Airflow 3",
        issuer: "Astronomer",
        platform: "Astronomer Academy",
        date: "2025",
        issued: "July 2025",
        expires: "No Expiration",
        image: "/api/placeholder/400/300",
        credentialId: "AA-DAG-2025",
        skills: ["Apache Airflow", "DAG Authoring", "Data Orchestration", "Python", "Data Pipelines"],
        description: "Official certification validating advanced proficiency in designing, writing, scheduling, and troubleshooting Apache Airflow Directed Acyclic Graphs (DAGs) for orchestrating data and machine learning workflows.",
        credentialUrl: "https://www.credly.com/badges/93ac71ff-16a2-49ed-a9fd-3b03694dc7cd/public_url",
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
        id: 3,
        title: "Belajar Fundamental Pemrosesan Data",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2026",
        issued: "June 2026",
        expires: "June 2029",
        image: "/api/placeholder/400/300",
        credentialId: "N9ZON17OYXG5",
        credentialUrl: "https://www.dicoding.com/certificates/N9ZON17OYXG5",
        skills: ["ETL", "Data Engineering", "Data Processing", "Data Cleaning"],
        description: "Building end-to-end ETL pipelines, transforming raw datasets into analysis-ready data.",
        featured: true,
        category: "Data Engineering",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 4,
        title: "Belajar Penggunaan Generative AI",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2025",
        issued: "May 2025",
        expires: "May 2028",
        image: "/api/placeholder/400/300",
        credentialId: "0LZ0RV6JNP65",
        credentialUrl: "https://www.dicoding.com/certificates/0LZ0RV6JNP65",
        skills: ["Generative AI", "Prompt Engineering", "AI Applications"],
        description: "Understanding generative AI concepts, practical implementation, and responsible AI usage.",
        featured: false,
        category: "Machine Learning",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 5,
        title: "Machine Learning Terapan",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "December 2024",
        expires: "December 2027",
        image: "/api/placeholder/400/300",
        credentialId: "0LZ04VRNNP65",
        credentialUrl: "https://www.dicoding.com/certificates/0LZ04VRNNP65",
        skills: ["Machine Learning", "Recommendation Systems", "Predictive Analytics", "Model Evaluation", "Data Science"],
        description: "Applied machine learning projects including recommendation systems and predictive analytics solutions.",
        featured: false,
        category: "Machine Learning",
        level: "Advanced",
        duration: "1 month"
    },
    {
        id: 6,
        title: "Belajar Analisis Data dengan Python",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "October 2024",
        expires: "October 2027",
        image: "/api/placeholder/400/300",
        credentialId: "0LZ049R40P65",
        credentialUrl: "https://www.dicoding.com/certificates/0LZ049R40P65",
        skills: ["Python", "Data Analysis", "Data Visualization", "EDA", "Dashboard Development"],
        description: "Data analysis and visualization using Python with real-world business cases.",
        featured: false,
        category: "Data Science",
        level: "Intermediate",
        duration: "1 month"
    },
    {
        id: 7,
        title: "Belajar Pengembangan Machine Learning",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "September 2024",
        expires: "September 2027",
        image: "/api/placeholder/400/300",
        credentialId: "1OP8W8KW1XQK",
        credentialUrl: "https://www.dicoding.com/certificates/1OP8W8KW1XQK",
        skills: ["TensorFlow", "Deep Learning", "Image Classification", "NLP"],
        description: "Machine learning development using TensorFlow including image classification and sentiment analysis.",
        featured: false,
        category: "Machine Learning",
        level: "Intermediate",
        duration: "2 months"
    },
    {
        id: 8,
        title: "Belajar Dasar Structured Query Language (SQL)",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "September 2024",
        expires: "September 2027",
        image: "/api/placeholder/400/300",
        credentialId: "98XW5KEQWPM3",
        credentialUrl: "https://www.dicoding.com/certificates/98XW5KEQWPM3",
        skills: ["SQL", "MySQL", "Database Query", "Relational Database"],
        description: "Database fundamentals, SQL queries, joins, aggregations, and relational database concepts.",
        featured: false,
        category: "Database",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 9,
        title: "Memulai Pemrograman dengan Python",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "September 2024",
        expires: "September 2027",
        image: "/api/placeholder/400/300",
        credentialId: "6RPNY8JWRZ2M",
        credentialUrl: "https://www.dicoding.com/certificates/6RPNY8JWRZ2M",
        skills: ["Python Programming", "Python", "Problem Solving", "Functions", "Programming Logic"],
        description: "Python programming fundamentals, problem solving, functions, modules, and programming logic.",
        featured: false,
        category: "Programming",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 10,
        title: "Belajar Machine Learning untuk Pemula",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "May 2024",
        expires: "May 2027",
        image: "/api/placeholder/400/300",
        credentialId: "RVZKRR8J4PD5",
        credentialUrl: "https://www.dicoding.com/certificates/RVZKRR8J4PD5",
        skills: ["Machine Learning", "TensorFlow", "Classification"],
        description: "Fundamental machine learning concepts and image classification projects using TensorFlow.",
        featured: false,
        category: "Machine Learning",
        level: "Beginner",
        duration: "1 month"
    },
    {
        id: 11,
        title: "Belajar Dasar Visualisasi Data",
        issuer: "Dicoding Indonesia",
        platform: "Dicoding",
        date: "2024",
        issued: "January 2024",
        expires: "January 2027",
        image: "/api/placeholder/400/300",
        credentialId: "98XW2EJ7LPM3",
        credentialUrl: "https://www.dicoding.com/certificates/98XW2EJ7LPM3",
        skills: ["Data Visualization", "Dashboard Design", "Data Storytelling"],
        description: "Data visualization fundamentals and communicating insights effectively.",
        featured: false,
        category: "Data Science",
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

export default CertificatesContext;
