"use client";

import { useRef, useState } from "react";
import { AlertCircle, CheckCircle, Github, Linkedin, Mail, MapPin, Phone, Send, X } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { motion } from "framer-motion";

const fadeUpVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
    const { profile } = useProfile();
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [fieldErrors, setFieldErrors] = useState({});
    const [honeypot, setHoneypot] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: "success", message: "" });
    const notificationTimer = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => ({ ...current, [name]: value }));
        setFieldErrors((current) => {
            if (!current[name]) return current;
            const next = { ...current };
            delete next[name];
            return next;
        });
    };

    const showNotification = (type, message) => {
        if (notificationTimer.current) clearTimeout(notificationTimer.current);
        setNotification({ show: true, type, message });
        notificationTimer.current = setTimeout(
            () => setNotification({ show: false, type: "success", message: "" }),
            type === "error" ? 7000 : 5000
        );
    };

    const targetEmail = profile?.email || "kevinadiputra66@gmail.com";
    const targetPhone = profile?.phone || "+62 821-8185-7340";

    const mailtoHref = `mailto:${targetEmail}?subject=${encodeURIComponent(
        formData.subject || "Pesan dari website"
    )}&body=${encodeURIComponent(
        `Hi ${profile?.name?.split(" ")[0] || "Kevin"},\n\nName: ${formData.name}\nEmail: ${
            formData.email
        }\n\nMessage:\n${formData.message}`
    )}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const localErrors = {};
        if (formData.name.trim().length < 2) localErrors.name = "Nama minimal 2 karakter.";
        if (!EMAIL_PATTERN.test(formData.email.trim())) localErrors.email = "Format email tidak valid.";
        if (!formData.subject.trim()) localErrors.subject = "Subjek wajib diisi.";
        if (formData.message.trim().length < 10) localErrors.message = "Pesan minimal 10 karakter.";

        setFieldErrors(localErrors);
        if (Object.keys(localErrors).length > 0) {
            showNotification("error", "Periksa kembali isian formulir sebelum mengirim.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    website: honeypot,
                    sourcePage: typeof window !== "undefined" ? window.location.href.slice(0, 200) : "",
                }),
            });
            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (payload.fieldErrors) setFieldErrors(payload.fieldErrors);
                throw new Error(payload.error || "Gagal mengirim pesan.");
            }

            setFormData({ name: "", email: "", subject: "", message: "" });
            setHoneypot("");
            setFieldErrors({});
            showNotification(
                "success",
                "Pesan terkirim. Terima kasih — saya akan membalas melalui email."
            );
        } catch (error) {
            showNotification(
                "error",
                error.message || "Gagal mengirim pesan. Coba lagi atau kirim langsung lewat email."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: Mail,
            title: "Email",
            content: targetEmail,
            link: `mailto:${targetEmail}`,
        },
        {
            icon: Phone,
            title: "Phone / WhatsApp",
            content: targetPhone,
            link: `tel:${targetPhone.replace(/\s|-/g, "")}`,
        },
        {
            icon: MapPin,
            title: "Location",
            content: profile?.location || "Palembang, Indonesia",
            link: null,
        },
    ];

    const socialLinks = [
        {
            icon: Github,
            href: profile?.github || "https://github.com/Kevinadiputra",
            label: "GitHub",
        },
        {
            icon: Linkedin,
            href:
                profile?.linkedin ||
                "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/",
            label: "LinkedIn",
        },
    ];

    return (
        <section id="contact" className="relative bg-primary py-24">
            <div className="section-shell">
                <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent mb-2">
                            06 / Contact
                        </p>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-80px" }}
                            variants={fadeUpVariants}
                            className="h2 text-white"
                        >
                            Discuss a Role, Dataset, or Project
                        </motion.h2>
                    </div>
                    <p className="text-sm sm:text-base text-white/65 max-w-xl">
                        Open to Data Science, Machine Learning, and MLOps opportunities, internships, and technical collaborations.
                    </p>
                </div>

                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
                    <div className="space-y-6">
                        <div className="border border-white/10 bg-secondary/80 p-6">
                            <div className="mb-2 flex items-center gap-2.5">
                                <span className="h-2 w-2 bg-accent" />
                                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                                    {profile?.availabilityStatus || "Available for Projects & Roles"}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-white/70">
                                Reach out directly via email or LinkedIn to discuss machine learning systems,
                                data pipelines, or full-time/internship positions.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {contactInfo.map((info) => {
                                const Icon = info.icon;
                                const Wrapper = info.link ? "a" : "div";
                                return (
                                    <Wrapper
                                        key={info.title}
                                        {...(info.link ? { href: info.link } : {})}
                                        className="border border-white/10 bg-secondary/60 hover:border-accent/40 flex items-center gap-4 p-4 transition-colors"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center border border-accent/25 bg-accent/10 text-accent shrink-0">
                                            <Icon size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-mono uppercase tracking-wider text-white/50">
                                                {info.title}
                                            </h3>
                                            <p className="text-sm font-medium text-white truncate">
                                                {info.content}
                                            </p>
                                        </div>
                                    </Wrapper>
                                );
                            })}
                        </div>

                        <div>
                            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-white/55">
                                Direct Profiles
                            </h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/10 hover:border-accent text-xs font-mono text-white/80 hover:text-accent bg-secondary/70 transition-colors"
                                            aria-label={social.label}
                                        >
                                            <Icon size={15} />
                                            <span>{social.label}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="border border-white/10 bg-secondary/75 p-6 md:p-8">
                        <h3 className="font-display text-lg font-bold mb-5 text-white">
                            Send a Direct Message
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                                <label htmlFor="website">Website</label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website"
                                    value={honeypot}
                                    onChange={(e) => setHoneypot(e.target.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/70"
                                    >
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        aria-invalid={Boolean(fieldErrors.name)}
                                        aria-describedby={fieldErrors.name ? "name-error" : undefined}
                                        className="input-control text-sm"
                                        placeholder="Your name"
                                    />
                                    {fieldErrors.name && (
                                        <p id="name-error" className="mt-1.5 text-[11px] text-red-300">
                                            {fieldErrors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/70"
                                    >
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        aria-invalid={Boolean(fieldErrors.email)}
                                        aria-describedby={fieldErrors.email ? "email-error" : undefined}
                                        className="input-control text-sm"
                                        placeholder="you@example.com"
                                    />
                                    {fieldErrors.email && (
                                        <p id="email-error" className="mt-1.5 text-[11px] text-red-300">
                                            {fieldErrors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/70"
                                >
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    aria-invalid={Boolean(fieldErrors.subject)}
                                    aria-describedby={fieldErrors.subject ? "subject-error" : undefined}
                                    className="input-control text-sm"
                                    placeholder="Role opportunity, project, or collaboration"
                                />
                                {fieldErrors.subject && (
                                    <p id="subject-error" className="mt-1.5 text-[11px] text-red-300">
                                        {fieldErrors.subject}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-white/70"
                                >
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    aria-invalid={Boolean(fieldErrors.message)}
                                    aria-describedby={fieldErrors.message ? "message-error" : undefined}
                                    className="input-control resize-none text-sm"
                                    placeholder="Share context about the role, dataset, or problem you are working on."
                                />
                                {fieldErrors.message && (
                                    <p id="message-error" className="mt-1.5 text-[11px] text-red-300">
                                        {fieldErrors.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn btn-accent w-full gap-2 font-mono text-xs uppercase tracking-wider ${
                                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                                }`}
                            >
                                <Send size={15} />
                                <span>{isSubmitting ? "Sending…" : "Send Message"}</span>
                            </button>

                            <p className="text-center text-[11px] leading-relaxed text-white/45">
                                Trouble sending?{" "}
                                <a
                                    href={mailtoHref}
                                    className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
                                >
                                    Use your email client instead
                                </a>
                            </p>
                        </form>
                    </div>
                </div>

                {notification.show && (
                    <div
                        role="status"
                        className={`fixed bottom-8 right-4 z-50 max-w-md border p-4 shadow-2xl md:right-8 ${
                            notification.type === "success"
                                ? "border-accent/40 bg-secondary text-white"
                                : "border-red-400/40 bg-red-950 text-white"
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {notification.type === "success" ? (
                                <CheckCircle size={18} className="text-accent shrink-0 mt-0.5" />
                            ) : (
                                <AlertCircle size={18} className="text-red-300 shrink-0 mt-0.5" />
                            )}
                            <p className="flex-1 text-xs sm:text-sm font-medium">{notification.message}</p>
                            <button
                                type="button"
                                onClick={() =>
                                    setNotification({ show: false, type: "success", message: "" })
                                }
                                className="text-white/70 hover:text-white"
                                aria-label="Dismiss notification"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Contact;
