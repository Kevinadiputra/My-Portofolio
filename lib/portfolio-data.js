import { cache } from "react";
import {
    DEFAULT_EDUCATION,
    DEFAULT_EXPERIENCE,
    DEFAULT_PROFILE,
    DEFAULT_SITE_SETTINGS,
    DEFAULT_SKILLS,
} from "@/lib/portfolio-defaults";
import { DEFAULT_CERTIFICATES, DEFAULT_PROJECTS } from "@/lib/portfolio-seed";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

function formatYearFromDate(dateStr, fallback = "2026") {
    if (!dateStr) return fallback;
    const year = String(dateStr).slice(0, 4);
    return /^\d{4}$/.test(year) ? year : fallback;
}

function formatPeriod(startDate, endDate, isCurrent) {
    if (!startDate && !endDate) return "Present";
    const formatMonthYear = (val) => {
        if (!val) return "";
        const d = new Date(val);
        if (Number.isNaN(d.getTime())) return String(val);
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };
    const start = formatMonthYear(startDate);
    if (isCurrent) return `${start || "Active"} — Present`;
    const end = formatMonthYear(endDate);
    if (start && end && start !== end) return `${start} — ${end}`;
    return start || end || "";
}

export function mapDbProjectToPublic(row, index = 0) {
    const year = formatYearFromDate(row.end_date || row.start_date || row.created_at, "2026");
    const galleryFromUrls = Array.isArray(row.gallery_urls)
        ? row.gallery_urls.filter(Boolean).map((url, idx) => ({
              image: url,
              title: `${row.title} — Visual ${idx + 1}`,
              description: row.short_description || row.tagline || "",
          }))
        : [];

    const metrics = Array.isArray(row.metrics) ? row.metrics : [];
    const process = Array.isArray(row.process) ? row.process : [];
    const learnings = Array.isArray(row.learnings) ? row.learnings : [];

    return {
        id: row.id || index + 1,
        slug: row.slug,
        previousSlugs: Array.isArray(row.previous_slugs) ? row.previous_slugs : [],
        title: row.title,
        tagline: row.tagline || row.short_description || "",
        description: row.short_description || row.full_description || row.overview || "",
        shortDescription: row.short_description || row.tagline || "",
        fullDescription: row.full_description || row.overview || row.short_description || "",
        image: row.thumbnail_url || "/projects/data-pipeline.svg",
        technologies: Array.isArray(row.technologies) ? row.technologies : [],
        category: row.category || "data-science",
        projectRole: row.project_role || (row.category === "mlops" ? "MLOps Engineer" : row.category === "data-engineering" ? "Data Engineer" : "ML Engineer & Data Scientist"),
        date: year,
        year,
        startDate: row.start_date || null,
        endDate: row.end_date || null,
        status: row.status_label || "Completed",
        liveUrl: row.live_url || "#",
        githubUrl: row.github_url || "#",
        featured: Boolean(row.is_featured),
        highlight: Boolean(row.is_featured),
        showOnHomepage: row.show_on_homepage !== false,
        displayOrder: Number(row.display_order ?? index),
        metrics,
        overview: row.overview || row.full_description || row.short_description || "",
        challenge: row.challenge || "",
        solution: row.solution || "",
        process,
        gallery: galleryFromUrls,
        learnings,
    };
}

export function mapDbCertificateToPublic(row, index = 0) {
    const issuedDate = row.issued_at ? new Date(row.issued_at) : null;
    const expiresDate = row.expires_at ? new Date(row.expires_at) : null;
    const issuedFormatted =
        issuedDate && !Number.isNaN(issuedDate.getTime())
            ? issuedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
            : row.issued_at || "Verified";
    const expiresFormatted =
        expiresDate && !Number.isNaN(expiresDate.getTime())
            ? expiresDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
            : null;

    return {
        id: row.id || index + 1,
        title: row.title,
        issuer: row.issuer || "",
        platform: row.platform || row.issuer || "",
        date: formatYearFromDate(row.issued_at || row.created_at, "2025"),
        issued: issuedFormatted,
        expires: expiresFormatted,
        image: row.image_url || null,
        credentialId: row.credential_id || "",
        credentialUrl: row.credential_url || "",
        skills: Array.isArray(row.skills) ? row.skills : [],
        description: row.description || "",
        featured: Boolean(row.featured),
        category: row.category || "Machine Learning",
        level: row.level || "Verified",
        duration: row.duration || "",
        overview: row.overview || null,
        displayOrder: Number(row.display_order ?? index),
    };
}

export function mapDbExperienceToPublic(row) {
    const achievements = Array.isArray(row.achievements) && row.achievements.length > 0
        ? row.achievements
        : row.description
        ? [row.description]
        : [];

    return {
        id: row.id,
        role: row.position,
        position: row.position,
        company: row.organization,
        organization: row.organization,
        employmentType: row.employment_type || "",
        period: formatPeriod(row.start_date, row.end_date, row.is_current),
        location: row.location || "Indonesia",
        description: row.description || "",
        focus: achievements,
        achievements,
        tech: Array.isArray(row.technologies) ? row.technologies : [],
        logoUrl: row.logo_url || null,
        isCurrent: Boolean(row.is_current),
    };
}

export function mapDbEducationToPublic(row) {
    return {
        id: row.id,
        institution: row.institution,
        degree: row.degree,
        fieldOfStudy: row.field_of_study || "",
        location: row.location || "Indonesia",
        period: formatPeriod(row.start_date, row.end_date, false) || "2021 — 2025",
        description: row.description || "",
    };
}

export function mapDbSkillToPublic(row) {
    return {
        id: row.id,
        name: row.name,
        category: row.category || "Data Science",
        proficiency: row.proficiency || "",
        icon: row.icon || "",
        displayOrder: Number(row.display_order ?? 0),
    };
}

export function mapDbProfileToPublic(row) {
    if (!row) return DEFAULT_PROFILE;
    return {
        ...DEFAULT_PROFILE,
        name: row.name || DEFAULT_PROFILE.name,
        title: row.professional_title || DEFAULT_PROFILE.title,
        professional_title: row.professional_title || DEFAULT_PROFILE.professional_title,
        bio: row.bio || DEFAULT_PROFILE.bio,
        profilePicture: row.profile_photo_url || DEFAULT_PROFILE.profilePicture,
        profile_photo_url: row.profile_photo_url || DEFAULT_PROFILE.profile_photo_url,
        cvUrl: row.cv_url || DEFAULT_PROFILE.cvUrl,
        cv_url: row.cv_url || DEFAULT_PROFILE.cv_url,
        email: row.email || DEFAULT_PROFILE.email,
        phone: row.phone || DEFAULT_PROFILE.phone,
        location: row.location || DEFAULT_PROFILE.location,
        github: row.github_url || DEFAULT_PROFILE.github,
        github_url: row.github_url || DEFAULT_PROFILE.github_url,
        linkedin: row.linkedin_url || DEFAULT_PROFILE.linkedin,
        linkedin_url: row.linkedin_url || DEFAULT_PROFILE.linkedin_url,
        website: row.website_url || DEFAULT_PROFILE.website,
        website_url: row.website_url || DEFAULT_PROFILE.website_url,
        availabilityStatus: row.availability_status || DEFAULT_PROFILE.availabilityStatus,
        availability_status: row.availability_status || DEFAULT_PROFILE.availability_status,
    };
}

export const getPublicPortfolioData = cache(async () => {
    const supabase = createPublicSupabaseClient();

    if (!supabase) {
        return {
            source: "fallback",
            profile: DEFAULT_PROFILE,
            siteSettings: DEFAULT_SITE_SETTINGS,
            projects: DEFAULT_PROJECTS,
            certificates: DEFAULT_CERTIFICATES,
            experiences: DEFAULT_EXPERIENCE,
            education: DEFAULT_EDUCATION,
            skills: DEFAULT_SKILLS,
        };
    }

    try {
        const [
            projectsRes,
            certificatesRes,
            experienceRes,
            educationRes,
            skillsRes,
            profileRes,
            settingsRes,
        ] = await Promise.all([
            supabase
                .from("projects")
                .select("*")
                .eq("is_published", true)
                .order("display_order", { ascending: true })
                .order("updated_at", { ascending: false }),
            supabase
                .from("certificates")
                .select("*")
                .eq("is_published", true)
                .order("display_order", { ascending: true })
                .order("issued_at", { ascending: false }),
            supabase
                .from("experience")
                .select("*")
                .eq("is_published", true)
                .order("display_order", { ascending: true })
                .order("start_date", { ascending: false }),
            supabase
                .from("education")
                .select("*")
                .eq("is_published", true)
                .order("display_order", { ascending: true })
                .order("start_date", { ascending: false }),
            supabase
                .from("skills")
                .select("*")
                .eq("is_published", true)
                .order("display_order", { ascending: true }),
            supabase.from("profiles").select("*").eq("id", true).maybeSingle(),
            supabase.from("site_settings").select("*").eq("id", true).maybeSingle(),
        ]);

        // Determine if database has been seeded / initialized yet
        const hasAnyDbContent =
            (projectsRes.data && projectsRes.data.length > 0) ||
            (certificatesRes.data && certificatesRes.data.length > 0) ||
            (experienceRes.data && experienceRes.data.length > 0) ||
            (educationRes.data && educationRes.data.length > 0) ||
            (skillsRes.data && skillsRes.data.length > 0) ||
            Boolean(profileRes.data);

        if (!hasAnyDbContent) {
            return {
                source: "fallback",
                profile: DEFAULT_PROFILE,
                siteSettings: DEFAULT_SITE_SETTINGS,
                projects: DEFAULT_PROJECTS,
                certificates: DEFAULT_CERTIFICATES,
                experiences: DEFAULT_EXPERIENCE,
                education: DEFAULT_EDUCATION,
                skills: DEFAULT_SKILLS,
            };
        }

        return {
            source: "database",
            profile: mapDbProfileToPublic(profileRes.data),
            siteSettings: settingsRes.data
                ? { ...DEFAULT_SITE_SETTINGS, ...settingsRes.data }
                : DEFAULT_SITE_SETTINGS,
            projects: (projectsRes.data || []).map(mapDbProjectToPublic),
            certificates: (certificatesRes.data || []).map(mapDbCertificateToPublic),
            experiences: (experienceRes.data || []).map(mapDbExperienceToPublic),
            education: (educationRes.data || []).map(mapDbEducationToPublic),
            skills: (skillsRes.data || []).map(mapDbSkillToPublic),
        };
    } catch {
        return {
            source: "fallback",
            profile: DEFAULT_PROFILE,
            siteSettings: DEFAULT_SITE_SETTINGS,
            projects: DEFAULT_PROJECTS,
            certificates: DEFAULT_CERTIFICATES,
            experiences: DEFAULT_EXPERIENCE,
            education: DEFAULT_EDUCATION,
            skills: DEFAULT_SKILLS,
        };
    }
});
