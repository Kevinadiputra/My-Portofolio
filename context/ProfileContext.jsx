"use client";

import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

const profileData = {
    name: 'Kevin Adiputra',
    title: 'Machine Learning Engineer & Data Scientist',
    bio: 'Machine Learning Engineer and Data Scientist focused on transforming data into actionable insights through Machine Learning, Data Analytics, Remote Sensing, Deep Learning, and MLOps.',
    profilePicture: '/profile-picture.jpg',
    email: 'kevinadiputra66@gmail.com',
    phone: '+62 821-8185-7340',
    location: 'Indonesia',
    linkedin: 'https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/',
    github: 'https://github.com/Kevinadiputra',
    website: 'https://kevin-adiputra-portfolio.vercel.app',
    skills: [
        'Machine Learning', 'Data Science', 'Data Analytics', 'Deep Learning', 
        'Computer Vision', 'NLP', 'MLOps', 'Remote Sensing', 'Python', 'SQL',
        'Apache Airflow', 'Docker', 'DevOps', 'TensorFlow', 'XGBoost'
    ],
    experience: [
        {
            title: 'Project Officer',
            company: 'Build with AI 2026',
            period: '2026',
            description: 'Led community organization, workshop planning, and technical event management for regional AI initiatives, driving developer engagement and AI collaboration.'
        },
        {
            title: 'Core Team Machine Learning',
            company: 'GDGoC Universitas Sriwijaya',
            period: '2024 - 2025',
            description: 'Mentored developer cohorts in machine learning fundamentals, designed technical workshops, and organized community-building sessions for aspiring data practitioners.'
        },
        {
            title: 'IT Intern (Data & ML Focus)',
            company: 'PT Pupuk Sriwidjaja Palembang',
            period: '2024',
            description: 'Conducted exploratory and explanatory data analyses, built carbon stock prediction models, handled data preprocessing/validation, and generated business intelligence reports.'
        }
    ],
    education: [
        {
            degree: 'Bachelor of Computer Science',
            institution: 'Universitas Sriwijaya',
            period: '2021 - 2025'
        }
    ]
};

export const ProfileProvider = ({ children }) => {
    const [profile] = useState(profileData);
    const [loading] = useState(false);

    const value = {
        profile,
        loading,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

export default ProfileContext;
