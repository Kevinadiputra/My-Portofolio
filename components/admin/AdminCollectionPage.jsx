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

    // Search, Filter & Pagination
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // States
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);
    const hasInitializedRef = useRef(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    // Custom Toast & Confirmation Dialog (No browser alert/confirm)
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

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const loadRecords = useCallback(async () => {
        if (!config) return;
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (debouncedQuery) params.set("q", debouncedQuery);
            if (status !== "all") params.set("status", status);
            if (categoryFilter !== "all") params.set("category", categoryFilter);
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
    }, [collection, config, debouncedQuery, status, categoryFilter, page, showToast]);

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

    const modalOpen = Boolean(confirmDialog) || previewOpen;

    useEffect(() => {
        if (!modalOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                if (confirmDialog) setConfirmDialog(null);
                else setPreviewOpen(false);
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalOpen, confirmDialog]);

    const recordLabel = useMemo(
        () =>
            record.title ||
            record.name ||
            record.position ||
            record.institution ||
            record.site_name ||
            `New ${config?.singularLabel || "entry"}`,
        [record, config]
    );

    if (!config) return null;

    function applySelectRecord(item) {
        setSelectedId(item.id);
        setRecord({ ...blankRecord(config), ...item });
        setSlugManuallyEdited(Boolean(item.slug));
        setDirty(false);
    }

    function selectRecord(item) {
        if (dirty) {
            setConfirmDialog({
                title: "Perubahan Belum Disimpan",
                description:
                    "Anda memiliki perubahan yang belum disimpan pada form ini. Buang perubahan dan beralih ke record lain?",
                confirmLabel: "Buang Perubahan",
                tone: "warning",
                onConfirm: () => {
                    setConfirmDialog(null);
                    applySelectRecord(item);
                },
            });
            return;
        }
        applySelectRecord(item);
    }

    function applyStartNew() {
        setSelectedId(null);
        setRecord(blankRecord(config));
        setSlugManuallyEdited(false);
        setDirty(false);
    }

    function startNew() {
        if (dirty) {
            setConfirmDialog({
                title: "Buat Record Baru?",
                description:
                    "Perubahan pada form saat ini belum disimpan. Buang perubahan dan mulai record baru?",
                confirmLabel: "Mulai Baru",
                tone: "warning",
                onConfirm: () => {
                    setConfirmDialog(null);
                    applyStartNew();
                },
            });
            return;
        }
        applyStartNew();
    }

    function updateField(field, value) {
        setRecord((current) => {
            const nextValue = field.type === "checkbox" ? Boolean(value) : parseValue(field, value);
            const updated = { ...current, [field.name]: nextValue };

            // Auto-generate slug when editing project title on new records
            if (
                collection === "projects" &&
                field.name === "title" &&
                !selectedId &&
                !slugManuallyEdited
            ) {
                updated.slug = slugifyText(value);
            }

            if (collection === "projects" && field.name === "slug") {
                setSlugManuallyEdited(true);
            }

            // Clear end_date when is_current is checked
            if (field.name === "is_current" && nextValue === true) {
                updated.end_date = "";
            }

            return updated;
        });
        setDirty(true);
    }

    async function uploadMedia(field, event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_UPLOAD_BYTES) {
            showToast("error", "Ukuran file melebihi batas maksimal 5 MB.");
            event.target.value = "";
            return;
        }

        setUploadingField(field.name);
        try {
            const formData = new FormData();
            formData.set("file", file);
            formData.set("folder", collection);
            if (record[field.name]) {
                formData.set("previousUrl", record[field.name]);
            }

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal mengunggah file.");

            setRecord((current) => ({ ...current, [field.name]: result.url }));
            setDirty(true);
            showToast(
                "success",
                `${field.label} berhasil diunggah. Klik "Save Changes" untuk menyimpan record.`
            );
        } catch (uploadError) {
            showToast("error", uploadError.message || "Gagal mengunggah file.");
        } finally {
            setUploadingField(null);
            event.target.value = "";
        }
    }

    async function persistRecord(overrideFields = {}) {
        if (isSubmittingRef.current || isSaving) return;
        isSubmittingRef.current = true;
        setIsSaving(true);

        try {
            const payloadToSend = {
                ...record,
                ...overrideFields,
                ...(selectedId ? { id: selectedId } : {}),
            };

            const response = await fetch(`/api/admin/content/${collection}`, {
                method: selectedId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadToSend),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal menyimpan perubahan.");

            setSelectedId(result.data.id);
            setRecord({ ...blankRecord(config), ...result.data });
            setSlugManuallyEdited(Boolean(result.data.slug));
            setDirty(false);
            showToast(
                "success",
                result.data.is_published === false
                    ? "Disimpan sebagai Draft (hanya terlihat oleh Admin)."
                    : "Perubahan berhasil disimpan dan halaman publik telah diperbarui."
            );
            await loadRecords();
        } catch (saveError) {
            showToast("error", saveError.message || "Terjadi kesalahan saat menyimpan data.");
        } finally {
            setIsSaving(false);
            isSubmittingRef.current = false;
        }
    }

    async function saveRecord(event) {
        event.preventDefault();
        await persistRecord();
    }

    function requestDeleteRecord() {
        if (!selectedId || config.singleton) return;
        setConfirmDialog({
            title: `Hapus "${recordLabel}"?`,
            description:
                "Tindakan ini akan menghapus data secara permanen dari database dan membersihkan file terkait di penyimpanan.",
            confirmLabel: "Ya, Hapus Permanen",
            tone: "danger",
            onConfirm: async () => {
                setConfirmDialog(null);
                await executeDelete();
            },
        });
    }

    async function executeDelete() {
        if (!selectedId || isSubmittingRef.current) return;
        isSubmittingRef.current = true;
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/content/${collection}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Gagal menghapus record.");

            applyStartNew();
            showToast("success", "Record berhasil dihapus dan halaman publik telah diperbarui.");
            await loadRecords();
        } catch (deleteError) {
            showToast("error", deleteError.message || "Gagal menghapus record.");
        } finally {
            setIsSaving(false);
            isSubmittingRef.current = false;
        }
    }

    const hasPublicationStatus = useMemo(
        () => config.fields.some((f) => f.name === "is_published"),
        [config]
    );

    return (
        <div className="admin-page">
            {/* Toast Notification Banner */}
            {toast && (
                <div
                    role={toast.type === "error" ? "alert" : "status"}
                    className={`admin-toast ${toast.type === "error" ? "is-error" : "is-success"}`}
                >
                    <div className="flex items-center gap-2.5">
                        {toast.type === "error" ? (
                            <AlertCircle size={17} className="shrink-0" />
                        ) : (
                            <CheckCircle2 size={17} className="shrink-0" />
                        )}
                        <span>{toast.text}</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        aria-label="Tutup notifikasi"
                        className="opacity-70 hover:opacity-100"
                    >
                        <X size={15} />
                    </button>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmDialog && (
                <div
                    className="admin-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-confirm-title"
                >
                    <div className="admin-modal-card">
                        <div className="admin-eyebrow">CONFIRM ACTION</div>
                        <h3 id="admin-confirm-title" className="text-lg font-display font-bold text-white mt-1">
                            {confirmDialog.title}
                        </h3>
                        <p className="text-sm text-white/70 mt-2 leading-relaxed">
                            {confirmDialog.description}
                        </p>
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                className="admin-secondary-action"
                                onClick={() => setConfirmDialog(null)}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className={
                                    confirmDialog.tone === "danger"
                                        ? "admin-danger-action"
                                        : "admin-primary-action"
                                }
                                onClick={confirmDialog.onConfirm}
                            >
                                {confirmDialog.confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {previewOpen && (
                <div
                    className="admin-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-preview-title"
                >
                    <div className="admin-modal-card max-w-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div>
                                <div className="admin-eyebrow">LIVE CONTENT PREVIEW</div>
                                <h3 id="admin-preview-title" className="text-lg font-display font-bold text-white">
                                    {recordLabel}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setPreviewOpen(false)}
                                className="text-white/60 hover:text-white"
                                aria-label="Tutup preview"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                                {hasPublicationStatus && (
                                    <span
                                        className={`px-2 py-0.5 border ${
                                            record.is_published
                                                ? "border-accent/40 bg-accent/10 text-accent"
                                                : "border-amber-400/40 bg-amber-400/10 text-amber-300"
                                        }`}
                                    >
                                        {record.is_published ? "PUBLISHED" : "DRAFT"}
                                    </span>
                                )}
                                {record.category && (
                                    <span className="px-2 py-0.5 border border-white/10 text-white/70 uppercase">
                                        {record.category}
                                    </span>
                                )}
                                {record.is_featured && (
                                    <span className="px-2 py-0.5 border border-accent/30 text-accent">
                                        FEATURED
                                    </span>
                                )}
                            </div>

                            {(record.thumbnail_url || record.image_url || record.profile_photo_url) && (
                                <div className="border border-white/10 bg-primary overflow-hidden max-h-56">
                                    <img
                                        src={
                                            record.thumbnail_url ||
                                            record.image_url ||
                                            record.profile_photo_url
                                        }
                                        alt={recordLabel}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>
                            )}

                            {(record.tagline || record.professional_title || record.issuer || record.organization) && (
                                <p className="font-mono text-xs text-accent">
                                    {record.tagline ||
                                        record.professional_title ||
                                        record.issuer ||
                                        record.organization}
                                </p>
                            )}

                            {(record.short_description || record.description || record.bio) && (
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {record.short_description || record.description || record.bio}
                                </p>
                            )}

                            {record.challenge && (
                                <div className="border-l-2 border-white/20 pl-3">
                                    <div className="font-mono text-[10px] uppercase text-white/40">
                                        Problem / Challenge
                                    </div>
                                    <p className="text-xs text-white/75 mt-1">{record.challenge}</p>
                                </div>
                            )}

                            {record.solution && (
                                <div className="border-l-2 border-accent pl-3">
                                    <div className="font-mono text-[10px] uppercase text-accent">
                                        Approach / Solution
                                    </div>
                                    <p className="text-xs text-white/75 mt-1">{record.solution}</p>
                                </div>
                            )}

                            {Array.isArray(record.achievements) && record.achievements.length > 0 && (
                                <ul className="space-y-1.5 text-xs text-white/75 list-disc pl-4">
                                    {record.achievements.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            {Array.isArray(record.technologies || record.skills) &&
                                (record.technologies || record.skills).length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-2">
                                        {(record.technologies || record.skills).map((tag) => (
                                            <span
                                                key={tag}
                                                className="font-mono text-[10px] px-2 py-0.5 border border-white/10 bg-white/[0.03] text-white/70"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                className="admin-secondary-action"
                                onClick={() => setPreviewOpen(false)}
                            >
                                Tutup Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">{eyebrow}</div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        className="admin-secondary-action"
                        onClick={loadRecords}
                        disabled={isLoading}
                        title="Muat ulang daftar dari database"
                    >
                        <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </button>
                    {!config.singleton && (
                        <button type="button" className="admin-primary-action" onClick={startNew}>
                            <Plus size={15} />
                            <span>New {config.singularLabel || "Entry"}</span>
                        </button>
                    )}
                </div>
            </header>

            <div className={config.singleton ? "mt-4" : "admin-crud-layout"}>
                {!config.singleton && (
                    <section className="admin-panel admin-record-list" aria-label={`${title} list`}>
                        <div className="admin-list-controls">
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => {
                                    setQuery(event.target.value);
                                    setPage(1);
                                }}
                                placeholder={`Cari ${title.toLowerCase()}…`}
                                aria-label={`Search ${title.toLowerCase()}`}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <select
                                    value={status}
                                    onChange={(event) => {
                                        setStatus(event.target.value);
                                        setPage(1);
                                    }}
                                    aria-label="Filter publication status"
                                >
                                    <option value="all">Semua status ({totalCount})</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>

                                {categoryField ? (
                                    <select
                                        value={categoryFilter}
                                        onChange={(event) => {
                                            setCategoryFilter(event.target.value);
                                            setPage(1);
                                        }}
                                        aria-label="Filter category"
                                    >
                                        <option value="all">Semua kategori</option>
                                        {categoryField.choices.map((choice) => (
                                            <option key={choice.value} value={choice.value}>
                                                {choice.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center justify-end px-2 font-mono text-[11px] text-white/45">
                                        {totalCount} item
                                    </div>
                                )}
                            </div>
                        </div>

                        {isLoading ? (
                            <ul className="admin-records" aria-hidden="true">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <li key={index}>
                                        <div className="animate-pulse px-3 py-3 space-y-2">
                                            <div className="h-3 w-2/3 bg-white/10" />
                                            <div className="h-2.5 w-1/3 bg-white/5" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : records.length ? (
                            <>
                                <ul className="admin-records">
                                    {records.map((item) => {
                                        const itemLabel =
                                            item.title ||
                                            item.name ||
                                            item.position ||
                                            item.institution ||
                                            item.site_name ||
                                            "Untitled";
                                        const subLabel =
                                            item.category ||
                                            item.organization ||
                                            item.issuer ||
                                            item.degree ||
                                            "";

                                        return (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    className={item.id === selectedId ? "is-selected" : ""}
                                                    onClick={() => selectRecord(item)}
                                                >
                                                    <div className="flex items-center justify-between gap-2 w-full">
                                                        <strong>{itemLabel}</strong>
                                                        <span
                                                            className={`px-1.5 py-0.5 text-[10px] border ${
                                                                item.is_published === false
                                                                    ? "border-amber-400/30 text-amber-300 bg-amber-400/10"
                                                                    : "border-accent/30 text-accent bg-accent/10"
                                                            }`}
                                                        >
                                                            {item.is_published === false ? "Draft" : "Live"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-2 text-[11px] text-white/45 font-mono">
                                                        <span className="truncate">{subLabel}</span>
                                                        {typeof item.display_order === "number" && (
                                                            <span>#{item.display_order}</span>
                                                        )}
                                                    </div>
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>

                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-3 font-mono text-xs text-white/60">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            className="admin-secondary-action px-2 py-1 disabled:opacity-40"
                                            aria-label="Halaman sebelumnya"
                                        >
                                            <ChevronLeft size={14} />
                                        </button>
                                        <span>
                                            Hal {page} / {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            className="admin-secondary-action px-2 py-1 disabled:opacity-40"
                                            aria-label="Halaman berikutnya"
                                        >
                                            <ChevronRight size={14} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-8 text-center">
                                <p className="admin-empty-state">
                                    Belum ada record yang cocok. Klik tombol &ldquo;New {config.singularLabel}&rdquo; untuk menambahkan.
                                </p>
                            </div>
                        )}
                    </section>
                )}

                <section className="admin-panel admin-editor-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <div className="admin-eyebrow">
                                EDITOR / {selectedId ? "UPDATE EXISTING" : "CREATE NEW"}
                            </div>
                            <h2>{recordLabel}</h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                className="admin-secondary-action"
                                onClick={() => setPreviewOpen(true)}
                            >
                                <Eye size={14} />
                                <span>Preview</span>
                            </button>
                            {selectedId && !config.singleton && (
                                <button
                                    type="button"
                                    className="admin-danger-action inline-flex items-center gap-1.5"
                                    onClick={requestDeleteRecord}
                                    disabled={isSaving}
                                >
                                    <Trash2 size={13} />
                                    <span>Delete</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <form className="admin-editor-form" onSubmit={saveRecord}>
                        {config.fields.map((field) => {
                            const value = record[field.name];
                            const isDisabledByCurrent =
                                field.disableWhenCurrent && Boolean(record.is_current);

                            if (field.type === "checkbox") {
                                return (
                                    <label className="admin-checkbox-field" key={field.name}>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(value)}
                                            onChange={(event) => updateField(field, event.target.checked)}
                                        />
                                        <span>{field.label}</span>
                                    </label>
                                );
                            }

                            if (field.type === "select") {
                                return (
                                    <label key={field.name}>
                                        <span>
                                            {field.label}
                                            {field.required ? " *" : ""}
                                        </span>
                                        <select
                                            value={value ?? ""}
                                            onChange={(event) => updateField(field, event.target.value)}
                                            required={field.required}
                                            className="admin-select-input"
                                        >
                                            {field.choices.map((choice) => (
                                                <option key={choice.value} value={choice.value}>
                                                    {choice.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                );
                            }

                            if (field.type === "textarea" || field.type === "json" || field.type === "lines") {
                                return (
                                    <label key={field.name} className="admin-full-span">
                                        <span>
                                            {field.label}
                                            {field.required ? " *" : ""}
                                        </span>
                                        <textarea
                                            rows={field.type === "json" ? 5 : 4}
                                            value={formatValue(field, value)}
                                            onChange={(event) => updateField(field, event.target.value)}
                                            placeholder={field.placeholder || ""}
                                            required={field.required}
                                        />
                                    </label>
                                );
                            }

                            if (field.type === "media") {
                                return (
                                    <div key={field.name} className="admin-media-field">
                                        <label>
                                            <span>
                                                {field.label}
                                                {field.required ? " *" : ""}
                                            </span>
                                            <input
                                                type="text"
                                                value={value || ""}
                                                onChange={(event) => updateField(field, event.target.value)}
                                                placeholder="Atau tempel URL / path gambar (mis. /projects/file.png)"
                                            />
                                        </label>
                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                            <label className="admin-upload-trigger">
                                                <Upload size={13} />
                                                <span>
                                                    {uploadingField === field.name
                                                        ? "Uploading…"
                                                        : "Upload File (Max 5MB)"}
                                                </span>
                                                <input
                                                    type="file"
                                                    accept={field.accept}
                                                    onChange={(event) => uploadMedia(field, event)}
                                                    disabled={uploadingField === field.name || isSaving}
                                                    className="sr-only"
                                                />
                                            </label>
                                            {value && (
                                                <a
                                                    className="admin-media-link inline-flex items-center gap-1"
                                                    href={value}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    <span>Lihat file saat ini</span>
                                                    <ExternalLink size={12} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            if (collection === "projects" && field.name === "slug") {
                                return (
                                    <label key={field.name}>
                                        <div className="flex items-center justify-between">
                                            <span>
                                                {field.label}
                                                {field.required ? " *" : ""}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const nextSlug = slugifyText(record.title || "");
                                                    if (nextSlug) {
                                                        setRecord((cur) => ({ ...cur, slug: nextSlug }));
                                                        setDirty(true);
                                                    }
                                                }}
                                                className="inline-flex items-center gap-1 font-mono text-[10px] text-accent hover:underline"
                                            >
                                                <Wand2 size={11} />
                                                <span>Auto dari Title</span>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={formatValue(field, value)}
                                            onChange={(event) => updateField(field, event.target.value)}
                                            placeholder={field.placeholder || "project-slug"}
                                            required={field.required}
                                        />
                                    </label>
                                );
                            }

                            return (
                                <label key={field.name}>
                                    <span>
                                        {field.label}
                                        {field.required ? " *" : ""}
                                    </span>
                                    <input
                                        type={field.type}
                                        value={isDisabledByCurrent ? "" : formatValue(field, value)}
                                        onChange={(event) => updateField(field, event.target.value)}
                                        placeholder={
                                            isDisabledByCurrent
                                                ? "Masih berlangsung (Current)"
                                                : field.placeholder ||
                                                  (field.type === "array" ? "Pisahkan dengan koma" : "")
                                        }
                                        disabled={isDisabledByCurrent}
                                        required={field.required && !isDisabledByCurrent}
                                    />
                                </label>
                            );
                        })}

                        <div className="admin-editor-actions">
                            <button
                                type="submit"
                                className="admin-primary-action"
                                disabled={isSaving || Boolean(uploadingField)}
                            >
                                {isSaving ? "Saving…" : "Save Changes"}
                            </button>

                            {hasPublicationStatus && (
                                <button
                                    type="button"
                                    className="admin-secondary-action"
                                    disabled={isSaving || Boolean(uploadingField)}
                                    onClick={() =>
                                        persistRecord({ is_published: !record.is_published })
                                    }
                                >
                                    {record.is_published
                                        ? "Simpan sebagai Draft"
                                        : "Simpan & Publikasikan"}
                                </button>
                            )}

                            {dirty && (
                                <span className="admin-unsaved-indicator">
                                    ● Perubahan belum disimpan
                                </span>
                            )}
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
