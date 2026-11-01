const arrayField = (name, label, options = {}) => ({ name, label, type: "array", ...options });
const linesField = (name, label, options = {}) => ({ name, label, type: "lines", ...options });
const textField = (name, label, options = {}) => ({ name, label, type: "text", ...options });
const selectField = (name, label, choices, options = {}) => ({ name, label, type: "select", choices, ...options });

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
            textField("title", "Title", { required: true, placeholder: "e.g. End-to-End Machine Learning Operations Pipeline" }),
            textField("slug", "Slug", { required: true, placeholder: "auto-generated-from-title" }),
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
                { required: true }
            ),
            textField("project_role", "Project Role", { placeholder: "e.g. ML Engineer / Data Scientist" }),
            textField("tagline", "Tagline / Subtitle", { placeholder: "One-line summary of the project objective" }),
            textField("short_description", "Short Description", {
                type: "textarea",
                required: true,
                placeholder: "Concise summary shown on project cards (2-3 sentences)",
            }),
            textField("full_description", "Full Description / Overview", {
                type: "textarea",
                placeholder: "Detailed technical context and scope of the project",
            }),
            textField("challenge", "Problem / Challenge", {
                type: "textarea",
                placeholder: "What technical or business problem did this project solve?",
            }),
            textField("solution", "Approach / Solution", {
                type: "textarea",
                placeholder: "How was the model, pipeline, or analysis architected and validated?",
            }),
            arrayField("technologies", "Technologies (comma-separated)", {
                placeholder: "Python, Scikit-Learn, MLflow, Docker, FastAPI",
            }),
            textField("thumbnail_url", "Thumbnail Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
            }),
            linesField("gallery_urls", "Gallery / Screenshot URLs (one URL per line)", {
                placeholder: "/projects/screenshot-1.png\n/projects/screenshot-2.png",
            }),
            textField("github_url", "GitHub Repository URL", {
                type: "url",
                placeholder: "https://github.com/username/repository",
            }),
            textField("live_url", "Live Demo / Notebook URL", {
                type: "url",
                placeholder: "https://...",
            }),
            textField("start_date", "Start Date", { type: "date" }),
            textField("end_date", "End Date", { type: "date" }),
            textField("metrics", "Verifiable Metrics (JSON)", {
                type: "json",
                placeholder: '[{"label": "Accuracy", "value": "97.0%", "description": "Validation split"}]',
            }),
            textField("process", "Engineering Process Steps (JSON)", {
                type: "json",
                placeholder: '[{"phase": "Data Preprocessing", "description": "..."}]',
            }),
            linesField("learnings", "Key Learnings (one item per line)", {
                placeholder: "Decoupling preprocessing from inference prevents training-serving skew.",
            }),
            textField("display_order", "Display Order", { type: "number" }),
            textField("is_featured", "Featured Case Study", { type: "checkbox" }),
            textField("show_on_homepage", "Show on Homepage", { type: "checkbox", defaultValue: true }),
            textField("is_published", "Published (visible to public)", { type: "checkbox" }),
        ],
    },
    certificates: {
        label: "Certificates",
        singularLabel: "Certificate",
        table: "certificates",
        searchField: "title",
        orderField: "display_order",
        fields: [
            textField("title", "Certificate Name", { required: true, placeholder: "e.g. Membangun Sistem Machine Learning" }),
            textField("issuer", "Issuing Organization", { required: true, placeholder: "e.g. Dicoding Indonesia / Astronomer" }),
            textField("platform", "Platform", { placeholder: "e.g. Dicoding / Credly" }),
            textField("issued_at", "Issue Date", { type: "date" }),
            textField("expires_at", "Expiration Date", { type: "date" }),
            textField("credential_id", "Credential ID", { placeholder: "e.g. 98XW07580XM3" }),
            textField("credential_url", "Credential Verification URL", { type: "url", placeholder: "https://..." }),
            textField("image_url", "Certificate Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml,application/pdf",
            }),
            textField("category", "Category", { placeholder: "e.g. Machine Learning, MLOps & Infrastructure, Data Engineering" }),
            textField("level", "Level", { placeholder: "e.g. Beginner, Intermediate, Advanced, Professional" }),
            textField("duration", "Duration", { placeholder: "e.g. 1 month" }),
            textField("description", "Description", {
                type: "textarea",
                placeholder: "Competencies and technical scope validated by this credential",
            }),
            arrayField("skills", "Validated Skills (comma-separated)", {
                placeholder: "Machine Learning, MLflow, Model Deployment",
            }),
            textField("overview", "Extended Overview (JSON, optional)", { type: "json" }),
            textField("display_order", "Display Order", { type: "number" }),
            textField("featured", "Featured Credential", { type: "checkbox" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox" }),
        ],
    },
    experience: {
        label: "Experience",
        singularLabel: "Experience",
        table: "experience",
        searchField: "position",
        orderField: "display_order",
        fields: [
            textField("position", "Position / Role", { required: true, placeholder: "e.g. IT Intern (Data & ML Focus)" }),
            textField("organization", "Organization / Company", { required: true, placeholder: "e.g. PT Pupuk Sriwidjaja Palembang" }),
            selectField("employment_type", "Employment Type", [
                { value: "", label: "Select type..." },
                { value: "Internship", label: "Internship" },
                { value: "Leadership & Community", label: "Leadership & Community" },
                { value: "Organization", label: "Organization" },
                { value: "Full-time", label: "Full-time" },
                { value: "Part-time", label: "Part-time" },
                { value: "Contract", label: "Contract" },
                { value: "Research", label: "Research" },
            ]),
            textField("location", "Location", { placeholder: "e.g. Palembang, Indonesia" }),
            textField("start_date", "Start Date", { type: "date" }),
            textField("end_date", "End Date", { type: "date", disableWhenCurrent: true }),
            textField("is_current", "Currently active here (Is Current)", { type: "checkbox" }),
            textField("description", "Role Summary", {
                type: "textarea",
                placeholder: "Brief overview of responsibilities and scope",
            }),
            linesField("achievements", "Key Achievements / Responsibilities (one bullet point per line)", {
                placeholder: "Conducted Exploratory Data Analysis (EDA) on operational data\nBuilt and evaluated predictive machine learning models for carbon stock estimation",
            }),
            arrayField("technologies", "Technologies & Skills (comma-separated)", {
                placeholder: "Python, Pandas, Scikit-Learn, XGBoost",
            }),
            textField("logo_url", "Organization Logo", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
            }),
            textField("display_order", "Display Order", { type: "number" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox" }),
        ],
    },
    education: {
        label: "Education",
        singularLabel: "Education",
        table: "education",
        searchField: "institution",
        orderField: "display_order",
        fields: [
            textField("institution", "Institution", { required: true, placeholder: "e.g. Universitas Sriwijaya" }),
            textField("degree", "Degree", { required: true, placeholder: "e.g. Bachelor of Computer Systems (S.Kom.)" }),
            textField("field_of_study", "Field of Study", { placeholder: "e.g. Computer Systems / Data Science & ML" }),
            textField("location", "Location", { placeholder: "e.g. Palembang, Indonesia" }),
            textField("start_date", "Start Date", { type: "date" }),
            textField("end_date", "End Date", { type: "date" }),
            textField("description", "Academic Focus & Activities", {
                type: "textarea",
                placeholder: "Relevant coursework, thesis topic, research focus, or academic honors",
            }),
            textField("display_order", "Display Order", { type: "number" }),
            textField("is_published", "Published (visible to public)", { type: "checkbox" }),
        ],
    },
    skills: {
        label: "Skills",
        singularLabel: "Skill",
        table: "skills",
        searchField: "name",
        orderField: "display_order",
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
            textField("name", "Full Name", { required: true, placeholder: "Kevin Adiputra Mahesa" }),
            textField("professional_title", "Professional Title", {
                required: true,
                placeholder: "Machine Learning Engineer & Data Scientist",
            }),
            textField("availability_status", "Work Availability Status", {
                placeholder: "Available for Data Science, ML & MLOps Roles",
            }),
            textField("bio", "About Me", {
                type: "textarea",
                required: true,
                placeholder: "Professional summary and engineering philosophy",
            }),
            textField("profile_photo_url", "Profile Photo", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp",
            }),
            textField("cv_url", "CV / Resume (PDF or URL)", {
                type: "media",
                accept: "application/pdf",
            }),
            textField("email", "Professional Email", { type: "email", placeholder: "kevinadiputra66@gmail.com" }),
            textField("phone", "Phone / WhatsApp", { placeholder: "+62 821-8185-7340" }),
            textField("location", "Location", { placeholder: "Palembang, Indonesia" }),
            textField("github_url", "GitHub URL", { type: "url", placeholder: "https://github.com/Kevinadiputra" }),
            textField("linkedin_url", "LinkedIn URL", {
                type: "url",
                placeholder: "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/",
            }),
            textField("website_url", "Website URL", {
                type: "url",
                placeholder: "https://kevin-adiputra-portfolio.vercel.app",
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
            textField("site_name", "Website Name", { required: true, placeholder: "Kevin Adiputra Portfolio" }),
            textField("seo_title", "SEO Title", {
                placeholder: "Kevin Adiputra — Data Science, Machine Learning & MLOps Portfolio",
            }),
            textField("seo_description", "SEO Description", {
                type: "textarea",
                placeholder: "Portfolio of Kevin Adiputra, Computer Systems undergraduate specializing in Data Science, Machine Learning, and MLOps pipelines.",
            }),
            textField("logo_url", "Logo Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp,image/svg+xml",
            }),
            textField("favicon_url", "Favicon", {
                type: "media",
                accept: "image/png,image/svg+xml,image/webp",
            }),
            textField("og_image_url", "Open Graph Image", {
                type: "media",
                accept: "image/jpeg,image/png,image/webp",
            }),
            textField("social_links", "Social Links (JSON)", {
                type: "json",
                placeholder: '{"github": "https://github.com/Kevinadiputra", "linkedin": "https://..."}',
            }),
            textField("footer_text", "Footer Text", {
                type: "textarea",
                placeholder: "Computer Systems undergraduate focused on practical Data Science, Machine Learning, and reliable MLOps pipelines.",
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
        if (field.type === "array") {
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
                // Keep NOT NULL text columns with safe empty-string defaults when appropriate
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
        // Keep overview synced with full_description if overview is empty
        if (payload.full_description && !payload.overview) {
            payload.overview = payload.full_description;
        } else if (payload.overview && !payload.full_description) {
            payload.full_description = payload.overview;
        }
    }

    if (collection === "experience" && payload.is_current) {
        payload.end_date = null;
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

    if (payload.start_date && payload.end_date && payload.end_date < payload.start_date) {
        return "Tanggal selesai (End Date) tidak boleh lebih awal dari tanggal mulai (Start Date).";
    }

    if (payload.issued_at && payload.expires_at && payload.expires_at < payload.issued_at) {
        return "Tanggal kedaluwarsa (Expiration Date) tidak boleh lebih awal dari tanggal terbit (Issue Date).";
    }

    const urlFields = ["github_url", "live_url", "credential_url", "linkedin_url", "website_url"];
    for (const fieldName of urlFields) {
        const val = payload[fieldName];
        if (val && val !== "#") {
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
