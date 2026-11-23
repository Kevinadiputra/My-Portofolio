import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

// Prevent Next.js or edge caching so each ping executes a genuine database query on PostgreSQL
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Supabase Keep-Alive Health Endpoint
 * 
 * Purpose:
 * Prevents Supabase Free Tier projects from being automatically paused
 * due to 7 days of inactivity by executing a lightweight read query.
 * 
 * Can be triggered via:
 * 1. GitHub Actions scheduled workflow (.github/workflows/supabase-keep-alive.yml)
 * 2. Vercel Cron Jobs (vercel.json)
 * 3. External uptime monitoring services (CronJob.org, UptimeRobot, etc.)
 */
export async function GET(request) {
    const startTime = Date.now();

    // Verify optional Authorization header if CRON_SECRET is defined in environment
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json(
                { error: "Unauthorized cron ping request." },
                { status: 401 }
            );
        }
    }

    try {
        const supabase = createPublicSupabaseClient();
        if (!supabase) {
            return NextResponse.json(
                {
                    status: "error",
                    message: "Supabase environment variables are not configured.",
                    timestamp: new Date().toISOString(),
                },
                { status: 500 }
            );
        }

        // Execute a fast, indexed read query on the projects table
        const { data, error } = await supabase
            .from("projects")
            .select("id, slug, updated_at")
            .limit(1);

        const latencyMs = Date.now() - startTime;

        if (error) {
            console.error("[Supabase Keep-Alive] Query error:", error.message);
            return NextResponse.json(
                {
                    status: "degraded",
                    message: error.message,
                    latencyMs,
                    timestamp: new Date().toISOString(),
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                status: "ok",
                service: "supabase-keep-alive",
                target: "projects",
                recordsRetrieved: data ? data.length : 0,
                latencyMs,
                timestamp: new Date().toISOString(),
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
                    "Pragma": "no-cache",
                    "Expires": "0",
                },
            }
        );
    } catch (err) {
        console.error("[Supabase Keep-Alive] Unexpected exception:", err);
        return NextResponse.json(
            {
                status: "error",
                message: err instanceof Error ? err.message : "Internal server error",
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
