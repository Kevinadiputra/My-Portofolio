"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<main className="admin-auth-shell" aria-busy="true" />}>
            <AdminLoginForm />
        </Suspense>
    );
}

function AdminLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const unauthorized = searchParams.get("error") === "unauthorized";
    const configurationError = searchParams.get("error") === "configuration";

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const supabase = createSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

            if (signInError) {
                setError("Email atau password tidak valid.");
                return;
            }

            router.replace("/admin");
            router.refresh();
        } catch {
            setError("Login belum dapat digunakan. Periksa konfigurasi Supabase terlebih dahulu.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="admin-auth-shell">
            <section className="admin-auth-card" aria-labelledby="admin-login-title">
                <div className="admin-eyebrow">PRIVATE CONTROL ROOM / 01</div>
                <h1 id="admin-login-title">Admin access</h1>
                <p>Kelola konten portfolio melalui sesi Supabase yang tervalidasi di server.</p>

                {unauthorized && <p className="admin-form-error" role="alert">Akun ini belum terdaftar sebagai admin.</p>}
                {configurationError && <p className="admin-form-error" role="alert">Admin belum dikonfigurasi. Hubungkan Supabase dan terapkan migrasi terlebih dahulu.</p>}
                {error && <p className="admin-form-error" role="alert">{error}</p>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <label htmlFor="admin-email">Email</label>
                    <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="admin-password">Password</label>
                    <input
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    <button type="submit" className="admin-submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "Authenticating…" : "Enter dashboard"}
                    </button>
                </form>
            </section>
        </main>
    );
}
