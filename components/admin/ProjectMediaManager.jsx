"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Image as ImageIcon,
    Loader2,
    RefreshCw,
    Star,
    Trash2,
    UploadCloud,
    X,
} from "lucide-react";

/**
 * Client-side image optimization helper:
 * Resizes images exceeding 1920px and compresses to WebP at ~0.86 quality.
 * Prevents hitting the 5MB Supabase Storage limit and accelerates upload speed.
 */
async function optimizeImage(file) {
    if (file.type === "image/svg+xml" || file.type === "application/pdf") {
        return file;
    }

    // Pass through already small webp or jpeg
    if (file.size < 400 * 1024 && (file.type === "image/webp" || file.type === "image/jpeg")) {
        return file;
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const MAX_DIM = 1920;
                let { width, height } = img;

                if (width > MAX_DIM || height > MAX_DIM) {
                    if (width > height) {
                        height = Math.round((height * MAX_DIM) / width);
                        width = MAX_DIM;
                    } else {
                        width = Math.round((width * MAX_DIM) / height);
                        height = MAX_DIM;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob || blob.size >= file.size) {
                            resolve(file);
                            return;
                        }
                        const optimizedName = file.name.replace(/\.[^.]+$/, ".webp");
                        const optimized = new File([blob], optimizedName, {
                            type: "image/webp",
                            lastModified: Date.now(),
                        });
                        resolve(optimized);
                    },
                    "image/webp",
                    0.86
                );
            };
            img.onerror = () => resolve(file);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

export default function ProjectMediaManager({
    thumbnailUrl = "",
    galleryUrls = [],
    onChange,
    showToast,
}) {
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadState, setUploadState] = useState({
        active: false,
        current: 0,
        total: 0,
        fileName: "",
    });
    const fileInputRef = useRef(null);
    const replaceInputRef = useRef(null);
    const [replacingId, setReplacingId] = useState(null);
    const isInitializedRef = useRef(false);

    // Initialize images from existing thumbnailUrl and galleryUrls
    useEffect(() => {
        if (isInitializedRef.current) return;
        const initial = [];

        if (thumbnailUrl && typeof thumbnailUrl === "string") {
            initial.push({
                id: `cover-${Date.now()}-0`,
                url: thumbnailUrl,
                isCover: true,
            });
        }

        if (Array.isArray(galleryUrls)) {
            galleryUrls.forEach((url, idx) => {
                if (url && typeof url === "string" && url !== thumbnailUrl) {
                    initial.push({
                        id: `gallery-${Date.now()}-${idx + 1}`,
                        url,
                        isCover: initial.length === 0, // cover if no thumbnail existed
                    });
                }
            });
        }

        setImages(initial);
        isInitializedRef.current = true;
    }, [thumbnailUrl, galleryUrls]);

    // Notify parent component whenever images change
    const syncToParent = useCallback(
        (updatedImages) => {
            const cover = updatedImages.find((img) => img.isCover) || updatedImages[0];
            const nextThumbnail = cover ? cover.url : "";
            const nextGallery = updatedImages
                .filter((img) => img.url !== nextThumbnail)
                .map((img) => img.url);

            onChange({
                thumbnail_url: nextThumbnail,
                gallery_urls: nextGallery,
            });
        },
        [onChange]
    );

    // Multi-file upload processor
    const processUploadFiles = useCallback(
        async (fileList) => {
            const validFiles = Array.from(fileList).filter((f) =>
                f.type.startsWith("image/")
            );

            if (validFiles.length === 0) {
                showToast?.("error", "Pilih berkas gambar yang valid (JPG, PNG, WebP, SVG).");
                return;
            }

            setUploadState({
                active: true,
                current: 0,
                total: validFiles.length,
                fileName: validFiles[0]?.name || "",
            });

            const newUploadedItems = [];

            for (let i = 0; i < validFiles.length; i++) {
                const rawFile = validFiles[i];
                setUploadState({
                    active: true,
                    current: i + 1,
                    total: validFiles.length,
                    fileName: rawFile.name,
                });

                try {
                    const optimizedFile = await optimizeImage(rawFile);
                    const formData = new FormData();
                    formData.append("file", optimizedFile);
                    formData.append("folder", "projects");

                    const response = await fetch("/api/admin/upload", {
                        method: "POST",
                        body: formData,
                    });

                    const result = await response.json();
                    if (!response.ok || !result.url) {
                        throw new Error(result.error || `Gagal mengunggah ${rawFile.name}`);
                    }

                    newUploadedItems.push({
                        id: `upload-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
                        url: result.url,
                        isCover: false,
                    });
                } catch (err) {
                    showToast?.("error", err.message || `Gagal mengunggah ${rawFile.name}`);
                }
            }

            setUploadState({ active: false, current: 0, total: 0, fileName: "" });

            if (newUploadedItems.length > 0) {
                setImages((prev) => {
                    const hasCover = prev.some((img) => img.isCover);
                    const updated = [...prev];

                    newUploadedItems.forEach((item, idx) => {
                        // If no cover existed before, first new item becomes cover
                        if (!hasCover && idx === 0 && updated.length === 0) {
                            item.isCover = true;
                        }
                        updated.push(item);
                    });

                    syncToParent(updated);
                    return updated;
                });

                showToast?.(
                    "success",
                    `${newUploadedItems.length} gambar berhasil diunggah ke Supabase Storage.`
                );
            }
        },
        [showToast, syncToParent]
    );

    // Single file replacement
    const handleReplaceUpload = useCallback(
        async (file) => {
            if (!file || !replacingId) return;
            try {
                setUploadState({
                    active: true,
                    current: 1,
                    total: 1,
                    fileName: file.name,
                });

                const optimizedFile = await optimizeImage(file);
                const formData = new FormData();
                formData.append("file", optimizedFile);
                formData.append("folder", "projects");

                const targetImg = images.find((img) => img.id === replacingId);
                if (targetImg?.url) {
                    formData.append("previousUrl", targetImg.url);
                }

                const response = await fetch("/api/admin/upload", {
                    method: "POST",
                    body: formData,
                });

                const result = await response.json();
                if (!response.ok || !result.url) {
                    throw new Error(result.error || "Gagal mengganti gambar.");
                }

                setImages((prev) => {
                    const updated = prev.map((img) =>
                        img.id === replacingId ? { ...img, url: result.url } : img
                    );
                    syncToParent(updated);
                    return updated;
                });

                showToast?.("success", "Gambar berhasil diganti.");
            } catch (err) {
                showToast?.("error", err.message || "Gagal mengganti gambar.");
            } finally {
                setUploadState({ active: false, current: 0, total: 0, fileName: "" });
                setReplacingId(null);
            }
        },
        [images, replacingId, showToast, syncToParent]
    );

    // Set cover / thumbnail
    function setAsCover(id) {
        setImages((prev) => {
            const updated = prev.map((img) => ({
                ...img,
                isCover: img.id === id,
            }));
            syncToParent(updated);
            return updated;
        });
        showToast?.("success", "Gambar cover / thumbnail utama diperbarui.");
    }

    // Remove image
    function removeImage(id) {
        setImages((prev) => {
            const target = prev.find((img) => img.id === id);
            const remaining = prev.filter((img) => img.id !== id);

            // If we removed the cover, appoint the first remaining image as cover
            if (target?.isCover && remaining.length > 0) {
                remaining[0].isCover = true;
            }

            syncToParent(remaining);
            return remaining;
        });
    }

    // Reorder: Move item left or right
    function moveImage(index, direction) {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= images.length) return;

        setImages((prev) => {
            const copy = [...prev];
            const [moved] = copy.splice(index, 1);
            copy.splice(targetIndex, 0, moved);
            syncToParent(copy);
            return copy;
        });
    }

    // Drag and drop event handlers
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            processUploadFiles(e.dataTransfer.files);
        }
    }

    return (
        <div className="space-y-4 w-full min-w-0">
            {/* Upload Area / Dropzone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex flex-col items-center justify-center border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 select-none ${
                    isDragging
                        ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(104,212,204,0.15)]"
                        : "border-white/15 bg-primary/40 hover:border-accent/60 hover:bg-white/[0.02]"
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            processUploadFiles(e.target.files);
                            e.target.value = "";
                        }
                    }}
                    className="hidden"
                />

                <input
                    ref={replaceInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            handleReplaceUpload(file);
                            e.target.value = "";
                        }
                    }}
                    className="hidden"
                />

                <div className="w-12 h-12 rounded-full border border-white/10 bg-secondary flex items-center justify-center text-accent mb-3 group-hover:scale-110 transition-transform">
                    {uploadState.active ? (
                        <Loader2 size={22} className="animate-spin text-accent" />
                    ) : (
                        <UploadCloud size={22} />
                    )}
                </div>

                <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                        <span className="text-accent underline underline-offset-4 decoration-accent/40 group-hover:decoration-accent">
                            Klik untuk memilih
                        </span>{" "}
                        atau tarik & taruh gambar ke sini
                    </p>
                    <p className="text-xs text-white/50 font-mono">
                        Mendukung multi-upload · JPG, PNG, WebP · Otomatis dioptimalkan & disimpan
                    </p>
                </div>

                {/* Active Upload Progress Banner */}
                {uploadState.active && (
                    <div className="mt-4 w-full max-w-sm bg-secondary border border-accent/30 p-2.5 rounded-none space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white/80 truncate max-w-[200px]">
                                {uploadState.fileName}
                            </span>
                            <span className="text-accent font-bold">
                                {uploadState.current} / {uploadState.total}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 overflow-hidden">
                            <div
                                className="bg-accent h-full transition-all duration-300"
                                style={{
                                    width: `${Math.round(
                                        (uploadState.current / (uploadState.total || 1)) * 100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-white/60 px-1">
                        <span>
                            {images.length} Gambar ({images.filter((i) => i.isCover).length ? "1 Cover Thumbnail" : "Belum ada Cover"})
                        </span>
                        <span className="text-[11px] text-accent/80">
                            ★ Gambar pertama otomatis dijadikan cover jika belum ditentukan
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {images.map((item, index) => (
                            <div
                                key={item.id}
                                className={`group relative border transition-all duration-150 flex flex-col bg-secondary/80 ${
                                    item.isCover
                                        ? "border-accent shadow-[0_0_15px_rgba(104,212,204,0.18)]"
                                        : "border-white/10 hover:border-white/30"
                                }`}
                            >
                                {/* Thumbnail Image */}
                                <div className="relative aspect-video w-full bg-primary/80 overflow-hidden">
                                    <img
                                        src={item.url}
                                        alt={`Project visual ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />

                                    {/* Cover Badge */}
                                    {item.isCover ? (
                                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-accent text-primary px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase shadow-md">
                                            <Star size={11} className="fill-primary" />
                                            <span>Cover / Thumbnail</span>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setAsCover(item.id)}
                                            className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 hover:bg-accent hover:text-primary text-white/90 px-2 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase backdrop-blur-sm border border-white/20"
                                            title="Jadikan sebagai gambar cover utama"
                                        >
                                            Set as Cover
                                        </button>
                                    )}

                                    {/* Action Buttons Overlay */}
                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReplacingId(item.id);
                                                replaceInputRef.current?.click();
                                            }}
                                            className="h-7 w-7 bg-black/80 hover:bg-white text-white hover:text-primary flex items-center justify-center transition-colors border border-white/20"
                                            title="Ganti gambar ini"
                                        >
                                            <RefreshCw size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(item.id)}
                                            className="h-7 w-7 bg-black/80 hover:bg-red-500 text-white flex items-center justify-center transition-colors border border-white/20"
                                            title="Hapus gambar"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>

                                {/* Bottom Info & Reorder Controls */}
                                <div className="flex items-center justify-between p-2 border-t border-white/10 text-xs font-mono bg-primary/40">
                                    <span className="text-white/45 text-[11px]">
                                        #{index + 1} {item.isCover && "· Cover"}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        {!item.isCover && (
                                            <button
                                                type="button"
                                                onClick={() => setAsCover(item.id)}
                                                className="text-[10px] text-accent/80 hover:text-accent sm:hidden underline mr-1"
                                            >
                                                Cover
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            disabled={index === 0}
                                            onClick={() => moveImage(index, -1)}
                                            className="h-6 w-6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent"
                                            title="Pindahkan ke kiri"
                                        >
                                            <ArrowLeft size={12} />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={index === images.length - 1}
                                            onClick={() => moveImage(index, 1)}
                                            className="h-6 w-6 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:hover:bg-transparent"
                                            title="Pindahkan ke kanan"
                                        >
                                            <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
