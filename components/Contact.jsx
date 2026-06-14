"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Github, Linkedin, Mail, Phone, Send, X } from "lucide-react";
import { useProfile } from "@/context/ProfileContext";
import { motion } from "framer-motion";

const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const Contact = () => {
    const { profile } = useProfile();
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, type: "success", message: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = (type, message) => {
        setNotification({ show: true, type, message });
        setTimeout(() => setNotification({ show: false, type: "success", message: "" }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const mailtoUrl = `mailto:${profile?.email || "kevinadiputra1704@gmail.com"}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
                `Hi ${profile?.name?.split(" ")[0] || "Kevin"},\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
            )}`;

            window.open(mailtoUrl, "_blank");
            setFormData({ name: "", email: "", subject: "", message: "" });
            showNotification("success", "Your email client is open with the message ready to send.");
            setIsSubmitting(false);
        }, 500);
    };

    const contactInfo = [
        { icon: Mail, title: "Email", content: profile?.email || "kevinadiputra1704@gmail.com", link: `mailto:${profile?.email || "kevinadiputra1704@gmail.com"}` },
        { icon: Phone, title: "Phone", content: profile?.phone || "+62 859-3000-7017", link: `tel:${(profile?.phone || "+628593007017").replace(/\s|-/g, "")}` },
    ];

    const socialLinks = [
        { icon: Github, href: profile?.github || "https://github.com/Kevinadiputra", label: "GitHub" },
        { icon: Linkedin, href: profile?.linkedin || "https://www.linkedin.com/in/kevin-adiputra-mahesa-8339911b3/", label: "LinkedIn" },
    ];

    return (
        <section id="contact" className="relative bg-primary py-24">
            <div className="section-shell">
                <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="section-kicker mb-3">Contact</p>
                        <motion.h2
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeUpVariants}
                            className="h2 mb-4 text-white"
                        >
                            Let's build something useful
                        </motion.h2>
                        <p className="section-copy">
                            Share the problem, dataset, or prototype idea. I will respond with a
                            practical next step.
                        </p>
                    </div>
                    <div className="hidden h-px w-32 bg-accent/40 lg:block" />
                </div>

                <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
                    <div className="space-y-7">
                        <div className="glass-panel rounded-none p-6">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="h-3 w-3 rounded-none bg-accent" />
                                <span className="font-semibold text-white">Available for projects</span>
                            </div>
                            <p className="text-sm leading-relaxed text-white/70">
                                Open to ML consulting, data science prototypes, dashboards,
                                and research collaboration.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {contactInfo.map((info) => {
                                const Icon = info.icon;
                                return (
                                    <a key={info.title} href={info.link} className="surface-card flex items-center gap-4 p-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-none border border-accent/20 bg-accent/10 text-accent">
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white">{info.title}</h4>
                                            <p className="text-sm text-white/60">{info.content}</p>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>

                        <div>
                            <h4 className="mb-4 font-semibold text-white">Social profiles</h4>
                            <div className="flex gap-4">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-12 w-12 items-center justify-center rounded-none border border-white/5 hover:border-accent/30 bg-tertiary transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:text-primary"
                                            aria-label={social.label}
                                        >
                                            <Icon size={20} />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-none p-6 md:p-8">
                        <h3 className="h4 mb-6 text-white">Send a message</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/70">Name *</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="input-control" placeholder="Your name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/70">Email *</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input-control" placeholder="you@example.com" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-white/70">Subject *</label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="input-control" placeholder="Project, role, or collaboration" />
                            </div>

                            <div>
                                <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/70">Message *</label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className="input-control resize-none" placeholder="Tell me what you are trying to solve." />
                            </div>

                            <button type="submit" disabled={isSubmitting} className={`btn btn-accent w-full gap-2 ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}>
                                {isSubmitting ? (
                                    <>
                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                                        Preparing email
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {notification.show && (
                    <div className={`fixed bottom-8 right-4 z-50 max-w-md rounded-none border p-4 shadow-2xl md:right-8 ${
                        notification.type === "success"
                            ? "border-accent/40 bg-secondary text-white"
                            : "border-red-400/40 bg-red-950 text-white"
                    }`}>
                        <div className="flex items-start gap-3">
                            {notification.type === "success" ? <CheckCircle size={20} className="text-accent" /> : <AlertCircle size={20} className="text-red-300" />}
                            <p className="flex-1 text-sm font-medium">{notification.message}</p>
                            <button onClick={() => setNotification({ show: false, type: "success", message: "" })} className="text-white/70 hover:text-white" aria-label="Dismiss notification">
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Contact;
