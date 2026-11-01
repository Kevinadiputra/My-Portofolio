"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSeedButton({ hasData }) {
    const router = useRouter();
    const [isSeeding, setIsSeeding] = useState(false);
    const [status, setStatus] = useState(null);

    async function handleSeed() {
        if (isSeeding) return;
        setIsSeeding(true);
        setStatus(null);

        try {
            const response = await fetch("/api/admin/seed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Gagal menyinkronkan data.");
            }
            setStatus({ type: "success", text: result.message || "Data awal berhasil disinkronkan." });
            router.refresh();
        } catch (err) {
            setStatus({
                type: "error",
                text: err instanceof Error ? err.message : "Terjadi kesalahan jaringan saat sinkronisasi.",
            });
        } finally {
            setIsSeeding(false);
        }
    }

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-accent">
                        Database Sync
                    </div>
                    <p className="text-xs text-white/60 mt-0.5">
                        {hasData
                            ? "Sinkronkan ulang item bawaan yang belum ada tanpa menimpa perubahan yang sudah diedit."
                            : "Database masih kosong. Impor seluruh proyek, sertifikat, pengalaman, pendidikan, skill, dan profil awal ke Supabase."}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleSeed}
                    disabled={isSeeding}
                    className="admin-secondary-action shrink-0"
                >
                    <Database size={14} />
                    <span>{isSeeding ? "Syncing…" : hasData ? "Sync Default Data" : "Seed Initial Data"}</span>
                </button>
            </div>

            {status && (
                <div
                    role={status.type === "error" ? "alert" : "status"}
                    className={status.type === "error" ? "admin-form-error mt-3" : "admin-form-success mt-3"}
                >
                    <div className="flex items-center gap-2">
                        {status.type === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                        <span>{status.text}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
