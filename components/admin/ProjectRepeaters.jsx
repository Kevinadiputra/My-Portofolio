"use client";

import { Plus, Trash2 } from "lucide-react";

/**
 * Visual repeater for Key Learnings
 * Serializes to: string[]
 */
export function KeyLearningsRepeater({ learnings = [], onChange }) {
    const items = Array.isArray(learnings) ? learnings : [];

    function addItem() {
        onChange([...items, ""]);
    }

    function updateItem(index, value) {
        const next = [...items];
        next[index] = value;
        onChange(next);
    }

    function removeItem(index) {
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-2.5 w-full min-w-0">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2 w-full min-w-0">
                    <span className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 text-accent font-mono text-xs shrink-0">
                        {index + 1}
                    </span>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItem(index, e.target.value)}
                        placeholder="e.g. Decoupling preprocessing from inference prevents training-serving skew."
                        className="admin-input flex-1 min-w-0 text-xs"
                    />
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="admin-icon-btn h-9 w-9 text-red-400 hover:border-red-400/50 shrink-0"
                        title="Hapus learning ini"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="admin-secondary-action w-full justify-center text-xs py-2 mt-1"
            >
                <Plus size={13} />
                <span>+ Add Key Learning</span>
            </button>
        </div>
    );
}

/**
 * Visual repeater for Verifiable Engineering Metrics
 * Serializes to: { label: string, value: string, description: string }[]
 */
export function MetricsRepeater({ metrics = [], onChange }) {
    let parsedItems = [];
    if (Array.isArray(metrics)) {
        parsedItems = metrics;
    } else if (typeof metrics === "string" && metrics.trim()) {
        try {
            const p = JSON.parse(metrics);
            parsedItems = Array.isArray(p) ? p : [];
        } catch {
            parsedItems = [];
        }
    }

    function addMetric() {
        onChange([...parsedItems, { label: "", value: "", description: "" }]);
    }

    function updateMetric(index, field, val) {
        const next = [...parsedItems];
        next[index] = { ...next[index], [field]: val };
        onChange(next);
    }

    function removeMetric(index) {
        onChange(parsedItems.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3 w-full min-w-0">
            {parsedItems.map((item, index) => (
                <div
                    key={index}
                    className="p-3 bg-primary/70 border border-white/10 space-y-2 relative"
                >
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-mono text-xs text-accent font-semibold">
                            Metric #{index + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeMetric(index)}
                            className="admin-icon-btn h-6 w-6 text-red-400 hover:border-red-400/50"
                            title="Hapus metric"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label className="admin-label text-[10px]">
                                Metric Value (e.g. 97.4%, &lt; 45ms, 10M+)
                            </label>
                            <input
                                type="text"
                                value={item.value || ""}
                                onChange={(e) => updateMetric(index, "value", e.target.value)}
                                placeholder="97.4%"
                                className="admin-input text-xs"
                            />
                        </div>
                        <div>
                            <label className="admin-label text-[10px]">
                                Metric Label (e.g. F1-Score, Inference Latency)
                            </label>
                            <input
                                type="text"
                                value={item.label || ""}
                                onChange={(e) => updateMetric(index, "label", e.target.value)}
                                placeholder="Validation Accuracy / F1"
                                className="admin-input text-xs"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="admin-label text-[10px]">
                            Description / Evaluation Context
                        </label>
                        <input
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => updateMetric(index, "description", e.target.value)}
                            placeholder="Evaluated on held-out test split of 25,000 samples"
                            className="admin-input text-xs"
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addMetric}
                className="admin-secondary-action w-full justify-center text-xs py-2"
            >
                <Plus size={13} />
                <span>+ Add Verifiable Metric</span>
            </button>
        </div>
    );
}

/**
 * Visual repeater for Engineering Process Steps
 * Serializes to: { phase: string, description: string }[]
 */
export function ProcessRepeater({ process = [], onChange }) {
    let parsedItems = [];
    if (Array.isArray(process)) {
        parsedItems = process;
    } else if (typeof process === "string" && process.trim()) {
        try {
            const p = JSON.parse(process);
            parsedItems = Array.isArray(p) ? p : [];
        } catch {
            parsedItems = [];
        }
    }

    function addStep() {
        onChange([...parsedItems, { phase: "", description: "" }]);
    }

    function updateStep(index, field, val) {
        const next = [...parsedItems];
        next[index] = { ...next[index], [field]: val };
        onChange(next);
    }

    function removeStep(index) {
        onChange(parsedItems.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-3 w-full min-w-0">
            {parsedItems.map((item, index) => (
                <div
                    key={index}
                    className="p-3 bg-primary/70 border border-white/10 space-y-2 relative"
                >
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <span className="font-mono text-xs text-accent font-semibold">
                            Phase #{index + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => removeStep(index)}
                            className="admin-icon-btn h-6 w-6 text-red-400 hover:border-red-400/50"
                            title="Hapus step"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>

                    <div>
                        <label className="admin-label text-[10px]">
                            Phase Title (e.g. 01. Data Preprocessing &amp; Validation)
                        </label>
                        <input
                            type="text"
                            value={item.phase || ""}
                            onChange={(e) => updateStep(index, "phase", e.target.value)}
                            placeholder="01. Data Preprocessing & Validation"
                            className="admin-input text-xs"
                        />
                    </div>

                    <div>
                        <label className="admin-label text-[10px]">
                            Phase Scope &amp; Methodology
                        </label>
                        <textarea
                            rows={2}
                            value={item.description || ""}
                            onChange={(e) => updateStep(index, "description", e.target.value)}
                            placeholder="Detailed explanation of algorithms, frameworks, and pipeline steps executed in this phase..."
                            className="admin-input admin-textarea text-xs"
                        />
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addStep}
                className="admin-secondary-action w-full justify-center text-xs py-2"
            >
                <Plus size={13} />
                <span>+ Add Engineering Process Step</span>
            </button>
        </div>
    );
}
