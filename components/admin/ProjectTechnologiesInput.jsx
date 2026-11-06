"use client";

import { useState } from "react";
import { Plus, Tag, X } from "lucide-react";

const SUGGESTED_TECH = [
    "Python",
    "Machine Learning",
    "Deep Learning",
    "Scikit-Learn",
    "PyTorch",
    "TensorFlow",
    "MLflow",
    "Docker",
    "FastAPI",
    "Apache Airflow",
    "PostgreSQL",
    "Pandas",
    "NumPy",
    "Next.js",
    "Tailwind CSS",
    "SQL",
];

export default function ProjectTechnologiesInput({
    technologies = [],
    onChange,
}) {
    const [inputValue, setInputValue] = useState("");

    const currentTags = Array.isArray(technologies) ? technologies : [];

    function addTag(tag) {
        const clean = tag.trim();
        if (!clean) return;
        if (currentTags.some((t) => t.toLowerCase() === clean.toLowerCase())) {
            setInputValue("");
            return;
        }
        onChange([...currentTags, clean]);
        setInputValue("");
    }

    function removeTag(indexToRemove) {
        onChange(currentTags.filter((_, idx) => idx !== indexToRemove));
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && currentTags.length > 0) {
            removeTag(currentTags.length - 1);
        }
    }

    return (
        <div className="space-y-2.5 w-full min-w-0">
            {/* Input Box with chips inside */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-primary border border-white/10 min-h-[44px] focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/30 transition-all">
                {currentTags.map((tech, idx) => (
                    <span
                        key={`${tech}-${idx}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono bg-accent/15 text-accent border border-accent/30 tracking-wide"
                    >
                        <span>{tech}</span>
                        <button
                            type="button"
                            onClick={() => removeTag(idx)}
                            className="hover:text-white p-0.5 ml-0.5 rounded-full transition-colors"
                            aria-label={`Remove ${tech}`}
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                <div className="flex-1 min-w-[140px] flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentTags.length === 0 ? "Ketik teknologi lalu tekan Enter atau koma (e.g. Python)" : "Tambah lagi..."}
                        className="w-full bg-transparent border-none text-white text-xs font-body focus:outline-none placeholder:text-white/35 py-1 px-1"
                    />
                    {inputValue.trim() && (
                        <button
                            type="button"
                            onClick={() => addTag(inputValue)}
                            className="px-2 py-0.5 bg-accent text-primary text-[11px] font-mono font-bold shrink-0 hover:bg-accent/90"
                        >
                            + Add
                        </button>
                    )}
                </div>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-white/40 mr-1 flex items-center gap-1">
                    <Tag size={11} /> Saran:
                </span>
                {SUGGESTED_TECH.filter(
                    (item) => !currentTags.some((t) => t.toLowerCase() === item.toLowerCase())
                )
                    .slice(0, 8)
                    .map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => addTag(item)}
                            className="text-[11px] font-mono px-2 py-0.5 bg-white/[0.04] hover:bg-accent/20 hover:text-accent border border-white/10 hover:border-accent/40 text-white/60 transition-colors"
                        >
                            + {item}
                        </button>
                    ))}
            </div>
        </div>
    );
}
