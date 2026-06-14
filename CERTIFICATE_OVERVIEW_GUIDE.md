# Certificate System - Complete Guide

## 📋 Overview
Sistem sertifikat yang konsisten dengan fitur overview/portfolio untuk menampilkan project-project yang dibuat menggunakan skill dari sertifikat tersebut.

## 🗂️ Struktur Folder (Fixed)

### ✅ Struktur Baru (Konsisten)
```
app/
  ├── certificates/
  │   ├── page.jsx          ← List semua sertifikat
  │   └── [id]/
  │       └── page.jsx      ← Detail sertifikat individual
```

### ❌ Struktur Lama (Dihapus)
```
app/
  └── certificate/          ← DELETED (duplikat, tidak konsisten)
      └── [id]/
          └── page.jsx
```

## 🎯 Routes

- **`/certificates`** → Halaman list sertifikat
- **`/certificates/[id]`** → Halaman detail sertifikat (dengan overview projects)

## ✨ Fitur Baru: Overview Section

### 1. **Struktur Data di CertificatesContext.jsx**

Setiap certificate object sekarang bisa memiliki field `overview`:

```javascript
{
    id: 1,
    title: "Full Stack Web Development",
    issuer: "Meta",
    // ... fields lainnya ...
    
    // 🆕 Overview Section
    overview: {
        // Summary tentang aplikasi sertifikat
        summary: "This certification equipped me with...",
        
        // Array of projects yang dibuat
        projects: [
            {
                title: "E-Commerce Platform",
                description: "Complete description...",
                image: "/path/to/image.jpg",  // 📸 Gambar project
                tech: ["React", "Node.js", "MongoDB"],
                highlights: [
                    "Built RESTful API",
                    "Implemented secure payment",
                    // ... achievements
                ]
            },
            // ... more projects
        ],
        
        // Array of achievements
        achievements: [
            "Successfully deployed 5+ applications",
            "Managed databases with 100K+ records",
            // ... more achievements
        ]
    }
}
```

### 2. **Cara Menambahkan Overview ke Sertifikat**

Edit file: `context/CertificatesContext.jsx`

```javascript
const certificatesData = [
    {
        id: 1,
        title: "Your Certificate Title",
        // ... basic info ...
        
        // Tambahkan overview section
        overview: {
            summary: "Tulis ringkasan pengalaman menggunakan skill ini",
            
            projects: [
                {
                    title: "Nama Project",
                    description: "Deskripsi lengkap project",
                    image: "/images/project-screenshot.jpg", // Path ke gambar
                    tech: ["Tech1", "Tech2", "Tech3"],
                    highlights: [
                        "Achievement 1",
                        "Achievement 2",
                        "Achievement 3"
                    ]
                }
            ],
            
            achievements: [
                "Overall achievement 1",
                "Overall achievement 2"
            ]
        }
    }
];
```

### 3. **Menambahkan Gambar Project**

#### Option 1: Gunakan folder public
```
public/
  └── images/
      └── certificates/
          ├── ecommerce-project.jpg
          ├── dashboard-project.png
          └── ...
```

Lalu referensi di code:
```javascript
image: "/images/certificates/ecommerce-project.jpg"
```

#### Option 2: Gunakan URL external
```javascript
image: "https://your-cdn.com/project-image.jpg"
```

#### Option 3: Placeholder (sementara)
```javascript
image: "/api/placeholder/600/400"
```

## 🎨 Tampilan Overview Section

### Components yang Ditampilkan:

1. **Header Section**
   - Icon Lightbulb
   - Badge "Practical Application"
   - Judul "What I Built With This Certificate"
   - Summary text

2. **Projects Grid**
   - 2 kolom di desktop
   - Setiap project card berisi:
     - Gambar project (hover zoom effect)
     - Judul project
     - Deskripsi
     - Tech stack badges
     - Key highlights dengan checkmark

3. **Achievements Section**
   - Trophy icon
   - Grid 2 kolom
   - Target icon untuk setiap achievement

## 📝 Template untuk Menambah Certificate Baru

```javascript
{
    // Basic Info
    id: 7,
    title: "Your Certificate Name",
    issuer: "Issuing Organization",
    platform: "Learning Platform",
    date: "2024",
    image: "/api/placeholder/400/300",
    credentialId: "CERT-123456",
    
    // Skills
    skills: ["Skill 1", "Skill 2", "Skill 3"],
    description: "Certificate description here",
    
    // Verification
    verifyUrl: "https://platform.com/verify/cert-123456",
    
    // Metadata
    featured: true,
    category: "development", // development, ai-ml, cloud, data, management, mobile
    level: "Professional", // Beginner, Intermediate, Advanced, Expert, Professional
    duration: "3 months",
    
    // 🆕 Overview dengan Projects
    overview: {
        summary: "Tulis overview tentang pengalaman menggunakan skill dari sertifikat ini. Jelaskan bagaimana skill ini membantu dalam project nyata.",
        
        projects: [
            {
                title: "Project Title 1",
                description: "Deskripsi lengkap project ini. Apa yang dibangun, untuk apa, dan bagaimana implementasinya.",
                image: "/images/project1.jpg", // 📸 GANTI dengan path gambar real
                tech: ["Technology 1", "Technology 2", "Technology 3"],
                highlights: [
                    "Key feature atau achievement 1",
                    "Key feature atau achievement 2",
                    "Key feature atau achievement 3",
                    "Key feature atau achievement 4"
                ]
            },
            {
                title: "Project Title 2",
                description: "Deskripsi project kedua...",
                image: "/images/project2.jpg", // 📸 GANTI dengan path gambar real
                tech: ["Tech A", "Tech B"],
                highlights: [
                    "Achievement A",
                    "Achievement B"
                ]
            }
        ],
        
        achievements: [
            "Overall achievement 1 (contoh: 'Built 10+ production apps')",
            "Overall achievement 2 (contoh: 'Reduced load time by 50%')",
            "Overall achievement 3 (contoh: 'Mentored 5 junior developers')",
            "Overall achievement 4 (contoh: 'Contributed to open source projects')"
        ]
    }
}
```

## 🎯 Best Practices

### Untuk Gambar Project:
1. **Recommended Size**: 1200x800 pixels (aspect ratio 3:2)
2. **Format**: JPG, PNG, atau WebP
3. **Quality**: Medium-High (balance between quality dan file size)
4. **Naming**: Gunakan nama descriptive (contoh: `ecommerce-dashboard-screenshot.jpg`)

### Untuk Konten:
1. **Summary**: 2-3 kalimat yang menjelaskan aplikasi skill
2. **Project Description**: 1-2 paragraf yang jelas dan informatif
3. **Highlights**: 3-5 poin key achievements per project
4. **Tech Stack**: List teknologi yang benar-benar digunakan
5. **Achievements**: Gunakan angka dan metrics kalau bisa

## 🔧 Customization

### Menambah/Mengurangi Kolom Projects:
Edit di `app/certificates/[id]/page.jsx`:

```javascript
// Line ~XXX - Projects Grid
<div className="grid md:grid-cols-2 gap-8">  // ← Ubah md:grid-cols-2 ke md:grid-cols-3 untuk 3 kolom
```

### Mengubah Warna/Style:
Semua menggunakan Tailwind CSS classes. Edit langsung di JSX.

### Hide Overview Section (Optional):
Jika tidak ingin menampilkan overview untuk certificate tertentu, cukup jangan tambahkan field `overview` di data.

## 📊 Data Structure Complete

```typescript
interface Certificate {
    // Required fields
    id: number;
    title: string;
    issuer: string;
    platform: string;
    date: string;
    image: string;
    credentialId: string;
    skills: string[];
    description: string;
    verifyUrl: string;
    featured: boolean;
    category: string;
    level: string;
    duration: string;
    
    // Optional overview
    overview?: {
        summary: string;
        projects: {
            title: string;
            description: string;
            image: string;  // 📸 Path ke gambar
            tech: string[];
            highlights: string[];
        }[];
        achievements: string[];
    }
}
```

## 🚀 Deployment

Build sudah sukses dengan struktur baru:
```
✓ /certificates         - List page
✓ /certificates/[id]    - Detail page dengan overview
```

## 💡 Tips

1. **Untuk Testing**: Gunakan `/api/placeholder/600/400` dulu untuk gambar, nanti ganti dengan real images
2. **Performance**: Optimize images sebelum upload (compress dengan tools seperti TinyPNG)
3. **Consistency**: Pastikan style gambar konsisten (semua screenshots atau semua mockups)
4. **Content**: Tulis highlight yang spesifik dan measurable (contoh: "Increased performance by 40%" lebih baik dari "Made it faster")

## 📚 Examples

### Example 1: Web Development Certificate
```javascript
overview: {
    summary: "Built multiple full-stack applications using modern web technologies",
    projects: [
        {
            title: "E-Commerce Platform",
            description: "Full-featured online store with cart, checkout, and admin panel",
            image: "/images/ecommerce.jpg",
            tech: ["React", "Node.js", "MongoDB", "Stripe"],
            highlights: [
                "1000+ daily active users",
                "Secure payment integration",
                "Real-time inventory updates"
            ]
        }
    ],
    achievements: [
        "Deployed 5 production apps",
        "99.9% uptime maintained"
    ]
}
```

### Example 2: ML Certificate
```javascript
overview: {
    summary: "Applied machine learning to solve real-world problems",
    projects: [
        {
            title: "Image Classifier",
            description: "CNN model for medical image classification",
            image: "/images/ml-classifier.jpg",
            tech: ["TensorFlow", "Python", "Keras"],
            highlights: [
                "95% accuracy achieved",
                "Trained on 50K images",
                "Deployed on AWS"
            ]
        }
    ],
    achievements: [
        "Published research paper",
        "Reduced inference time by 60%"
    ]
}
```

---

**Status**: ✅ Implemented & Tested
**Version**: 2.0.0
**Last Updated**: October 2, 2025
