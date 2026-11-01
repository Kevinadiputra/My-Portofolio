"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
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

    useEffect(() => {
        if (unauthorized) {
            // Ensure non-admin sessions are cleanly terminated
            try {
                const supabase = createSupabaseBrowserClient();
                supabase.auth.signOut();
            } catch {
                // Ignore if env not configured
            }
        }
    }, [unauthorized]);

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setError("");
        setIsSubmitting(true);

        try {
            const supabase = createSupabaseBrowserClient();
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (signInError) {
                setError("Email atau password tidak valid.");
                return;
            }

            router.replace("/admin");
            router.refresh();
        } catch {
            setError(
                "Login belum dapat digunakan. Pastikan environment variable NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY sudah dikonfigurasi."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="admin-auth-shell">
            <section className="admin-auth-card" aria-labelledby="admin-login-title">
                <div className="flex items-center justify-between">
                    <div className="admin-eyebrow">PRIVATE CONTROL ROOM</div>
                    <Lock size={14} className="text-accent" />
                </div>
                <h1 id="admin-login-title">Admin Access</h1>
                <p className="mt-2 text-sm">
                    Kelola seluruh konten portofolio melalui sesi Supabase yang divalidasi di sisi server.
                </p>

                {unauthorized && (
                    <p className="admin-form-error" role="alert">
                        Akses ditolak: akun ini tidak terdaftar di tabel <code>admin_profiles</code>.
                    </p>
                )}
                {configurationError && (
                    <p className="admin-form-error" role="alert">
                        Supabase belum dikonfigurasi pada environment server. Tambahkan variabel environment dan jalankan migrasi SQL terlebih dahulu.
                    </p>
                )}
                {error && (
                    <p className="admin-form-error" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="admin-form">
                    <label htmlFor="admin-email">Email</label>
                    <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        placeholder="admin@domain.com"
                        disabled={isSubmitting}
                        required
                    />

                    <label htmlFor="admin-password">Password</label>
                    <input
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        disabled={isSubmitting}
                        required
                    />

                    <button type="submit" className="admin-submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "Authenticating…" : "Sign in to Dashboard"}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-mono text-xs text-white/55 hover:text-accent transition-colors"
                    >
                        <ArrowLeft size={13} />
                        <span>Back to public portfolio</span>
                    </Link>
                </div>
            </section>
        </main>
    );
}
