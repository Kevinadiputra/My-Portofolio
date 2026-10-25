"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminCollection } from "@/lib/admin-content";

function emptyValue(field) {
    if (field.type === "array") return [];
    if (field.type === "checkbox") return false;
    if (field.type === "json") return field.name === "social_links" ? "{}" : "[]";
    return "";
}

function blankRecord(config) {
    return Object.fromEntries(config.fields.map((field) => [field.name, emptyValue(field)]));
}

function formatValue(field, value) {
    if (field.type === "array") return Array.isArray(value) ? value.join(", ") : value || "";
    if (field.type === "json" && value && typeof value === "object") return JSON.stringify(value, null, 2);
    return value ?? "";
}

function parseValue(field, value) {
    if (field.type === "array") return value.split(",").map((item) => item.trim()).filter(Boolean);
    return value;
}

export default function AdminCollectionPage({ collection, title, eyebrow, description }) {
    const config = getAdminCollection(collection);
    const [records, setRecords] = useState([]);
    const [record, setRecord] = useState(() => blankRecord(config));
    const [selectedId, setSelectedId] = useState(null);
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [dirty, setDirty] = useState(false);
    const [uploadingField, setUploadingField] = useState(null);
    const [hasInitialized, setHasInitialized] = useState(false);

    const loadRecords = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const params = new URLSearchParams();
            if (query) params.set("q", query);
            if (status !== "all") params.set("status", status);
            const response = await fetch(`/api/admin/content/${collection}?${params}`, { cache: "no-store" });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to load records.");
            setRecords(result.data || []);
            if (config.singleton && result.data?.[0] && !hasInitialized) {
                setSelectedId(result.data[0].id);
                setRecord({ ...blankRecord(config), ...result.data[0] });
            }
            setHasInitialized(true);
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setIsLoading(false);
        }
    }, [collection, config, hasInitialized, query, status]);

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

    const recordLabel = useMemo(() => record.title || record.name || record.position || record.institution || record.site_name || "New record", [record]);

    if (!config) return null;

    function selectRecord(item) {
        if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return;
        setSelectedId(item.id);
        setRecord({ ...blankRecord(config), ...item });
        setDirty(false);
        setMessage("");
    }

    function startNew() {
        if (dirty && !window.confirm("You have unsaved changes. Discard them?")) return;
        setSelectedId(null);
        setRecord(blankRecord(config));
        setDirty(false);
        setMessage("");
    }

    function updateField(field, value) {
        setRecord((current) => ({ ...current, [field.name]: field.type === "checkbox" ? value : parseValue(field, value) }));
        setDirty(true);
        setMessage("");
    }

    async function uploadMedia(field, event) {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingField(field.name);
        setError("");
        setMessage("");
        try {
            const formData = new FormData();
            formData.set("file", file);
            formData.set("folder", collection);
            const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to upload file.");
            updateField(field, result.url);
            setMessage(`${field.label} uploaded. Save changes to persist the record.`);
        } catch (uploadError) {
            setError(uploadError.message);
        } finally {
            setUploadingField(null);
            event.target.value = "";
        }
    }

    async function saveRecord(event) {
        event.preventDefault();
        setIsSaving(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(`/api/admin/content/${collection}`, {
                method: selectedId ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(selectedId ? { ...record, id: selectedId } : record),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to save record.");
            setSelectedId(result.data.id);
            setRecord(result.data);
            setDirty(false);
            setMessage("Saved. Public content updates after publication and cache revalidation.");
            await loadRecords();
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setIsSaving(false);
        }
    }

    async function deleteRecord() {
        if (!selectedId || !window.confirm(`Delete ${recordLabel}? This cannot be undone.`)) return;
        setIsSaving(true);
        setError("");
        try {
            const response = await fetch(`/api/admin/content/${collection}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: selectedId }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Unable to delete record.");
            startNew();
            setMessage("Record deleted.");
            await loadRecords();
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="admin-page">
            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">{eyebrow}</div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                <button type="button" className="admin-primary-action" onClick={startNew}>New {config.label.slice(0, -1).toLowerCase()}</button>
            </header>

            <div className="admin-crud-layout">
                <section className="admin-panel admin-record-list" aria-label={`${title} list`}>
                    <div className="admin-list-controls">
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}`} aria-label={`Search ${title.toLowerCase()}`} />
                        {!config.singleton && <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter publication status">
                            <option value="all">All status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>}
                    </div>
                    {isLoading ? <p className="admin-empty-state">Loading records…</p> : records.length ? (
                        <ul className="admin-records">
                            {records.map((item) => (
                                <li key={item.id}>
                                    <button type="button" className={item.id === selectedId ? "is-selected" : ""} onClick={() => selectRecord(item)}>
                                        <strong>{item.title || item.name || item.position || item.institution || item.site_name || "Untitled"}</strong>
                                        <span>{item.is_published === false ? "Draft" : "Published"}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="admin-empty-state">No records yet. Create the first one.</p>}
                </section>

                <section className="admin-panel admin-editor-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <div className="admin-eyebrow">EDITOR / {selectedId ? "UPDATE" : "CREATE"}</div>
                            <h2>{recordLabel}</h2>
                        </div>
                        {selectedId && !config.singleton && <button type="button" className="admin-danger-action" onClick={deleteRecord} disabled={isSaving}>Delete</button>}
                    </div>

                    {error && <p className="admin-form-error" role="alert">{error}</p>}
                    {message && <p className="admin-form-success" role="status">{message}</p>}

                    <form className="admin-editor-form" onSubmit={saveRecord}>
                        {config.fields.map((field) => {
                            const value = record[field.name];
                            if (field.type === "checkbox") return (
                                <label className="admin-checkbox-field" key={field.name}>
                                    <input type="checkbox" checked={Boolean(value)} onChange={(event) => updateField(field, event.target.checked)} />
                                    <span>{field.label}</span>
                                </label>
                            );

                            if (field.type === "textarea" || field.type === "json") return (
                                <label key={field.name}>
                                    <span>{field.label}{field.required ? " *" : ""}</span>
                                    <textarea rows={field.type === "json" ? 6 : 4} value={formatValue(field, value)} onChange={(event) => updateField(field, event.target.value)} required={field.required} />
                                </label>
                            );

                            if (field.type === "media") return (
                                <label key={field.name}>
                                    <span>{field.label}{field.required ? " *" : ""}</span>
                                    <input type="file" accept={field.accept} onChange={(event) => uploadMedia(field, event)} disabled={uploadingField === field.name || isSaving} />
                                    {value && <a className="admin-media-link" href={value} target="_blank" rel="noreferrer">{uploadingField === field.name ? "Uploading…" : "Open current asset"}</a>}
                                </label>
                            );

                            return (
                                <label key={field.name}>
                                    <span>{field.label}{field.required ? " *" : ""}</span>
                                    <input
                                        type={field.type === "media" ? "url" : field.type}
                                        value={formatValue(field, value)}
                                        onChange={(event) => updateField(field, event.target.value)}
                                        placeholder={field.type === "array" ? "Comma-separated values" : ""}
                                        required={field.required}
                                    />
                                </label>
                            );
                        })}
                        <div className="admin-editor-actions">
                            <button type="submit" className="admin-primary-action" disabled={isSaving}>{isSaving ? "Saving…" : "Save changes"}</button>
                            {dirty && <span className="admin-unsaved-indicator">Unsaved changes</span>}
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
