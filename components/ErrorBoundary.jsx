"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="border border-red-500/20 bg-red-950/10 p-8 text-center rounded-none my-6 font-mono text-xs uppercase tracking-wider">
                    <AlertTriangle size={24} className="text-red-400 mx-auto mb-4 animate-pulse" />
                    <h4 className="text-white font-semibold mb-2">Component Load Failure</h4>
                    <p className="text-white/40 mb-4 normal-case tracking-normal">
                        {this.state.error?.message || "An unexpected error occurred rendering this section."}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                        Try Reloading Section
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
