"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    CheckCircle2,
    AlertCircle,
    Eye,
    Trash2,
    Plus,
    RefreshCw,
    Wand2,
    ChevronLeft,
    ChevronRight,
    X,
    Upload,
    ExternalLink,
    Search,
    Edit3,
    Check,
    Calendar,
    Globe,
    Layers,
    Tag,
    Clock,
    SlidersHorizontal,
    FileText,
    Image as ImageIcon,
} from "lucide-react";
import { getAdminCollection, slugifyText } from "@/lib/admin-content";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function emptyValue(field) {
    if (field.type === "array" || field.type === "lines") return [];
    if (field.type === "checkbox") return Boolean(field.defaultValue);
    if (field.type === "number") return 0;
    if (field.type === "json") {
        if (field.name === "social_links") return "{}";
        if (field.name === "overview") return "";
        return "[]";
    }
    if (field.type === "select") return field.choices?.[0]?.value ?? "";
    return "";
}

function blankRecord(config) {
    if (!config) return {};
    return Object.fromEntries(config.fields.map((field) => [field.name, emptyValue(field)]));
}

function formatValue(field, value) {
    if (field.type === "array") {
        return Array.isArray(value) ? value.join(", ") : value || "";
    }
    if (field.type === "lines") {
        return Array.isArray(value) ? value.join("\n") : value || "";
    }
    if (field.type === "json") {
        if (value === null || value === undefined || value === "") return "";
        if (typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value);
    }
    return value ?? "";
}

function parseValue(field, value) {
    if (field.type === "array") {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    }
    if (field.type === "lines") {
        return value
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
    }
    return value;
}

export default function AdminCollectionPage({ collection, title, eyebrow, description }) {
    const config = getAdminCollection(collection);
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState(() => blankRecord(config));
    const [selectedId, setSelectedId] = useState(null);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

    // Layout Mode: List vs Editor (for non-singletons)
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    // Search, Filter & Pagination
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);
    const hasInitializedRef = useRef(false);
    const [previewItem, setPreviewItem] = useState(null);

    // Custom Toast & Confirmation Dialog
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const isSubmittingRef = useRef(false);

    const showToast = useCallback((type, text) => {
        setToast({ type, text, id: Date.now() });
    }, []);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(null), 5500);
        return () => clearTimeout(timer);
    }, [toast]);

    const categoryField = useMemo(
        () => config?.fields.find((f) => f.name === "category" && f.type === "select"),
        [config]
    );

    const levelField = useMemo(
        () => config?.fields.find((f) => f.name === "level" && f.type === "select"),
        [config]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Check for `?new=1` in URL on mount
    useEffect(() => {
        if (typeof window !== "undefined" && !config?.singleton) {
            const params = new URLSearchParams(window.location.search);
            if (params.get("new") === "1") {
                openCreateEditor();
            }
        }
    }, [config]);

    const loadRecords = useCallback(async () => {
        if (!config) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedQuery) params.set("q", debouncedQuery);
            if (status !== "all") params.set("status", status);
            if (categoryFilter !== "all") params.set("category", categoryFilter);
            if (levelFilter !== "all") params.set("level", levelFilter);
            params.set("page", String(page));
            params.set("pageSize", "15");

            const response = await fetch(`/api/admin/content/${collection}?${params}`, {
                cache: "no-store",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal memuat data.");

            const list = result.data || [];
            setRecords(list);
            setTotalCount(result.count || 0);
            setTotalPages(result.totalPages || 1);

            if (config.singleton && list[0] && !hasInitializedRef.current) {
                setSelectedId(list[0].id);
                setRecord({ ...blankRecord(config), ...list[0] });
            }
            hasInitializedRef.current = true;
        } catch (loadError) {
            showToast("error", loadError.message || "Kesalahan jaringan saat memuat data.");
        } finally {
            setIsLoading(false);
        }
    }, [collection, config, debouncedQuery, status, categoryFilter, levelFilter, page, showToast]);

    useEffect(() => {
        loadRecords();
    }, [loadRecords]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (!dirty) return;
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [dirty]);

    const modalOpen = Boolean(confirmDialog) || Boolean(previewItem);

    useEffect(() => {
        if (!modalOpen && !isEditorOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (confirmDialog) setConfirmDialog(null);
                else if (previewItem) setPreviewItem(null);
                else if (isEditorOpen && !dirty) setIsEditorOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        if (modalOpen || isEditorOpen) {
            document.body.style.overflow = "hidden";
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalOpen, isEditorOpen, confirmDialog, previewItem, dirty]);

    function openCreateEditor() {
        setSelectedId(null);
        setRecord(blankRecord(config));
        setSlugManuallyEdited(false);
        setDirty(false);
        setIsEditorOpen(true);
    }

    function openEditEditor(item) {
        setSelectedId(item.id);
        setRecord({ ...blankRecord(config), ...item });
        setSlugManuallyEdited(Boolean(item.slug));
        setDirty(false);
        setIsEditorOpen(true);
    }

    function closeEditor() {
        if (dirty) {
            setConfirmDialog({
                title: "Perubahan Belum Disimpan",
                description: "Anda memiliki perubahan form yang belum disimpan. Yakin ingin menutup editor tanpa menyimpan?",
                confirmLabel: "Buang Perubahan",
                tone: "warning",
                onConfirm: () => {
                    setConfirmDialog(null);
                    setDirty(false);
                    setIsEditorOpen(false);
                },
            });
            return;
        }
        setIsEditorOpen(false);
    }

    function updateField(name, nextValue) {
        setRecord((prev) => {
            const next = { ...prev, [name]: nextValue };
            if (collection === "projects" && name === "title" && !slugManuallyEdited) {
                next.slug = slugifyText(nextValue);
            }
            return next;
        });
        setDirty(true);
    }

    // Direct toggle publish from table
    async function togglePublishStatus(item, event) {
        event?.stopPropagation();
        const nextStatus = !item.is_published;
        try {
            const response = await fetch(`/api/admin/content/${collection}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: item.id, is_published: nextStatus }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal mengubah status publikasi.");

            showToast("success", `${item.title || item.position || item.institution || "Item"} sekarang ${nextStatus ? "Dipublikasikan" : "Disimpan sebagai Draft"}.`);
            setRecords((prev) =>
                prev.map((r) => (r.id === item.id ? { ...r, is_published: nextStatus } : r))
            );
        } catch (err) {
            showToast("error", err.message || "Gagal memperbarui status.");
        }
    }

    async function handleUpload(field, file) {
        if (!file) return;

        if (file.size > MAX_UPLOAD_BYTES) {
            showToast("error", "Ukuran berkas maksimal adalah 5 MB.");
            return;
        }

        setUploadingField(field.name);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", collection);
            const currentUrl = record[field.name];
            if (currentUrl) formData.append("previousUrl", currentUrl);

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal mengunggah berkas.");

            updateField(field.name, result.url);
            showToast("success", "Berkas berhasil diunggah ke Supabase Storage.");
        } catch (uploadError) {
            showToast("error", uploadError.message || "Terjadi kesalahan saat mengunggah.");
        } finally {
            setUploadingField(null);
        }
    }

    async function handleSubmit(event, forcedPublishStatus = null) {
        if (event) event.preventDefault();
        if (isSubmittingRef.current || isSaving) return;

        isSubmittingRef.current = true;
        setIsSaving(true);

        const payloadToSubmit = { ...record };
        if (forcedPublishStatus !== null) {
            payloadToSubmit.is_published = forcedPublishStatus;
        }

        const isUpdating = Boolean(selectedId);
        const method = isUpdating ? "PATCH" : "POST";
        const bodyPayload = isUpdating
            ? { ...payloadToSubmit, id: selectedId }
            : payloadToSubmit;

        try {
            const response = await fetch(`/api/admin/content/${collection}`, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Gagal menyimpan data.");
            }

            const saved = result.data;
            showToast("success", `Konten ${config.singularLabel} berhasil disimpan.`);
            setDirty(false);

            if (config.singleton) {
                setRecord({ ...blankRecord(config), ...saved });
            } else {
                setIsEditorOpen(false);
                await loadRecords();
            }
        } catch (saveError) {
            showToast("error", saveError.message || "Gagal menyimpan perubahan ke database.");
        } finally {
            isSubmittingRef.current = false;
            setIsSaving(false);
        }
    }

    function requestDelete(item, event) {
        event?.stopPropagation();
        const itemName =
            item.title || item.position || item.institution || item.name || config.singularLabel;

        setConfirmDialog({
            title: `Hapus ${config.singularLabel}?`,
            description: `Tindakan ini tidak dapat dibatalkan. Record "${itemName}" beserta media terkait akan dihapus permanen dari database.`,
            confirmLabel: "Hapus Permanen",
            tone: "danger",
            onConfirm: async () => {
                setConfirmDialog(null);
                try {
                    const response = await fetch(`/api/admin/content/${collection}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: item.id }),
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error || "Gagal menghapus konten.");

                    showToast("success", `${config.singularLabel} berhasil dihapus.`);
                    if (selectedId === item.id) {
                        setIsEditorOpen(false);
                        setSelectedId(null);
                    }
                    await loadRecords();
                } catch (delError) {
                    showToast("error", delError.message || "Gagal menghapus data.");
                }
            },
        });
    }

    // Group fields by section for the editor form
    const sections = useMemo(() => {
        if (!config) return [];
        const map = new Map();
        for (const field of config.fields) {
            const sectionName = field.section || "General Information";
            if (!map.has(sectionName)) {
                map.set(sectionName, []);
            }
            map.get(sectionName).push(field);
        }
        return Array.from(map.entries()).map(([title, fields]) => ({ title, fields }));
    }, [config]);

    // Published vs Draft count
    const publishedCount = useMemo(
        () => records.filter((r) => r.is_published).length,
        [records]
    );
    const draftCount = useMemo(
        () => records.filter((r) => !r.is_published).length,
        [records]
    );

    if (!config) return null;

    // SINGLETON RENDER (Profile & Site Settings)
    if (config.singleton) {
        return (
            <div className="admin-page">
                <header className="admin-page-header">
                    <div>
                        <div className="admin-eyebrow">{eyebrow}</div>
                        <h1 className="admin-title">{title}</h1>
                        <p className="admin-subtitle">{description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={(e) => handleSubmit(e)}
                            disabled={isSaving}
                            className="admin-primary-action"
                        >
                            <Check size={14} />
                            <span>{isSaving ? "Menyimpan…" : "Save Changes"}</span>
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="admin-singleton-form mt-6">
                    {sections.map(({ title: sectionTitle, fields }) => (
                        <div key={sectionTitle} className="admin-form-section">
                            <div className="admin-form-section-header">
                                <h3>{sectionTitle}</h3>
                            </div>
                            <div className="admin-form-grid">
                                {fields.map((field) => (
                                    <FormField
                                        key={field.name}
                                        field={field}
                                        value={record[field.name]}
                                        record={record}
                                        onChange={(val) => updateField(field.name, val)}
                                        onUpload={(f) => handleUpload(field, f)}
                                        uploading={uploadingField === field.name}
                                        slugEdited={slugManuallyEdited}
                                        setSlugEdited={setSlugManuallyEdited}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="admin-singleton-bottom-bar">
                        {dirty && (
                            <span className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                Perubahan belum disimpan
                            </span>
                        )}
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="admin-primary-action ml-auto"
                        >
                            <Check size={14} />
                            <span>{isSaving ? "Menyimpan…" : "Save Changes"}</span>
                        </button>
                    </div>
                </form>

                {/* Toast */}
                {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
            </div>
        );
    }

    // COLLECTION RENDER (Projects, Certificates, Experience, Education, Achievements)
    return (
        <div className="admin-page">
            {/* Top Page Header */}
            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">{eyebrow}</div>
                    <div className="flex items-center gap-3 mt-1">
                        <h1 className="admin-title">{title}</h1>
                        <span className="admin-count-pill">{totalCount} items</span>
                    </div>
                    <p className="admin-subtitle">{description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={openCreateEditor}
                        className="admin-primary-action"
                    >
                        <Plus size={15} />
                        <span>Add {config.singularLabel}</span>
                    </button>
                </div>
            </header>

            {/* Quick Stats & Metrics Pills */}
            <div className="admin-summary-strip">
                <div className="admin-strip-item">
                    <span className="admin-strip-label">Total {config.label}</span>
                    <strong className="admin-strip-val">{totalCount}</strong>
                </div>
                <div className="admin-strip-divider" />
                <div className="admin-strip-item">
                    <span className="admin-strip-label">Published</span>
                    <strong className="admin-strip-val text-accent">{publishedCount}</strong>
                </div>
                <div className="admin-strip-divider" />
                <div className="admin-strip-item">
                    <span className="admin-strip-label">Drafts</span>
                    <strong className="admin-strip-val text-amber-400">{draftCount}</strong>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-search-wrap">
                    <Search size={15} className="admin-search-icon" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Search ${config.label.toLowerCase()} by name, title...`}
                        className="admin-search-input"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="admin-search-clear"
                            aria-label="Clear search"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                <div className="admin-toolbar-filters">
                    {/* Status Pill Toggle */}
                    <div className="admin-pill-group" role="group" aria-label="Filter status">
                        {[
                            { key: "all", label: "All" },
                            { key: "published", label: "Published" },
                            { key: "draft", label: "Draft" },
                        ].map((btn) => (
                            <button
                                key={btn.key}
                                type="button"
                                onClick={() => {
                                    setStatus(btn.key);
                                    setPage(1);
                                }}
                                className={`admin-pill-btn ${status === btn.key ? "is-active" : ""}`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    {/* Category Dropdown */}
                    {categoryField && (
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                setPage(1);
                            }}
                            className="admin-select-filter"
                        >
                            <option value="all">All Categories</option>
                            {categoryField.choices?.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Level Dropdown (Achievements/Certificates) */}
                    {levelField && (
                        <select
                            value={levelFilter}
                            onChange={(e) => {
                                setLevelFilter(e.target.value);
                                setPage(1);
                            }}
                            className="admin-select-filter"
                        >
                            <option value="all">All Levels</option>
                            {levelField.choices?.map((l) => (
                                <option key={l.value} value={l.value}>
                                    {l.label}
                                </option>
                            ))}
                        </select>
                    )}

                    <button
                        type="button"
                        onClick={loadRecords}
                        disabled={isLoading}
                        className="admin-icon-btn"
                        title="Refresh data"
                        aria-label="Refresh data"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Main Content: Table & Cards */}
            <div className="admin-content-main mt-4">
                {isLoading && records.length === 0 ? (
                    <div className="admin-table-loading">
                        <div className="skeleton h-12 w-full mb-2" />
                        <div className="skeleton h-14 w-full mb-2" />
                        <div className="skeleton h-14 w-full mb-2" />
                        <div className="skeleton h-14 w-full" />
                    </div>
                ) : records.length === 0 ? (
                    <div className="admin-empty-box">
                        <FileText size={32} className="text-white/30 mx-auto mb-3" />
                        <h3>No {config.label} found</h3>
                        <p>
                            {debouncedQuery || status !== "all" || categoryFilter !== "all" || levelFilter !== "all"
                                ? "No records match the current filters. Try resetting search or filter options."
                                : `Belum ada data ${config.label.toLowerCase()} yang tersimpan.`}
                        </p>
                        <button
                            type="button"
                            onClick={openCreateEditor}
                            className="admin-primary-action mt-4 inline-flex"
                        >
                            <Plus size={14} />
                            <span>Add New {config.singularLabel}</span>
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th className="w-[40%]">Item Information</th>
                                        <th className="w-[18%]">Category / Details</th>
                                        <th className="w-[14%]">Status</th>
                                        <th className="w-[12%]">Order / Date</th>
                                        <th className="w-[16%] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.map((item) => (
                                        <tr key={item.id} className="admin-tr">
                                            <td>
                                                <div className="admin-item-cell">
                                                    {/* Thumbnail / Icon / Logo */}
                                                    {(item.thumbnail_url || item.image_url || item.logo_url || item.certificate_image_url) ? (
                                                        <div className="admin-item-thumb">
                                                            <img
                                                                src={item.thumbnail_url || item.image_url || item.logo_url || item.certificate_image_url}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="admin-item-thumb-placeholder">
                                                            <ImageIcon size={15} />
                                                        </div>
                                                    )}
                                                    <div className="admin-item-meta truncate">
                                                        <div className="admin-item-title truncate">
                                                            {item.title || item.position || item.institution || item.name}
                                                        </div>
                                                        <div className="admin-item-sub truncate">
                                                            {item.tagline ||
                                                             item.event_name ||
                                                             item.issuer ||
                                                             item.organization ||
                                                             item.degree ||
                                                             item.slug ||
                                                             "—"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1 items-start">
                                                    {(item.category || item.employment_type || item.award) && (
                                                        <span className="admin-tag-badge">
                                                            {item.award ? `${item.award} · ` : ""}{item.category || item.employment_type}
                                                        </span>
                                                    )}
                                                    {item.level && (
                                                        <span className="text-[10px] font-mono text-white/50 uppercase">
                                                            Level: {item.level}
                                                        </span>
                                                    )}
                                                    {item.is_featured && (
                                                        <span className="admin-featured-badge">Featured</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={(e) => togglePublishStatus(item, e)}
                                                    className={`admin-status-toggle ${item.is_published ? "is-published" : "is-draft"}`}
                                                    title="Click to toggle publish status"
                                                >
                                                    <span className="admin-status-dot" />
                                                    <span>{item.is_published ? "Published" : "Draft"}</span>
                                                </button>
                                            </td>
                                            <td>
                                                <div className="text-xs font-mono text-white/70">
                                                    #{item.display_order ?? 0}
                                                </div>
                                                <div className="text-[10px] font-mono text-white/40 mt-0.5">
                                                    {item.date_achieved || item.start_date || item.issued_at || "—"}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <div className="admin-actions-cell">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPreviewItem(item)}
                                                        className="admin-action-btn"
                                                        title="Preview item"
                                                        aria-label="Preview item"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditEditor(item)}
                                                        className="admin-action-btn admin-action-edit"
                                                        title="Edit item"
                                                        aria-label="Edit item"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => requestDelete(item, e)}
                                                        className="admin-action-btn admin-action-delete"
                                                        title="Delete item"
                                                        aria-label="Delete item"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="admin-pagination">
                                <div className="text-xs font-mono text-white/50">
                                    Page {page} of {totalPages} ({totalCount} total items)
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        disabled={page <= 1}
                                        className="admin-page-btn"
                                        aria-label="Previous page"
                                    >
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="px-2 text-xs font-mono text-white/80">
                                        {page} / {totalPages}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={page >= totalPages}
                                        className="admin-page-btn"
                                        aria-label="Next page"
                                    >
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* DEDICATED EDITOR DRAWER / MODAL */}
            {isEditorOpen && (
                <div className="admin-drawer-backdrop" onClick={closeEditor}>
                    <div
                        className="admin-drawer-panel"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="drawer-title"
                    >
                        {/* Drawer Header */}
                        <div className="admin-drawer-header">
                            <div>
                                <div className="admin-eyebrow">
                                    {selectedId ? "EDIT RECORD" : "NEW RECORD"} / {config.label.toUpperCase()}
                                </div>
                                <h2 id="drawer-title" className="admin-drawer-title">
                                    {selectedId ? `Edit ${config.singularLabel}` : `Add New ${config.singularLabel}`}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={closeEditor}
                                    className="admin-icon-btn"
                                    aria-label="Close editor"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Drawer Form Body */}
                        <form onSubmit={(e) => handleSubmit(e)} className="admin-drawer-body">
                            {sections.map(({ title: sectionTitle, fields }) => (
                                <fieldset key={sectionTitle} className="admin-drawer-section">
                                    <legend className="admin-section-legend">{sectionTitle}</legend>
                                    <div className="admin-form-grid">
                                        {fields.map((field) => (
                                            <FormField
                                                key={field.name}
                                                field={field}
                                                value={record[field.name]}
                                                record={record}
                                                onChange={(val) => updateField(field.name, val)}
                                                onUpload={(f) => handleUpload(field, f)}
                                                uploading={uploadingField === field.name}
                                                slugEdited={slugManuallyEdited}
                                                setSlugEdited={setSlugManuallyEdited}
                                            />
                                        ))}
                                    </div>
                                </fieldset>
                            ))}
                        </form>

                        {/* Drawer Footer Actions */}
                        <div className="admin-drawer-footer">
                            <button
                                type="button"
                                onClick={closeEditor}
                                className="admin-secondary-action"
                            >
                                Cancel
                            </button>

                            <div className="flex items-center gap-2.5 ml-auto">
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, false)}
                                    disabled={isSaving}
                                    className="admin-secondary-action text-amber-300 border-amber-500/30 hover:border-amber-400"
                                >
                                    {isSaving ? "Saving…" : "Save as Draft"}
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmit(e, true)}
                                    disabled={isSaving}
                                    className="admin-primary-action"
                                >
                                    <Check size={14} />
                                    <span>{isSaving ? "Saving…" : selectedId ? "Save Changes" : "Publish Now"}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PREVIEW MODAL */}
            {previewItem && (
                <PreviewModal
                    collection={collection}
                    item={previewItem}
                    onClose={() => setPreviewItem(null)}
                />
            )}

            {/* CONFIRMATION DIALOG */}
            {confirmDialog && (
                <ConfirmModal
                    dialog={confirmDialog}
                    onClose={() => setConfirmDialog(null)}
                />
            )}

            {/* TOAST */}
            {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
        </div>
    );
}

// INDIVIDUAL FORM FIELD COMPONENT
function FormField({
    field,
    value,
    record,
    onChange,
    onUpload,
    uploading,
    slugEdited,
    setSlugEdited,
}) {
    const isFullWidth =
        field.type === "textarea" ||
        field.type === "media" ||
        field.type === "json" ||
        field.type === "lines";

    return (
        <div className={`admin-field-wrap ${isFullWidth ? "is-full" : ""}`}>
            <label htmlFor={`field-${field.name}`} className="admin-label">
                <span>{field.label}</span>
                {field.required && <span className="text-accent ml-1">*</span>}
            </label>

            {field.type === "select" ? (
                <select
                    id={`field-${field.name}`}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="admin-input"
                >
                    {field.choices?.map((c) => (
                        <option key={c.value} value={c.value}>
                            {c.label}
                        </option>
                    ))}
                </select>
            ) : field.type === "textarea" ? (
                <textarea
                    id={`field-${field.name}`}
                    rows={field.name === "short_description" ? 3 : 5}
                    value={formatValue(field, value)}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={field.placeholder}
                    className="admin-input admin-textarea"
                />
            ) : field.type === "checkbox" ? (
                <label className="admin-checkbox-label">
                    <input
                        id={`field-${field.name}`}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                        className="admin-checkbox"
                    />
                    <span className="text-sm text-white/80">{field.label}</span>
                </label>
            ) : field.type === "media" ? (
                <div className="admin-media-box">
                    <div className="flex gap-2 items-center">
                        <input
                            id={`field-${field.name}`}
                            type="text"
                            value={value || ""}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder="https://... atau klik Upload"
                            className="admin-input flex-1"
                        />
                        <label className="admin-upload-btn">
                            <Upload size={14} />
                            <span>{uploading ? "Uploading…" : "Upload"}</span>
                            <input
                                type="file"
                                accept={field.accept || "image/*"}
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) onUpload(f);
                                }}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                    {value && (
                        <div className="admin-media-preview-bar">
                            <span className="truncate text-xs font-mono text-white/50">{value}</span>
                            <a
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline text-xs font-mono inline-flex items-center gap-1"
                            >
                                <ExternalLink size={12} /> View
                            </a>
                        </div>
                    )}
                </div>
            ) : field.type === "lines" || field.type === "array" ? (
                <textarea
                    id={`field-${field.name}`}
                    rows={4}
                    value={formatValue(field, value)}
                    onChange={(e) => onChange(parseValue(field, e.target.value))}
                    placeholder={field.placeholder}
                    className="admin-input admin-textarea font-mono text-xs"
                />
            ) : (
                <div className="relative">
                    <input
                        id={`field-${field.name}`}
                        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                        value={formatValue(field, value)}
                        disabled={field.disableWhenCurrent && Boolean(record.is_current)}
                        onChange={(e) => {
                            if (field.name === "slug") setSlugEdited(true);
                            onChange(e.target.value);
                        }}
                        placeholder={field.placeholder}
                        className="admin-input"
                    />
                    {field.name === "slug" && (
                        <button
                            type="button"
                            onClick={() => {
                                onChange(slugifyText(record.title || ""));
                                setSlugEdited(false);
                            }}
                            className="admin-slug-sync-btn"
                            title="Regenerate slug from title"
                        >
                            <Wand2 size={12} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// PREVIEW MODAL COMPONENT
function PreviewModal({ collection, item, onClose }) {
    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div className="admin-preview-card" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="admin-eyebrow">PREVIEW / {collection.toUpperCase()}</div>
                    <button type="button" onClick={onClose} className="admin-icon-btn">
                        <X size={15} />
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {(item.thumbnail_url || item.certificate_image_url || item.image_url) && (
                        <div className="aspect-video w-full overflow-hidden bg-primary border border-white/10">
                            <img
                                src={item.thumbnail_url || item.certificate_image_url || item.image_url}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                        {item.category && <span className="admin-tag-badge">{item.category}</span>}
                        {item.level && <span className="admin-tag-badge">{item.level}</span>}
                        {item.award && <span className="admin-featured-badge">{item.award}</span>}
                        <span className={`admin-status-dot-static ${item.is_published ? "bg-accent" : "bg-amber-400"}`} />
                        <span className="text-xs font-mono text-white/50">{item.is_published ? "Published" : "Draft"}</span>
                    </div>

                    <h2 className="text-xl font-display font-bold text-white">
                        {item.title || item.position || item.institution || item.name}
                    </h2>

                    {(item.event_name || item.organizer || item.company || item.issuer) && (
                        <p className="text-xs font-mono text-accent">
                            {item.event_name || item.organizer || item.company || item.issuer}
                        </p>
                    )}

                    <p className="text-sm text-white/70 leading-relaxed">
                        {item.short_description || item.description || item.bio || item.tagline}
                    </p>

                    {item.technologies && Array.isArray(item.technologies) && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {item.technologies.map((t) => (
                                <span key={t} className="text-[11px] font-mono px-2 py-0.5 bg-primary border border-white/10 text-white/75">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
                    <button type="button" onClick={onClose} className="admin-secondary-action">
                        Close Preview
                    </button>
                </div>
            </div>
        </div>
    );
}

// CONFIRMATION MODAL COMPONENT
function ConfirmModal({ dialog, onClose }) {
    return (
        <div className="admin-modal-backdrop" onClick={onClose}>
            <div className="admin-confirm-card" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-none border ${dialog.tone === "danger" ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-amber-500/40 bg-amber-500/10 text-amber-400"}`}>
                        <AlertCircle size={20} />
                    </div>
                    <div>
                        <h3 className="font-display font-bold text-white text-base">{dialog.title}</h3>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">{dialog.description}</p>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-white/10">
                    <button type="button" onClick={onClose} className="admin-secondary-action">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={dialog.onConfirm}
                        className={`admin-primary-action ${dialog.tone === "danger" ? "bg-red-500 hover:bg-red-600 text-white border-red-500" : ""}`}
                    >
                        {dialog.confirmLabel || "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// TOAST COMPONENT
function Toast({ toast, onClose }) {
    return (
        <div className={`admin-toast ${toast.type === "error" ? "is-error" : "is-success"}`}>
            <div className="flex items-center gap-2.5 min-w-0">
                {toast.type === "error" ? (
                    <AlertCircle size={16} className="shrink-0 text-red-400" />
                ) : (
                    <CheckCircle2 size={16} className="shrink-0 text-accent" />
                )}
                <span className="truncate">{toast.text}</span>
            </div>
            <button type="button" onClick={onClose} className="admin-toast-close" aria-label="Dismiss toast">
                <X size={14} />
            </button>
        </div>
    );
}
