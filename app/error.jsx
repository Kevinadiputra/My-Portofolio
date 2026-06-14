"use client";

import { useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error("Root Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-[#0b0b12] text-white flex flex-col items-center justify-center p-8 text-center font-mono">
            <span className="text-accent text-5xl mb-6 font-display font-extrabold animate-pulse">ERROR</span>
            <h1 className="text-xl uppercase tracking-widest text-white/90 mb-4">Application Encountered an Issue</h1>
            <p className="text-white/50 text-sm max-w-md mb-8 normal-case tracking-normal">
                {error?.message || "A runtime exception occurred during rendering or client-side navigation."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
                <button 
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent hover:text-primary px-6 py-3 text-xs uppercase tracking-widest transition-colors font-bold font-mono"
                >
                    <RefreshCw size={14} />
                    Try Resetting
                </button>
                <button 
                    onClick={() => window.location.href = "/"}
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-accent hover:text-accent px-6 py-3 text-xs uppercase tracking-widest transition-colors bg-white/[0.02] font-mono"
                >
                    <ArrowLeft size={14} />
                    Go to Homepage
                </button>
            </div>
        </div>
    );
}
