"use client";

import { createContext, useContext, useState } from 'react';
import { DEFAULT_PROJECTS } from '@/lib/portfolio-seed';

const ProjectsContext = createContext();

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
};

export const INITIAL_PROJECTS = DEFAULT_PROJECTS;

export const ProjectsProvider = ({ children, initialProjects }) => {
    const [projects, setProjects] = useState(initialProjects || INITIAL_PROJECTS);
    const [loading] = useState(false);

    const getProject = (slug) => {
        return projects.find(
            (project) =>
                project.slug === slug ||
                (Array.isArray(project.previousSlugs) && project.previousSlugs.includes(slug))
        );
    };

    const value = {
        projects,
        setProjects,
        loading,
        getProject,
    };

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
};

export default ProjectsContext;
