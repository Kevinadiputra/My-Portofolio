import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionLog = new Map();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    name: { min: 2, max: 120, label: "Nama" },
    email: { min: 5, max: 254, label: "Email" },
    subject: { min: 1, max: 160, label: "Subjek" },
    message: { min: 10, max: 5000, label: "Pesan" },
};

function noStoreJson(body, status = 200) {
    return NextResponse.json(body, {
        status,
        headers: { "Cache-Control": "no-store, max-age=0" },
    });
}

function readText(value, max) {
    if (typeof value !== "string") return "";
    return value.replace(/\r\n/g, "\n").trim().slice(0, max);
}

function getClientKey(request) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip");
    return ip || "unknown";
}

function isRateLimited(clientKey) {
    const now = Date.now();
    const timestamps = (submissionLog.get(clientKey) || []).filter(
        (stamp) => now - stamp < RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
        submissionLog.set(clientKey, timestamps);
        return true;
    }

    timestamps.push(now);
    submissionLog.set(clientKey, timestamps);

    if (submissionLog.size > 500) {
        for (const [key, stamps] of submissionLog.entries()) {
            if (stamps.every((stamp) => now - stamp >= RATE_LIMIT_WINDOW_MS)) {
                submissionLog.delete(key);
            }
        }
    }

    return false;
}

function validateMessage(payload) {
    const errors = {};

    for (const [field, limit] of Object.entries(LIMITS)) {
        const value = payload[field];
        if (value.length < limit.min) {
            errors[field] = `${limit.label} minimal ${limit.min} karakter.`;
        } else if (value.length > limit.max) {
            errors[field] = `${limit.label} maksimal ${limit.max} karakter.`;
        }
    }

    if (!errors.email && !EMAIL_PATTERN.test(payload.email)) {
        errors.email = "Format email tidak valid.";
    }

    return errors;
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return noStoreJson({ error: "Permintaan tidak valid." }, 400);
    }

    if (!body || typeof body !== "object") {
        return noStoreJson({ error: "Permintaan tidak valid." }, 400);
    }

    // Honeypot: real visitors never fill this hidden field.
    if (readText(body.website, 200)) {
        return noStoreJson({ ok: true }, 201);
    }

    const payload = {
        name: readText(body.name, LIMITS.name.max),
        email: readText(body.email, LIMITS.email.max).toLowerCase(),
        subject: readText(body.subject, LIMITS.subject.max),
        message: readText(body.message, LIMITS.message.max),
    };

    const errors = validateMessage(payload);
    if (Object.keys(errors).length > 0) {
        return noStoreJson(
            { error: Object.values(errors)[0], fieldErrors: errors },
            400
        );
    }

    const clientKey = getClientKey(request);
    if (isRateLimited(clientKey)) {
        return noStoreJson(
            { error: "Terlalu banyak pesan terkirim. Silakan coba lagi beberapa menit lagi." },
            429
        );
    }

    const supabase = createPublicSupabaseClient();
    if (!supabase) {
        return noStoreJson(
            { error: "Formulir kontak belum dikonfigurasi. Silakan hubungi lewat email secara langsung." },
            503
        );
    }

    const userAgent = readText(request.headers.get("user-agent") || "", 500);
    const sourcePage = readText(body.sourcePage, 200);

    const { error } = await supabase.from("contact_messages").insert({
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message,
        source_page: sourcePage || null,
        user_agent: userAgent || null,
    });

    if (error) {
        if (error.code === "42501" || error.code === "23514") {
            return noStoreJson(
                { error: "Pesan tidak lolos validasi server. Periksa kembali isi formulir." },
                400
            );
        }
        return noStoreJson(
            { error: "Gagal mengirim pesan. Silakan coba lagi atau hubungi lewat email." },
            500
        );
    }

    return noStoreJson({ ok: true }, 201);
}

export async function GET() {
    return noStoreJson({ error: "Metode tidak diizinkan." }, 405);
}
