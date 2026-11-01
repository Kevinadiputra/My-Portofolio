import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-primary text-white flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    <FileQuestion size={16} />
                    <span>Error 404</span>
                </div>

                <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                    This page could not be found.
                </h1>

                <p className="mt-4 max-w-xl text-white/65 font-body text-sm sm:text-base leading-relaxed">
                    The URL you followed may be outdated, or the case study was renamed. Use the
                    links below to get back to the portfolio content.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 border border-accent bg-accent hover:bg-accent-hover text-primary px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Homepage</span>
                    </Link>
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 border border-white/20 hover:border-accent hover:text-accent bg-secondary/70 px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                        <span>Browse Projects</span>
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div className="mt-12 border-t border-white/10 pt-6 font-mono text-[11px] uppercase tracking-wider text-white/35">
                    Kevin Adiputra Mahesa · Data Science, Machine Learning &amp; MLOps
                </div>
            </div>
        </div>
    );
}
