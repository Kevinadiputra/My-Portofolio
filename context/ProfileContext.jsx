"use client";

import { createContext, useContext, useState } from "react";
import {
    DEFAULT_ACHIEVEMENTS,
    DEFAULT_EDUCATION,
    DEFAULT_EXPERIENCE,
    DEFAULT_PROFILE,
    DEFAULT_SITE_SETTINGS,
    DEFAULT_SKILLS,
} from "@/lib/portfolio-defaults";

const ProfileContext = createContext();

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};

export const ProfileProvider = ({
    children,
    initialProfile,
    initialSiteSettings,
    initialExperiences,
    initialEducation,
    initialAchievements,
    initialSkills,
}) => {
    const [profile] = useState(initialProfile || DEFAULT_PROFILE);
    const [siteSettings] = useState(initialSiteSettings || DEFAULT_SITE_SETTINGS);
    const [experiences] = useState(initialExperiences || DEFAULT_EXPERIENCE);
    const [education] = useState(initialEducation || DEFAULT_EDUCATION);
    const [achievements] = useState(initialAchievements || DEFAULT_ACHIEVEMENTS);
    const [skills] = useState(initialSkills || DEFAULT_SKILLS);
    const [loading] = useState(false);

    const value = {
        profile,
        siteSettings,
        experiences,
        education,
        achievements,
        skills,
        loading,
    };

    return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export default ProfileContext;
