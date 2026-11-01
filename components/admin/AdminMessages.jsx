"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertCircle,
    Archive,
    ArrowLeft,
    CheckCircle2,
    Inbox,
    Mail,
    MailOpen,
    RefreshCw,
    Search,
    Trash2,
    X,
} from "lucide-react";

const FILTERS = [
    { key: "new", label: "Belum dibaca" },
    { key: "read", label: "Sudah dibaca" },
    { key: "archived", label: "Arsip" },
    { key: "all", label: "Semua" },
];

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [counts, setCounts] = useState({ new: 0, read: 0, archived: 0, total: 0 });
    const [status, setStatus] = useState("new");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [busyId, setBusyId] = useState(null);
    const requestRef = useRef(0);

    const showToast = useCallback((type, text) => {
        setToast({ type, text, id: Date.now() });
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const loadMessages = useCallback(async () => {
        const requestId = requestRef.current + 1;
        requestRef.current = requestId;
        setIsLoading(true);

        try {
            const params = new URLSearchParams({ status, page: String(page), pageSize: "20" });
            if (debouncedQuery) params.set("q", debouncedQuery);

            const response = await fetch(`/api/admin/messages?${params.toString()}`, {
                cache: "no-store",
            });
            const payload = await response.json().catch(() => ({}));

            if (requestRef.current !== requestId) return;

            if (!response.ok) {
                throw new Error(payload.error || "Gagal memuat pesan masuk.");
            }

            setMessages(payload.data || []);
            setCounts(payload.counts || { new: 0, read: 0, archived: 0, total: 0 });
            setTotalPages(payload.totalPages || 1);
            setSelectedId((current) => {
                if (current && (payload.data || []).some((item) => item.id === current)) {
                    return current;
                }
                return payload.data?.[0]?.id ?? null;
            });
        } catch (error) {
            if (requestRef.current !== requestId) return;
            setMessages([]);
            showToast("error", error.message || "Kesalahan jaringan saat memuat pesan.");
        } finally {
            if (requestRef.current === requestId) setIsLoading(false);
        }
    }, [status, page, debouncedQuery, showToast]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const selected = useMemo(
        () => messages.find((item) => item.id === selectedId) || null,
        [messages, selectedId]
    );

    const updateStatus = useCallback(
        async (message, nextStatus) => {
            setBusyId(message.id);
            try {
                const response = await fetch("/api/admin/messages", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: message.id, status: nextStatus }),
                });
                const payload = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(payload.error || "Gagal memperbarui pesan.");
                }

                const updated = payload.data;
                setMessages((current) =>
                    current.map((item) => (item.id === message.id ? { ...item, ...updated } : item))
                );
                showToast(
                    "success",
                    nextStatus === "archived"
                        ? "Pesan dipindahkan ke arsip."
                        : nextStatus === "new"
                        ? "Pesan ditandai belum dibaca."
                        : "Pesan ditandai sudah dibaca."
                );
                loadMessages();
            } catch (error) {
                showToast("error", error.message || "Gagal memperbarui pesan.");
            } finally {
                setBusyId(null);
            }
        },
        [loadMessages, showToast]
    );

    const markAsRead = useCallback(
        (message) => {
            if (!message || message.status !== "new" || busyId === message.id) return;
            updateStatus(message, "read");
        },
        [busyId, updateStatus]
    );

    const handleSelect = useCallback(
        (message) => {
            setSelectedId(message.id);
            markAsRead(message);
        },
        [markAsRead]
    );

    const deleteMessage = useCallback(async () => {
        if (!confirmDelete) return;
        const target = confirmDelete;
        setBusyId(target.id);
        try {
            const response = await fetch("/api/admin/messages", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: target.id }),
            });
            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(payload.error || "Gagal menghapus pesan.");
            }

            setConfirmDelete(null);
            setSelectedId(null);
            showToast("success", "Pesan berhasil dihapus permanen.");
            loadMessages();
        } catch (error) {
            showToast("error", error.message || "Gagal menghapus pesan.");
        } finally {
            setBusyId(null);
        }
    }, [confirmDelete, loadMessages, showToast]);

    useEffect(() => {
        if (!confirmDelete) return undefined;
        const onKeyDown = (event) => {
            if (event.key === "Escape") setConfirmDelete(null);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [confirmDelete]);

    return (
        <div className="admin-page">
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

            <header className="admin-page-header">
                <div>
                    <div className="admin-eyebrow">OPERATIONS / INBOX</div>
                    <h1>Messages</h1>
                    <p>
                        Pesan yang dikirim melalui formulir kontak website. {counts.new} pesan belum
                        dibaca dari {counts.total} total pesan.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <button
                        type="button"
                        className="admin-secondary-action inline-flex items-center gap-2"
                        onClick={loadMessages}
                        disabled={isLoading}
                    >
                        <RefreshCw size={15} className={isLoading ? "animate-spin" : undefined} />
                        Refresh
                    </button>
                </div>
            </header>

            <div className="admin-list-controls">
                <label className="flex-1 min-w-[220px]">
                    <span className="sr-only">Cari pesan</span>
                    <div className="relative">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari nama, email, subjek, atau isi pesan"
                            className="w-full pl-9"
                        />
                    </div>
                </label>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter status pesan">
                    {FILTERS.map((filter) => (
                        <button
                            key={filter.key}
                            type="button"
                            onClick={() => {
                                setStatus(filter.key);
                                setPage(1);
                            }}
                            aria-pressed={status === filter.key}
                            className={`admin-secondary-action text-xs ${
                                status === filter.key ? "is-active !border-accent/60 !text-white" : ""
                            }`}
                        >
                            {filter.label}
                            <span className="ml-1.5 font-mono text-[11px] text-white/50">
                                {filter.key === "all" ? counts.total : counts[filter.key]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <section className="admin-crud-layout" aria-label="Inbox pesan kontak">
                <div className="admin-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <div className="admin-eyebrow">MESSAGE LIST</div>
                            <h2>{FILTERS.find((filter) => filter.key === status)?.label || "Semua"}</h2>
                        </div>
                        {isLoading && <span className="font-mono text-[11px] text-white/40">Memuat…</span>}
                    </div>

                    {isLoading && messages.length === 0 ? (
                        <ul className="mt-4 space-y-3" aria-hidden="true">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <li key={index} className="h-16 animate-pulse bg-white/[0.04]" />
                            ))}
                        </ul>
                    ) : messages.length === 0 ? (
                        <p className="admin-empty-state mt-4">
                            {debouncedQuery
                                ? "Tidak ada pesan yang cocok dengan pencarian."
                                : status === "new"
                                ? "Tidak ada pesan baru. Kotak masuk bersih."
                                : "Belum ada pesan pada kategori ini."}
                        </p>
                    ) : (
                        <ul className="mt-4 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                            {messages.map((message) => {
                                const isSelected = message.id === selectedId;
                                const isUnread = message.status === "new";
                                return (
                                    <li key={message.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(message)}
                                            aria-current={isSelected ? "true" : undefined}
                                            className={`w-full text-left p-3 border transition-colors ${
                                                isSelected
                                                    ? "border-accent/50 bg-white/[0.06]"
                                                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className="inline-flex items-center gap-2 min-w-0">
                                                    {isUnread ? (
                                                        <Mail size={14} className="shrink-0 text-accent" />
                                                    ) : (
                                                        <MailOpen size={14} className="shrink-0 text-white/40" />
                                                    )}
                                                    <strong
                                                        className={`truncate text-sm ${
                                                            isUnread ? "text-white" : "text-white/70"
                                                        }`}
                                                    >
                                                        {message.name}
                                                    </strong>
                                                </span>
                                                <time
                                                    dateTime={message.created_at}
                                                    className="shrink-0 font-mono text-[10px] text-white/40"
                                                >
                                                    {formatDate(message.created_at)}
                                                </time>
                                            </div>
                                            <div className="mt-1 text-xs text-white/60 truncate">
                                                {message.subject || "(tanpa subjek)"}
                                            </div>
                                            <div className="mt-0.5 text-xs text-white/35 truncate">
                                                {message.email}
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                className="admin-secondary-action text-xs"
                                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                                disabled={page <= 1 || isLoading}
                            >
                                ← Sebelumnya
                            </button>
                            <span className="font-mono text-[11px] text-white/45">
                                Halaman {page} / {totalPages}
                            </span>
                            <button
                                type="button"
                                className="admin-secondary-action text-xs"
                                onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                                disabled={page >= totalPages || isLoading}
                            >
                                Berikutnya →
                            </button>
                        </div>
                    )}
                </div>

                <div className="admin-editor-panel">
                    {selected ? (
                        <article aria-labelledby="message-detail-title">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <div className="admin-eyebrow">
                                        {selected.status === "new"
                                            ? "BELUM DIBACA"
                                            : selected.status === "archived"
                                            ? "ARSIP"
                                            : "SUDAH DIBACA"}
                                    </div>
                                    <h2 id="message-detail-title" className="mt-1 break-words">
                                        {selected.subject || "(tanpa subjek)"}
                                    </h2>
                                    <p className="text-sm mt-1 break-all">
                                        <a href={`mailto:${selected.email}`} className="hover:text-accent transition-colors">
                                            {selected.email}
                                        </a>
                                        <span className="text-white/30"> · </span>
                                        {selected.name}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {selected.status !== "read" && selected.status !== "archived" && (
                                        <button
                                            type="button"
                                            className="admin-secondary-action text-xs inline-flex items-center gap-1.5"
                                            onClick={() => updateStatus(selected, "read")}
                                            disabled={busyId === selected.id}
                                        >
                                            <MailOpen size={14} /> Tandai dibaca
                                        </button>
                                    )}
                                    {selected.status !== "archived" ? (
                                        <button
                                            type="button"
                                            className="admin-secondary-action text-xs inline-flex items-center gap-1.5"
                                            onClick={() => updateStatus(selected, "archived")}
                                            disabled={busyId === selected.id}
                                        >
                                            <Archive size={14} /> Arsipkan
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="admin-secondary-action text-xs inline-flex items-center gap-1.5"
                                            onClick={() => updateStatus(selected, "new")}
                                            disabled={busyId === selected.id}
                                        >
                                            <ArrowLeft size={14} /> Kembalikan
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="admin-danger-action text-xs inline-flex items-center gap-1.5"
                                        onClick={() => setConfirmDelete(selected)}
                                        disabled={busyId === selected.id}
                                    >
                                        <Trash2 size={14} /> Hapus
                                    </button>
                                </div>
                            </div>

                            <dl className="mt-6 grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <dt className="admin-eyebrow">DITERIMA</dt>
                                    <dd className="mt-1 font-mono text-white/70">
                                        {formatDate(selected.created_at)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="admin-eyebrow">HALAMAN ASAL</dt>
                                    <dd className="mt-1 font-mono text-white/70 break-all">
                                        {selected.source_page || "—"}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <div className="admin-eyebrow">ISI PESAN</div>
                                <p className="mt-3 text-sm text-white/80 leading-relaxed whitespace-pre-line break-words">
                                    {selected.message}
                                </p>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-2.5">
                                <a
                                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                                        `Re: ${selected.subject || "Pesan dari website"}`
                                    )}`}
                                    className="admin-primary-action inline-flex items-center gap-2"
                                >
                                    <Mail size={15} /> Balas via Email
                                </a>
                            </div>
                        </article>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-16">
                            <Inbox size={30} className="text-white/25" aria-hidden="true" />
                            <p className="admin-empty-state mt-4">
                                Pilih salah satu pesan untuk melihat detailnya.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {confirmDelete && (
                <div
                    className="admin-modal-backdrop"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="admin-delete-message-title"
                >
                    <div className="admin-modal-card">
                        <div className="admin-eyebrow">CONFIRM DELETE</div>
                        <h3 id="admin-delete-message-title" className="text-lg font-display font-bold text-white mt-1">
                            Hapus pesan ini?
                        </h3>
                        <p className="text-sm text-white/70 mt-2 leading-relaxed">
                            Pesan dari <strong className="text-white/90">{confirmDelete.name}</strong> (
                            {confirmDelete.email}) akan dihapus permanen dan tidak dapat dikembalikan.
                        </p>
                        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                className="admin-secondary-action"
                                onClick={() => setConfirmDelete(null)}
                                disabled={busyId === confirmDelete.id}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="admin-danger-action"
                                onClick={deleteMessage}
                                disabled={busyId === confirmDelete.id}
                            >
                                {busyId === confirmDelete.id ? "Menghapus…" : "Hapus permanen"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
