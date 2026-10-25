const arrayField = (name, label) => ({ name, label, type: "array" });
const textField = (name, label, options = {}) => ({ name, label, type: "text", ...options });

export const ADMIN_COLLECTIONS = {
    projects: {
        label: "Projects",
        table: "projects",
        searchField: "title",
        orderField: "display_order",
        fields: [
            textField("title", "Title", { required: true }),
            textField("slug", "Slug", { required: true }),
            textField("tagline", "Tagline"),
            textField("short_description", "Short description", { type: "textarea" }),
            textField("full_description", "Full description", { type: "textarea" }),
            textField("category", "Category", { required: true }),
            arrayField("technologies", "Technologies"),
            textField("thumbnail_url", "Thumbnail", { type: "media", accept: "image/*" }),
            arrayField("gallery_urls", "Gallery images"),
            textField("github_url", "GitHub URL", { type: "url" }),
            textField("live_url", "Live URL", { type: "url" }),
            textField("project_role", "Project role"),
            textField("start_date", "Start date", { type: "date" }),
            textField("end_date", "End date", { type: "date" }),
            textField("overview", "Overview", { type: "textarea" }),
            textField("challenge", "Challenge", { type: "textarea" }),
            textField("solution", "Solution", { type: "textarea" }),
            textField("metrics", "Metrics JSON", { type: "json" }),
            textField("process", "Process JSON", { type: "json" }),
            arrayField("learnings", "Learnings"),
            textField("display_order", "Display order", { type: "number" }),
            textField("is_featured", "Featured", { type: "checkbox" }),
            textField("is_published", "Published", { type: "checkbox" }),
        ],
    },
    certificates: {
        label: "Certificates",
        table: "certificates",
        searchField: "title",
        orderField: "display_order",
        fields: [
            textField("title", "Certificate name", { required: true }),
            textField("issuer", "Issuing organization", { required: true }),
            textField("platform", "Platform"),
            textField("issued_at", "Issue date", { type: "date" }),
            textField("expires_at", "Expiration date", { type: "date" }),
            textField("credential_id", "Credential ID"),
            textField("credential_url", "Credential URL", { type: "url" }),
            textField("image_url", "Certificate image", { type: "media", accept: "image/*" }),
            textField("description", "Description", { type: "textarea" }),
            arrayField("skills", "Skills"),
            textField("category", "Category"),
            textField("level", "Level"),
            textField("duration", "Duration"),
            textField("overview", "Overview JSON", { type: "json" }),
            textField("display_order", "Display order", { type: "number" }),
            textField("featured", "Featured", { type: "checkbox" }),
            textField("is_published", "Published", { type: "checkbox" }),
        ],
    },
    experience: {
        label: "Experience",
        table: "experience",
        searchField: "position",
        orderField: "display_order",
        fields: [
            textField("position", "Position", { required: true }),
            textField("organization", "Organization", { required: true }),
            textField("employment_type", "Employment type"),
            textField("start_date", "Start date", { type: "date" }),
            textField("end_date", "End date", { type: "date" }),
            textField("is_current", "Current", { type: "checkbox" }),
            textField("description", "Description", { type: "textarea" }),
            arrayField("achievements", "Achievements"),
            arrayField("technologies", "Technologies"),
            textField("logo_url", "Organization logo", { type: "media", accept: "image/*" }),
            textField("display_order", "Display order", { type: "number" }),
            textField("is_published", "Published", { type: "checkbox" }),
        ],
    },
    education: {
        label: "Education",
        table: "education",
        searchField: "institution",
        orderField: "display_order",
        fields: [
            textField("institution", "Institution", { required: true }),
            textField("degree", "Degree", { required: true }),
            textField("field_of_study", "Field of study"),
            textField("start_date", "Start date", { type: "date" }),
            textField("end_date", "End date", { type: "date" }),
            textField("description", "Description", { type: "textarea" }),
            textField("display_order", "Display order", { type: "number" }),
            textField("is_published", "Published", { type: "checkbox" }),
        ],
    },
    skills: {
        label: "Skills",
        table: "skills",
        searchField: "name",
        orderField: "display_order",
        fields: [
            textField("name", "Skill name", { required: true }),
            textField("category", "Category", { required: true }),
            textField("icon", "Icon name"),
            textField("display_order", "Display order", { type: "number" }),
            textField("is_published", "Published", { type: "checkbox" }),
        ],
    },
    profiles: {
        label: "Profile",
        table: "profiles",
        searchField: "name",
        singleton: true,
        fields: [
            textField("name", "Full name", { required: true }),
            textField("professional_title", "Professional title"),
            textField("bio", "About me", { type: "textarea" }),
            textField("profile_photo_url", "Profile photo", { type: "media", accept: "image/*" }),
            textField("cv_url", "CV / Resume", { type: "media", accept: ".pdf,.doc,.docx" }),
            textField("email", "Professional email", { type: "email" }),
            textField("phone", "Phone"),
            textField("location", "Location"),
            textField("github_url", "GitHub URL", { type: "url" }),
            textField("linkedin_url", "LinkedIn URL", { type: "url" }),
            textField("availability_status", "Availability status"),
        ],
    },
    site_settings: {
        label: "Site settings",
        table: "site_settings",
        searchField: "site_name",
        singleton: true,
        fields: [
            textField("site_name", "Site name", { required: true }),
            textField("logo_url", "Logo", { type: "media", accept: "image/*" }),
            textField("favicon_url", "Favicon", { type: "media", accept: "image/*" }),
            textField("seo_title", "SEO title"),
            textField("seo_description", "SEO description", { type: "textarea" }),
            textField("og_image_url", "Open Graph image", { type: "media", accept: "image/*" }),
            textField("social_links", "Social links JSON", { type: "json" }),
            textField("footer_text", "Footer text", { type: "textarea" }),
        ],
    },
};

export function getAdminCollection(collection) {
    return ADMIN_COLLECTIONS[collection] || null;
}

function asArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
    return [];
}

function asJson(value, fallback) {
    if (value === "" || value === null || value === undefined) return fallback;
    if (typeof value === "object") return value;
    try {
        return JSON.parse(value);
    } catch {
        throw new Error("JSON field is invalid.");
    }
}

export function normalizeAdminPayload(collection, input) {
    const config = getAdminCollection(collection);
    if (!config) throw new Error("Unknown content collection.");

    const payload = {};
    for (const field of config.fields) {
        if (!(field.name in input)) continue;
        const value = input[field.name];
        if (field.type === "array") payload[field.name] = asArray(value);
        else if (field.type === "json") payload[field.name] = asJson(value, field.name === "social_links" ? {} : []);
        else if (field.type === "number") payload[field.name] = value === "" ? 0 : Number(value);
        else if (field.type === "checkbox") payload[field.name] = value === true || value === "true" || value === "on";
        else payload[field.name] = value === "" ? null : value;
    }

    if (collection === "profiles" || collection === "site_settings") payload.id = true;
    return payload;
}

export function validateAdminPayload(collection, payload) {
    const config = getAdminCollection(collection);
    if (!config) return "Unknown content collection.";

    for (const field of config.fields) {
        if (!field.required) continue;
        const value = payload[field.name];
        if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
            return `${field.label} is required.`;
        }
    }

    if (collection === "projects" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug)) {
        return "Slug must use lowercase letters, numbers, and hyphens.";
    }

    if (payload.start_date && payload.end_date && payload.end_date < payload.start_date) {
        return "End date cannot be before start date.";
    }

    if (payload.is_current) payload.end_date = null;
    return null;
}
