"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    ArrowLeft,
    Check,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Eye,
    Github,
    Sparkles,
    Wand2,
    X,
} from "lucide-react";
import ProjectMediaManager from "./ProjectMediaManager";
import ProjectTechnologiesInput from "./ProjectTechnologiesInput";
import {
    KeyLearningsRepeater,
    MetricsRepeater,
    ProcessRepeater,
} from "./ProjectRepeaters";
import ProjectPreviewModal from "./ProjectPreviewModal";
import { slugifyText } from "@/lib/admin-content";

const CATEGORY_OPTIONS = [
    { value: "data-science", label: "Data Science" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "deep-learning", label: "Deep Learning" },
    { value: "nlp", label: "Natural Language Processing" },
    { value: "data-engineering", label: "Data Engineering" },
    { value: "mlops", label: "MLOps" },
];

export default function ProjectEditorDrawer({
    initialRecord = {},
    selectedId = null,
    onClose,
    onSave,
    isSaving = false,
    showToast,
}) {
    // Form state
    const [formData, setFormData] = useState(() => ({
        title: "",
        slug: "",
        category: "data-science",
        project_role: "",
        tagline: "",
        short_description: "",
        full_description: "",
        challenge: "",
        solution: "",
        technologies: [],
        thumbnail_url: "",
        gallery_urls: [],
        github_url: "",
        live_url: "",
        start_date: "",
        end_date: "",
        metrics: [],
        process: [],
        learnings: [],
        display_order: 0,
        is_featured: false,
        show_on_homepage: true,
        is_published: true,
        ...initialRecord,
    }));

    const [slugManuallyEdited, setSlugManuallyEdited] = useState(() =>
        Boolean(initialRecord?.slug)
    );
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [confirmCloseDialog, setConfirmCloseDialog] = useState(false);

    // Auto-generate slug when title changes (if slug not manually customized)
    function handleTitleChange(val) {
        setFormData((prev) => {
            const next = { ...prev, title: val };
            if (!slugManuallyEdited) {
                next.slug = slugifyText(val);
            }
            return next;
        });
        setIsDirty(true);
    }

    function updateField(key, val) {
        setFormData((prev) => ({ ...prev, [key]: val }));
        setIsDirty(true);
    }

    // Media Manager update handler
    function handleMediaChange({ thumbnail_url, gallery_urls }) {
        setFormData((prev) => ({
            ...prev,
            thumbnail_url,
            gallery_urls,
        }));
        setIsDirty(true);
    }

    function handleClose() {
        if (isDirty) {
            setConfirmCloseDialog(true);
            return;
        }
        onClose();
    }

    async function handleFormSubmit(e, forcePublish = null) {
        if (e) e.preventDefault();
        if (isSaving) return;

        if (!formData.title?.trim()) {
            showToast?.("error", "Judul proyek (Project Title) wajib diisi.");
            return;
        }

        if (!formData.short_description?.trim()) {
            showToast?.("error", "Deskripsi singkat (Short Description) wajib diisi.");
            return;
        }

        const finalPayload = { ...formData };
        if (forcePublish !== null) {
            finalPayload.is_published = forcePublish;
        }

        if (!finalPayload.slug) {
            finalPayload.slug = slugifyText(finalPayload.title);
        }

        await onSave(finalPayload);
        setIsDirty(false);
    }

    return (
        <>
            <div className="admin-drawer-backdrop" onClick={handleClose}>
                <div
                    className="admin-drawer-panel"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="drawer-title"
                >
                    {/* Drawer Header */}
                    <div className="admin-drawer-header">
                        <div className="min-w-0 flex-1">
                            <div className="admin-eyebrow">
                                {selectedId ? "EDIT PROJECT" : "NEW PROJECT"} / CASE STUDY CMS
                            </div>
                            <h2 id="drawer-title" className="admin-drawer-title truncate">
                                {formData.title || (selectedId ? "Edit Project" : "Add New Project")}
                            </h2>
                            {formData.slug && (
                                <p className="text-[11px] font-mono text-white/50 truncate max-w-full mt-0.5">
                                    Slug: <span className="text-accent">/projects/{formData.slug}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsPreviewOpen(true)}
                                className="admin-secondary-action py-1.5 px-3 text-xs flex items-center gap-1.5"
                                title="Lihat preview tampilan publik"
                            >
                                <Eye size={13} />
                                <span className="hidden sm:inline">Preview</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="admin-icon-btn h-8 w-8"
                                aria-label="Close editor"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Drawer Scrollable Body */}
                    <form
                        onSubmit={(e) => handleFormSubmit(e)}
                        className="admin-drawer-body"
                    >
                        {/* =======================================================
                            SECTION B: MEDIA & SCREENSHOTS (PRIORITAS UTAMA)
                           ======================================================= */}
                        <section className="admin-drawer-section">
                            <div className="admin-section-legend">
                                <span className="text-accent font-bold">
                                    01. Media &amp; Screenshots
                                </span>
                                <span className="text-[10px] text-white/45 ml-auto normal-case font-normal font-mono">
                                    Unggah langsung · Tanpa ketik URL manual
                                </span>
                            </div>

                            <ProjectMediaManager
                                thumbnailUrl={formData.thumbnail_url}
                                galleryUrls={formData.gallery_urls}
                                onChange={handleMediaChange}
                                showToast={showToast}
                            />
                        </section>

                        {/* =======================================================
                            SECTION A: INFORMASI DASAR PROJECT
                           ======================================================= */}
                        <section className="admin-drawer-section">
                            <div className="admin-section-legend">
                                <span>02. Informasi Project</span>
                            </div>

                            <div className="admin-form-grid">
                                {/* Title */}
                                <div className="admin-field-wrap is-full">
                                    <label className="admin-label">
                                        Project Title <span className="text-accent">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="e.g. End-to-End Machine Learning Operations Pipeline"
                                        className="admin-input"
                                        required
                                    />
                                </div>

                                {/* Slug */}
                                <div className="admin-field-wrap">
                                    <label className="admin-label flex items-center justify-between">
                                        <span>URL Slug</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField("slug", slugifyText(formData.title));
                                                setSlugManuallyEdited(false);
                                            }}
                                            className="text-[10px] text-accent font-mono hover:underline inline-flex items-center gap-1"
                                        >
                                            <Wand2 size={10} /> Auto-generate
                                        </button>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => {
                                            setSlugManuallyEdited(true);
                                            updateField("slug", slugifyText(e.target.value));
                                        }}
                                        placeholder="auto-generated-from-title"
                                        className="admin-input font-mono text-xs"
                                    />
                                </div>

                                {/* Category */}
                                <div className="admin-field-wrap">
                                    <label className="admin-label">
                                        Category <span className="text-accent">*</span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => updateField("category", e.target.value)}
                                        className="admin-input"
                                        required
                                    >
                                        {CATEGORY_OPTIONS.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Project Role */}
                                <div className="admin-field-wrap">
                                    <label className="admin-label">Headline Role / Position</label>
                                    <input
                                        type="text"
                                        value={formData.project_role || ""}
                                        onChange={(e) => updateField("project_role", e.target.value)}
                                        placeholder="e.g. Lead ML Engineer / Data Scientist"
                                        className="admin-input text-xs"
                                    />
                                </div>

                                {/* Tagline */}
                                <div className="admin-field-wrap">
                                    <label className="admin-label">Tagline / Subtitle</label>
                                    <input
                                        type="text"
                                        value={formData.tagline || ""}
                                        onChange={(e) => updateField("tagline", e.target.value)}
                                        placeholder="One-line summary of project objective"
                                        className="admin-input text-xs"
                                    />
                                </div>

                                {/* Short Description */}
                                <div className="admin-field-wrap is-full">
                                    <label className="admin-label">
                                        Short Description (Ringkasan Card) <span className="text-accent">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.short_description || ""}
                                        onChange={(e) => updateField("short_description", e.target.value)}
                                        placeholder="Ringkasan 2-3 kalimat yang ditampilkan di halaman utama dan kartu proyek..."
                                        className="admin-input admin-textarea text-xs"
                                        required
                                    />
                                </div>

                                {/* Full Description / Overview */}
                                <div className="admin-field-wrap is-full">
                                    <label className="admin-label">
                                        Full Description / Architectural Overview
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={formData.full_description || ""}
                                        onChange={(e) => updateField("full_description", e.target.value)}
                                        placeholder="Penjelasan mendalam mengenai arsitektur sistem, pemrosesan data, validasi model, dan hasil evaluasi..."
                                        className="admin-input admin-textarea text-xs"
                                    />
                                </div>

                                {/* Technologies Tags (Interactive Chip Input) */}
                                <div className="admin-field-wrap is-full">
                                    <label className="admin-label">
                                        Technologies &amp; Tools (Input Tag / Chip)
                                    </label>
                                    <ProjectTechnologiesInput
                                        technologies={formData.technologies}
                                        onChange={(tags) => updateField("technologies", tags)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* =======================================================
                            SECTION C: INFORMASI TAMBAHAN (OPSIONAL / ACCORDION)
                           ======================================================= */}
                        <section className="admin-drawer-section">
                            <button
                                type="button"
                                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                                className="w-full flex items-center justify-between text-left py-1 text-white hover:text-accent transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-accent group-hover:text-accent">
                                        03. Informasi Tambahan (Opsional)
                                    </span>
                                    <span className="text-[10px] font-mono text-white/40">
                                        Links, Metrics, Process &amp; Learnings
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-mono text-white/50 group-hover:text-accent">
                                    <span>{isAdvancedOpen ? "Sembunyikan" : "Tampilkan"}</span>
                                    {isAdvancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </div>
                            </button>

                            {isAdvancedOpen && (
                                <div className="mt-4 pt-4 border-t border-white/10 space-y-6">
                                    {/* External Links */}
                                    <div className="space-y-3">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            External Links &amp; Repositories
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="admin-label text-[10px] flex items-center gap-1">
                                                    <Github size={11} /> GitHub Repository URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.github_url || ""}
                                                    onChange={(e) => updateField("github_url", e.target.value)}
                                                    placeholder="https://github.com/username/project"
                                                    className="admin-input text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="admin-label text-[10px] flex items-center gap-1">
                                                    <ExternalLink size={11} /> Live Demo / Notebook URL
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.live_url || ""}
                                                    onChange={(e) => updateField("live_url", e.target.value)}
                                                    placeholder="https://..."
                                                    className="admin-input text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Project Timeline */}
                                    <div className="space-y-3">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            Timeline Project
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="admin-label text-[10px]">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.start_date || ""}
                                                    onChange={(e) => updateField("start_date", e.target.value)}
                                                    className="admin-input text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="admin-label text-[10px]">End Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.end_date || ""}
                                                    onChange={(e) => updateField("end_date", e.target.value)}
                                                    className="admin-input text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Problem & Solution */}
                                    <div className="space-y-3">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            Problem &amp; Technical Approach
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="admin-label text-[10px]">
                                                    Problem / Technical Challenge
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={formData.challenge || ""}
                                                    onChange={(e) => updateField("challenge", e.target.value)}
                                                    placeholder="Permasalahan teknis atau bisnis yang dipecahkan oleh project ini..."
                                                    className="admin-input admin-textarea text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="admin-label text-[10px]">
                                                    Approach / Technical Solution
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={formData.solution || ""}
                                                    onChange={(e) => updateField("solution", e.target.value)}
                                                    placeholder="Metodologi, rancangan arsitektur, dan implementasi yang diterapkan..."
                                                    className="admin-input admin-textarea text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Learnings */}
                                    <div className="space-y-2">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            Key Engineering Learnings
                                        </h4>
                                        <KeyLearningsRepeater
                                            learnings={formData.learnings}
                                            onChange={(val) => updateField("learnings", val)}
                                        />
                                    </div>

                                    {/* Verifiable Metrics */}
                                    <div className="space-y-2">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            Verifiable Metrics &amp; Benchmarks
                                        </h4>
                                        <MetricsRepeater
                                            metrics={formData.metrics}
                                            onChange={(val) => updateField("metrics", val)}
                                        />
                                    </div>

                                    {/* Engineering Process Steps */}
                                    <div className="space-y-2">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            Engineering Process Steps
                                        </h4>
                                        <ProcessRepeater
                                            process={formData.process}
                                            onChange={(val) => updateField("process", val)}
                                        />
                                    </div>

                                    {/* Visibility & Settings */}
                                    <div className="space-y-3 pt-3 border-t border-white/10">
                                        <h4 className="font-mono text-xs font-semibold text-white/80 uppercase tracking-wider">
                                            Settings &amp; Order
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                                            <div>
                                                <label className="admin-label text-[10px]">Display Order</label>
                                                <input
                                                    type="number"
                                                    value={formData.display_order ?? 0}
                                                    onChange={(e) =>
                                                        updateField("display_order", Number(e.target.value))
                                                    }
                                                    className="admin-input text-xs"
                                                />
                                            </div>
                                            <div className="pt-4">
                                                <label className="admin-checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(formData.is_featured)}
                                                        onChange={(e) =>
                                                            updateField("is_featured", e.target.checked)
                                                        }
                                                        className="admin-checkbox"
                                                    />
                                                    <span>Featured Case Study</span>
                                                </label>
                                            </div>
                                            <div className="pt-4">
                                                <label className="admin-checkbox-label">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(formData.show_on_homepage)}
                                                        onChange={(e) =>
                                                            updateField("show_on_homepage", e.target.checked)
                                                        }
                                                        className="admin-checkbox"
                                                    />
                                                    <span>Show on Homepage</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </form>

                    {/* Drawer Footer Actions */}
                    <div className="admin-drawer-footer">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="admin-secondary-action"
                        >
                            Cancel
                        </button>

                        <div className="flex items-center gap-2.5 ml-auto flex-wrap sm:flex-nowrap">
                            <button
                                type="button"
                                onClick={() => setIsPreviewOpen(true)}
                                className="admin-secondary-action text-xs flex items-center gap-1.5"
                            >
                                <Eye size={13} />
                                <span>Preview</span>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleFormSubmit(e, false)}
                                disabled={isSaving}
                                className="admin-secondary-action text-amber-300 border-amber-500/30 hover:border-amber-400"
                            >
                                {isSaving ? "Saving…" : "Save as Draft"}
                            </button>
                            <button
                                type="button"
                                onClick={(e) => handleFormSubmit(e, true)}
                                disabled={isSaving}
                                className="admin-primary-action"
                            >
                                <Check size={14} />
                                <span>
                                    {isSaving ? "Saving…" : selectedId ? "Save Changes" : "Publish Project"}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Preview Modal */}
            {isPreviewOpen && (
                <ProjectPreviewModal
                    project={formData}
                    onClose={() => setIsPreviewOpen(false)}
                />
            )}

            {/* Unsaved Changes Confirmation Modal */}
            {confirmCloseDialog && (
                <div className="admin-modal-backdrop" onClick={() => setConfirmCloseDialog(false)}>
                    <div
                        className="admin-confirm-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 border border-amber-500/40 bg-amber-500/10 text-amber-400">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-white text-base">
                                    Perubahan Belum Disimpan
                                </h3>
                                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                                    Anda memiliki input data proyek yang belum disimpan. Yakin ingin menutup editor tanpa menyimpan?
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-white/10">
                            <button
                                type="button"
                                onClick={() => setConfirmCloseDialog(false)}
                                className="admin-secondary-action"
                            >
                                Lanjut Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setConfirmCloseDialog(false);
                                    setIsDirty(false);
                                    onClose();
                                }}
                                className="admin-primary-action bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                            >
                                Buang Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
