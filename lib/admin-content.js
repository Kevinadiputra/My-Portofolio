const arrayField = (name, label, options = {}) => ({ name, label, type: "array", ...options });
const linesField = (name, label, options = {}) => ({ name, label, type: "lines", ...options });
const textField = (name, label, options = {}) => ({ name, label, type: "text", ...options });
const selectField = (name, label, choices, options = {}) => ({ name, label, type: "select", choices, ...options });
const rolesRepeaterField = (name, label, options = {}) => ({ name, label, type: "roles_repeater", ...options });
const galleryRepeaterField = (name, label, options = {}) => ({ name, label, type: "gallery_repeater", ...options });
const linksRepeaterField = (name, label, options = {}) => ({ name, label, type: "links_repeater", ...options });

export function slugifyText(value = "") {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export const ADMIN_COLLECTIONS = {
    projects: {
        label: "Projects",
        singularLabel: "Project",
        table: "projects",
        searchField: "title",
        orderField: "display_order",
        fields: [
            textField("title", "Title", { required: true, placeholder: "e.g. End-to-End Machine Learning Operations Pipeline", section: "Basic Information" }),
            textField("slug", "Slug", { required: true, placeholder: "auto-generated-from-title", section: "Basic Information" }),
            selectField(
                "category",
                "Category",
                [
                    { value: "data-science", label: "Data Science" },
                    { value: "machine-learning", label: "Machine Learning" },
                    { value: "deep-learning", label: "Deep Learning" },
                    { value: "nlp", label: "Natural Language Processing" },
                    { value: "data-engineering", label: "Data Engineering" },
                    { value: "mlops", label: "MLOps" },
                ],
                { required: true, section: "Basic Information" }
            ),
            textField("project_role", "Project Role", { placeholder: "e.g. ML Engineer / Data Scientist", section: "Basic Information" }),
            textField("tagline", "Tagline / Subtitle", { placeholder: "One-line summary of the project objective", section: "Basic Information" }),
            textField("short_description", "Short Description", {
                type: "textarea",
                required: true,
                placeholder: "Concise summary shown on project cards (2-3 sentences)",
                section: "Descriptions & Solution",
            }),
            textField("full_description", "Full Description / Overview", {
                type: "textarea",
                placeholder: "Detailed technical context and scope of the project",
                section: "Descriptions & Solution",
            }),
            textField("challenge", "Problem / Challenge", {
                type: "textarea",
                placeholder: "What technical or business problem did this project solve?",
                section: "Descriptions & Solution",
            }),
            textField("solution", "Approach / Solution", {
                type: "textarea",
                placeholder: "How was the model, pipeline, or analysis architected and validated?",
                section: "Descriptions & Solution",
            }),
            arrayField("technologies", "Technologies (comma-separated)", {
                placeholder: "Python, Scikit-Learn, MLflow, Docker, FastAPI",
                section: "Technical Stack & Assets",
            }),
            textField("thumbnail_url", "Thumbnail Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
                section: "Technical Stack & Assets",
            }),
            linesField("gallery_urls", "Gallery / Screenshot URLs (one URL per line)", {
                placeholder: "/projects/screenshot-1.png\n/projects/screenshot-2.png",
                section: "Technical Stack & Assets",
            }),
            textField("github_url", "GitHub Repository URL", {
                type: "url",
                placeholder: "https://github.com/username/repository",
                section: "Links & Timeline",
            }),
            textField("live_url", "Live Demo / Notebook URL", {
                type: "url",
                placeholder: "https://...",
                section: "Links & Timeline",
            }),
            textField("start_date", "Start Date", { type: "date", section: "Links & Timeline" }),
            textField("end_date", "End Date", { type: "date", section: "Links & Timeline" }),
            textField("metrics", "Verifiable Metrics (JSON)", {
                type: "json",
                placeholder: '[{"label": "Accuracy", "value": "97.0%", "description": "Validation split"}]',
                section: "Engineering Artifacts",
            }),
            textField("process", "Engineering Process Steps (JSON)", {
                type: "json",
                placeholder: '[{"phase": "Data Preprocessing", "description": "..."}]',
                section: "Engineering Artifacts",
            }),
            linesField("learnings", "Key Learnings (one item per line)", {
                placeholder: "Decoupling preprocessing from inference prevents training-serving skew.",
                section: "Engineering Artifacts",
            }),
            textField("display_order", "Display Order", { type: "number", section: "Publication Settings" }),
            textField("is_featured", "Featured Case Study", { type: "checkbox", section: "Publication Settings" }),
            textField("show_on_homepage", "Show on Homepage", { type: "checkbox", defaultValue: true, section: "Publication Settings" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox", defaultValue: true, section: "Publication Settings" }),
        ],
    },
    certificates: {
        label: "Certificates",
        singularLabel: "Certificate",
        table: "certificates",
        searchField: "title",
        orderField: "display_order",
        fields: [
            textField("title", "Certificate Name", { required: true, placeholder: "e.g. Membangun Sistem Machine Learning", section: "Basic Information" }),
            textField("issuer", "Issuing Organization", { required: true, placeholder: "e.g. Dicoding Indonesia / Astronomer", section: "Basic Information" }),
            textField("platform", "Platform", { placeholder: "e.g. Dicoding / Credly", section: "Basic Information" }),
            selectField(
                "category",
                "Category",
                [
                    { value: "Machine Learning", label: "Machine Learning" },
                    { value: "MLOps & Infrastructure", label: "MLOps & Infrastructure" },
                    { value: "Data Engineering", label: "Data Engineering" },
                    { value: "Generative AI", label: "Generative AI" },
                    { value: "Data Science", label: "Data Science" },
                ],
                { section: "Basic Information" }
            ),
            selectField(
                "level",
                "Level",
                [
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                    { value: "Professional", label: "Professional" },
                ],
                { section: "Basic Information" }
            ),
            textField("issued_at", "Issue Date", { type: "date", section: "Credentials & Validity" }),
            textField("expires_at", "Expiration Date", { type: "date", section: "Credentials & Validity" }),
            textField("credential_id", "Credential ID", { placeholder: "e.g. 98XW07580XM3", section: "Credentials & Validity" }),
            textField("credential_url", "Credential Verification URL", { type: "url", placeholder: "https://...", section: "Credentials & Validity" }),
            textField("duration", "Duration", { placeholder: "e.g. 1 month / 60 hours", section: "Credentials & Validity" }),
            textField("image_url", "Certificate Image / Document", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf",
                section: "Media & Scope",
            }),
            textField("description", "Description", {
                type: "textarea",
                placeholder: "Competencies and technical scope validated by this credential",
                section: "Media & Scope",
            }),
            arrayField("skills", "Validated Skills (comma-separated)", {
                placeholder: "Machine Learning, MLflow, Model Deployment",
                section: "Media & Scope",
            }),
            textField("overview", "Extended Overview (JSON, optional)", { type: "json", section: "Media & Scope" }),
            textField("display_order", "Display Order", { type: "number", section: "Publication Settings" }),
            textField("featured", "Featured Credential", { type: "checkbox", section: "Publication Settings" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox", defaultValue: true, section: "Publication Settings" }),
        ],
    },
    experience: {
        label: "Experience",
        singularLabel: "Experience",
        table: "experience",
        searchField: "organization",
        orderField: "display_order",
        fields: [
            textField("organization", "Organization / Company Name", {
                required: true,
                placeholder: "e.g. Google Developer Groups on Campus Unsri",
                section: "Organization Information",
            }),
            textField("slug", "Slug (URL identifier)", {
                placeholder: "auto-generated-from-organization",
                section: "Organization Information",
            }),
            selectField(
                "organization_type",
                "Organization / Experience Type",
                [
                    { value: "Community & Leadership", label: "Community & Leadership" },
                    { value: "Industry Internship", label: "Industry Internship" },
                    { value: "Organization", label: "Student Organization" },
                    { value: "Full-time", label: "Full-time Employment" },
                    { value: "Part-time", label: "Part-time" },
                    { value: "Contract", label: "Contract & Freelance" },
                    { value: "Academic & Research", label: "Academic & Research" },
                ],
                { section: "Organization Information" }
            ),
            textField("position", "Headline Role / Position", {
                required: true,
                placeholder: "e.g. Project Officer & ML Core Team",
                section: "Organization Information",
            }),
            textField("location", "Location", {
                placeholder: "e.g. Palembang, Indonesia",
                section: "Organization Information",
            }),
            textField("logo_url", "Organization Logo", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
                section: "Organization Information",
            }),
            textField("website_url", "Website URL", {
                type: "url",
                placeholder: "https://...",
                section: "Organization Information",
            }),
            textField("linkedin_url", "LinkedIn Profile / Page", {
                type: "url",
                placeholder: "https://linkedin.com/company/...",
                section: "Organization Information",
            }),
            textField("description", "Overview & Context", {
                type: "textarea",
                placeholder: "Detailed overview of the organization and context of your contributions",
                section: "Organization Information",
            }),
            rolesRepeaterField("roles", "Roles & Positions Held in this Organization", {
                section: "Roles & Positions Hierarchy",
            }),
            galleryRepeaterField("gallery", "Documentation Photos & Media Gallery", {
                section: "Documentation & Gallery",
            }),
            linksRepeaterField("links", "External Links & References", {
                section: "External Links & Socials",
            }),
            textField("start_date", "Tenure Start Date", { type: "date", section: "Timeline & Publication" }),
            textField("end_date", "Tenure End Date", { type: "date", disableWhenCurrent: true, section: "Timeline & Publication" }),
            textField("is_current", "Currently active here (Ongoing)", { type: "checkbox", section: "Timeline & Publication" }),
            textField("display_order", "Display Order", { type: "number", section: "Timeline & Publication" }),
            textField("is_published", "Published (visible on website)", { type: "checkbox", defaultValue: true, section: "Timeline & Publication" }),
        ],
    },
    education: {
        label: "Education",
        singularLabel: "Education",
        table: "education",
        searchField: "institution",
        orderField: "display_order",
        fields: [
            textField("institution", "Institution", { required: true, placeholder: "e.g. Universitas Sriwijaya", section: "Degree & Institution" }),
            textField("degree", "Degree", { required: true, placeholder: "e.g. Bachelor of Computer Systems (S.Kom.)", section: "Degree & Institution" }),
            textField("field_of_study", "Field of Study", { placeholder: "e.g. Computer Systems / Data Science & ML", section: "Degree & Institution" }),
            textField("location", "Location", { placeholder: "e.g. Palembang, Indonesia", section: "Degree & Institution" }),
            textField("start_date", "Start Date", { type: "date", section: "Timeline & GPA" }),
            textField("end_date", "End Date", { type: "date", section: "Timeline & GPA" }),
            textField("gpa", "GPA (Optional)", { placeholder: "e.g. 3.85 / 4.00", section: "Timeline & GPA" }),
            textField("description", "Academic Focus & Activities", {
                type: "textarea",
                placeholder: "Relevant coursework, thesis topic, research focus, or academic honors",
                section: "Academic Summary",
            }),
            textField("display_order", "Display Order", { type: "number", section: "Publication Settings" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox", defaultValue: true, section: "Publication Settings" }),
        ],
    },
    achievements: {
        label: "Achievements",
        singularLabel: "Achievement",
        table: "achievements",
        searchField: "title",
        orderField: "display_order",
        fields: [
            textField("title", "Achievement Title", {
                required: true,
                placeholder: "e.g. 1st Place Winner — Tech Innovation & Machine Learning Challenge",
                section: "Basic Information",
            }),
            selectField(
                "category",
                "Category",
                [
                    { value: "Technology Competition", label: "Technology Competition" },
                    { value: "University Contest", label: "University Contest" },
                    { value: "Academic Award", label: "Academic Award" },
                    { value: "National Finalist", label: "National Finalist" },
                    { value: "Organizational & Leadership", label: "Organizational & Leadership" },
                    { value: "Special Recognition", label: "Special Recognition" },
                    { value: "Other", label: "Other Achievement" },
                ],
                { required: true, section: "Basic Information" }
            ),
            textField("event_name", "Competition / Event Name", {
                placeholder: "e.g. Sumatera Tech Innovation Summit 2024",
                section: "Event & Recognition",
            }),
            textField("organizer", "Organizer", {
                placeholder: "e.g. Universitas Sriwijaya & Kemendikbudristek",
                section: "Event & Recognition",
            }),
            selectField(
                "level",
                "Achievement Level",
                [
                    { value: "International", label: "International" },
                    { value: "National", label: "National" },
                    { value: "Regional", label: "Regional" },
                    { value: "University", label: "University" },
                ],
                { required: true, section: "Event & Recognition" }
            ),
            selectField(
                "award",
                "Award / Position",
                [
                    { value: "1st Place", label: "1st Place (Winner)" },
                    { value: "2nd Place", label: "2nd Place (Runner-up)" },
                    { value: "3rd Place", label: "3rd Place" },
                    { value: "Finalist", label: "Finalist" },
                    { value: "Top 5", label: "Top 5" },
                    { value: "Honorable Mention", label: "Honorable Mention" },
                    { value: "Academic Award", label: "Academic Award" },
                    { value: "Best Innovation / Pitch", label: "Best Innovation / Pitch" },
                    { value: "Participant", label: "Participant" },
                ],
                { section: "Event & Recognition" }
            ),
            textField("date_achieved", "Date Achieved", { type: "date", section: "Event & Recognition" }),
            textField("short_description", "Short Description", {
                type: "textarea",
                required: true,
                placeholder: "Ringkasan 1-2 kalimat mengenai inovasi, solusi teknis, atau pencapaian yang diraih.",
                section: "Narrative & Context",
            }),
            textField("detailed_description", "Detailed Description (Optional)", {
                type: "textarea",
                placeholder: "Rincian teknis mendalam mengenai pendekatan arsitektural, algoritma, atau metrik evaluasi.",
                section: "Narrative & Context",
            }),
            textField("certificate_image_url", "Certificate Image / Document", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf",
                section: "Documentation & Proof",
            }),
            textField("evidence_image_url", "Evidence / Documentation Photo", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
                section: "Documentation & Proof",
            }),
            textField("credential_url", "External Verification URL", {
                type: "url",
                placeholder: "https://...",
                section: "Links",
            }),
            textField("project_url", "Related Project URL", {
                type: "url",
                placeholder: "/projects/above-ground-biomass-estimation",
                section: "Links",
            }),
            textField("display_order", "Display Order", { type: "number", section: "Publication Settings" }),
            textField("is_featured", "Featured Achievement", { type: "checkbox", section: "Publication Settings" }),
            textField("is_published", "Published (visible on website)", { type: "checkbox", defaultValue: true, section: "Publication Settings" }),
        ],
    },
    skills: {
        label: "Skills (Legacy)",
        singularLabel: "Skill",
        table: "skills",
        searchField: "name",
        orderField: "display_order",
        deprecated: true,
        fields: [
            textField("name", "Skill / Technology Name", { required: true, placeholder: "e.g. Python, Apache Airflow, TensorFlow" }),
            selectField(
                "category",
                "Category",
                [
                    { value: "Programming", label: "Programming" },
                    { value: "Data Science", label: "Data Science" },
                    { value: "Machine Learning", label: "Machine Learning" },
                    { value: "MLOps", label: "MLOps" },
                    { value: "Data Analytics", label: "Data Analytics" },
                    { value: "Tools & Infrastructure", label: "Tools & Infrastructure" },
                ],
                { required: true }
            ),
            selectField("proficiency", "Experience Context (Optional)", [
                { value: "", label: "None (Standard)" },
                { value: "Core Stack", label: "Core Stack" },
                { value: "Production & Pipelines", label: "Production & Pipelines" },
                { value: "Applied Modeling", label: "Applied Modeling" },
                { value: "Working Knowledge", label: "Working Knowledge" },
            ]),
            textField("icon", "Icon Identifier (Optional)", { placeholder: "e.g. python, database, cpu, workflow" }),
            textField("display_order", "Display Order", { type: "number" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox", defaultValue: true }),
        ],
    },
    profiles: {
        label: "Profile",
        singularLabel: "Profile",
        table: "profiles",
        searchField: "name",
        singleton: true,
        fields: [
            textField("name", "Full Name", { required: true, placeholder: "Kevin Adiputra Mahesa", section: "Personal Information" }),
            textField("professional_title", "Professional Title", {
                required: true,
                placeholder: "Machine Learning Engineer & Data Scientist",
                section: "Personal Information",
            }),
            textField("availability_status", "Work Availability Status", {
                placeholder: "Available for Data Science, ML & MLOps Roles",
                section: "Personal Information",
            }),
            textField("bio", "About Me", {
                type: "textarea",
                required: true,
                placeholder: "Professional summary and engineering philosophy",
                section: "About & Summary",
            }),
            textField("profile_photo_url", "Profile Photo", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp",
                section: "Media & Attachments",
            }),
            textField("cv_url", "CV / Resume (PDF or URL)", {
                type: "media",
                accept: "application/pdf",
                section: "Media & Attachments",
            }),
            textField("email", "Professional Email", { type: "email", placeholder: "kevinadiputra66@gmail.com", section: "Contact & Socials" }),
            textField("phone", "Phone / WhatsApp", { placeholder: "+62 821-8185-7340", section: "Contact & Socials" }),
            textField("location", "Location", { placeholder: "Palembang, Indonesia", section: "Contact & Socials" }),
            textField("github_url", "GitHub URL", { type: "url", placeholder: "https://github.com/Kevinadiputra", section: "Contact & Socials" }),
            textField("linkedin_url", "LinkedIn URL", {
                type: "url",
                placeholder: "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/",
                section: "Contact & Socials",
            }),
            textField("website_url", "Website URL", {
                type: "url",
                placeholder: "https://kevin-adiputra-portfolio.vercel.app",
                section: "Contact & Socials",
            }),
        ],
    },
    site_settings: {
        label: "Site Settings",
        singularLabel: "Site Settings",
        table: "site_settings",
        searchField: "site_name",
        singleton: true,
        fields: [
            textField("site_name", "Website Name", { required: true, placeholder: "Kevin Adiputra Portfolio", section: "Site Identity" }),
            textField("logo_url", "Logo Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
                section: "Site Identity",
            }),
            textField("favicon_url", "Favicon", {
                type: "media",
                accept: "image/png,image/svg+xml,image/webp",
                section: "Site Identity",
            }),
            textField("seo_title", "SEO Title", {
                placeholder: "Kevin Adiputra — Data Science, Machine Learning & MLOps Portfolio",
                section: "Search Engine Optimization (SEO)",
            }),
            textField("seo_description", "SEO Description", {
                type: "textarea",
                placeholder: "Portfolio of Kevin Adiputra, Computer Systems undergraduate specializing in Data Science, Machine Learning, and MLOps pipelines.",
                section: "Search Engine Optimization (SEO)",
            }),
            textField("og_image_url", "Open Graph Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp",
                section: "Search Engine Optimization (SEO)",
            }),
            textField("social_links", "Social Links (JSON)", {
                type: "json",
                placeholder: '{"github": "https://github.com/Kevinadiputra", "linkedin": "https://..."}',
                section: "Social & Footer",
            }),
            textField("footer_text", "Footer Text", {
                type: "textarea",
                placeholder: "Computer Systems undergraduate focused on practical Data Science, Machine Learning, and reliable MLOps pipelines.",
                section: "Social & Footer",
            }),
        ],
    },
};

export function getAdminCollection(collection) {
    return ADMIN_COLLECTIONS[collection] || null;
}

function asArray(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function asLines(value) {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value === "string") {
        return value
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return [];
}

function asJson(value, fallback) {
    if (value === "" || value === null || value === undefined) return fallback;
    if (typeof value === "object") return value;
    try {
        return JSON.parse(value);
    } catch {
        throw new Error("Format JSON tidak valid. Periksa kembali tanda kutip dan kurung.");
    }
}

export function normalizeAdminPayload(collection, input) {
    const config = getAdminCollection(collection);
    if (!config) throw new Error("Koleksi konten tidak dikenali.");

    const payload = {};
    for (const field of config.fields) {
        if (!(field.name in input)) continue;
        const value = input[field.name];
        if (field.type === "roles_repeater") {
            const rawRoles = Array.isArray(value) ? value : [];
            payload[field.name] = rawRoles
                .map((r, idx) => ({
                    id: r?.id || `role-${idx + 1}`,
                    position: typeof r?.position === "string" ? r.position.trim() : "",
                    start_date: r?.start_date || null,
                    end_date: r?.is_current ? null : (r?.end_date || null),
                    is_current: Boolean(r?.is_current),
                    period: r?.period || "",
                    description: typeof r?.description === "string" ? r.description.trim() : "",
                    responsibilities: Array.isArray(r?.responsibilities)
                        ? r.responsibilities.map((x) => String(x).trim()).filter(Boolean)
                        : (typeof r?.responsibilities === "string" ? r.responsibilities.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : []),
                    achievements: Array.isArray(r?.achievements)
                        ? r.achievements.map((x) => String(x).trim()).filter(Boolean)
                        : (typeof r?.achievements === "string" ? r.achievements.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) : []),
                    technologies: Array.isArray(r?.technologies)
                        ? r.technologies.map((x) => String(x).trim()).filter(Boolean)
                        : (typeof r?.technologies === "string" ? r.technologies.split(",").map((x) => x.trim()).filter(Boolean) : []),
                }))
                .filter((r) => Boolean(r.position));
        } else if (field.type === "gallery_repeater") {
            const rawGallery = Array.isArray(value) ? value : [];
            payload[field.name] = rawGallery
                .map((g) => ({
                    url: typeof g === "string" ? g.trim() : (g?.url || g?.media_url || "").trim(),
                    caption: typeof g?.caption === "string" ? g.caption.trim() : "",
                }))
                .filter((g) => Boolean(g.url));
        } else if (field.type === "links_repeater") {
            const rawLinks = Array.isArray(value) ? value : [];
            payload[field.name] = rawLinks
                .map((l) => ({
                    title: typeof l?.title === "string" ? l.title.trim() : "Link",
                    url: typeof l?.url === "string" ? l.url.trim() : "",
                }))
                .filter((l) => Boolean(l.url));
        } else if (field.type === "array") {
            payload[field.name] = asArray(value);
        } else if (field.type === "lines") {
            payload[field.name] = asLines(value);
        } else if (field.type === "json") {
            const fallback = field.name === "social_links" || field.name === "overview" ? null : [];
            payload[field.name] = asJson(value, fallback);
        } else if (field.type === "number") {
            payload[field.name] = value === "" || value === null || value === undefined ? 0 : Number(value);
        } else if (field.type === "checkbox") {
            payload[field.name] = value === true || value === "true" || value === "on";
        } else {
            const trimmed = typeof value === "string" ? value.trim() : value;
            if (trimmed === "" || trimmed === null || trimmed === undefined) {
                // Keep NOT NULL text columns with safe empty-string defaults
                const nonNullTextColumns = new Set([
                    "tagline",
                    "short_description",
                    "full_description",
                    "overview",
                    "challenge",
                    "solution",
                    "description",
                    "issuer",
                    "professional_title",
                    "bio",
                    "event_name",
                    "organizer",
                    "level",
                    "award",
                    "detailed_description",
                ]);
                payload[field.name] = nonNullTextColumns.has(field.name) ? "" : null;
            } else {
                payload[field.name] = trimmed;
            }
        }
    }

    if (collection === "projects") {
        if (!payload.slug && payload.title) {
            payload.slug = slugifyText(payload.title);
        } else if (payload.slug) {
            payload.slug = slugifyText(payload.slug);
        }
        if (payload.full_description && !payload.overview) {
            payload.overview = payload.full_description;
        } else if (payload.overview && !payload.full_description) {
            payload.full_description = payload.overview;
        }
    }

    if (collection === "experience") {
        if (!payload.slug && payload.organization) {
            payload.slug = slugifyText(payload.organization);
        } else if (payload.slug) {
            payload.slug = slugifyText(payload.slug);
        }
        if (payload.is_current) {
            payload.end_date = null;
        }
        if (!payload.position && Array.isArray(payload.roles) && payload.roles.length > 0) {
            payload.position = payload.roles[0].position;
        }
        // Sync legacy achievements & technologies arrays for backward compatibility
        if ((!payload.achievements || payload.achievements.length === 0) && Array.isArray(payload.roles)) {
            const allAchievements = [];
            const allTech = new Set();
            for (const r of payload.roles) {
                if (Array.isArray(r.responsibilities)) allAchievements.push(...r.responsibilities);
                if (Array.isArray(r.achievements)) allAchievements.push(...r.achievements);
                if (Array.isArray(r.technologies)) r.technologies.forEach((t) => allTech.add(t));
            }
            if (allAchievements.length > 0) payload.achievements = allAchievements;
            if (allTech.size > 0) payload.technologies = Array.from(allTech);
        }
    }

    if (collection === "profiles" || collection === "site_settings") {
        payload.id = true;
    }

    return payload;
}

export function validateAdminPayload(collection, payload) {
    const config = getAdminCollection(collection);
    if (!config) return "Koleksi konten tidak dikenali.";

    for (const field of config.fields) {
        if (!field.required) continue;
        const value = payload[field.name];
        if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
            return `${field.label} wajib diisi.`;
        }
    }

    if (collection === "projects") {
        if (!payload.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
            return "Slug harus menggunakan huruf kecil, angka, dan tanda hubung (contoh: mlops-pipeline-2026).";
        }
    }

    if (collection === "achievements") {
        if (!payload.title || payload.title.length < 3) {
            return "Judul prestasi (Achievement Title) minimal 3 karakter.";
        }
        if (!payload.short_description || payload.short_description.length < 5) {
            return "Deskripsi singkat prestasi minimal 5 karakter.";
        }
    }

    if (payload.start_date && payload.end_date && payload.end_date < payload.start_date) {
        return "Tanggal selesai (End Date) tidak boleh lebih awal dari tanggal mulai (Start Date).";
    }

    if (payload.issued_at && payload.expires_at && payload.expires_at < payload.issued_at) {
        return "Tanggal kedaluwarsa (Expiration Date) tidak boleh lebih awal dari tanggal terbit (Issue Date).";
    }

    const urlFields = ["github_url", "live_url", "credential_url", "linkedin_url", "website_url", "project_url"];
    for (const fieldName of urlFields) {
        const val = payload[fieldName];
        if (val && val !== "#" && !val.startsWith("/")) {
            try {
                const parsed = new URL(val);
                if (!["http:", "https:"].includes(parsed.protocol)) {
                    return `Field ${fieldName} harus menggunakan URL http:// atau https:// yang valid.`;
                }
            } catch {
                return `Format URL pada ${fieldName} tidak valid.`;
            }
        }
    }

    if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        return "Format alamat email tidak valid.";
    }

    if (payload.is_current) {
        payload.end_date = null;
    }

    return null;
}
