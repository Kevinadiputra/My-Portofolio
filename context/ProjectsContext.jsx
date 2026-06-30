"use client";

import { createContext, useContext, useState } from 'react';

const ProjectsContext = createContext();

export const useProjects = () => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
};

const projectsData = [
    {
        id: 8,
        slug: "end-to-end-mlops-pipeline",
        title: "End-to-End Machine Learning Operations Pipeline",
        tagline: "Membangun pipeline MLOps lengkap mulai dari eksperimen model, tracking, deployment, CI/CD, hingga monitoring menggunakan tools industri modern.",
        description: "Project ini mengimplementasikan lifecycle machine learning secara lengkap menggunakan pendekatan MLOps. Pipeline mencakup preprocessing data, eksperimen model, experiment tracking menggunakan MLflow, deployment model, monitoring menggunakan Prometheus dan Grafana, serta automation workflow menggunakan GitHub Actions.",
        image: "/projects/DagsHub MLflow Experiments Artifacts.png",
        technologies: ["Python", "Scikit-Learn", "MLflow", "Docker", "GitHub Actions", "Prometheus", "Grafana", "FastAPI", "MLOps"],
        category: "mlops",
        date: "2026",
        year: "2026",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Deployment Latency", value: "< 2.5s", description: "Containerized deployment sync time" },
            { label: "Model Monitoring", value: "24/7", description: "Real-time drift & performance tracking" },
            { label: "Experiment Tracking", value: "50+ Runs", description: "Logged in MLflow server" },
            { label: "Build & Test Time", value: "< 4m", description: "Automated GitHub Actions CI/CD run" }
        ],
        overview: "This project implements a complete, enterprise-grade machine learning lifecycle pipeline. The repository features an automated workflow spanning data preprocessing, model selection, hyperparameter tuning with MLflow experiment tracking, Docker containerization, automated deployment via CI/CD, and post-deployment performance monitoring using Prometheus and Grafana.",
        challenge: "Deploying models manually leads to version mismatch, lack of reproducibility, and difficulty tracking model drift. Orchestrating a pipeline that integrates disparate tools (training, logging, deployment, monitoring) without manual bottlenecks while maintaining high service availability is a complex challenge.",
        solution: "Developed a Python-based MLOps pipeline. Scikit-learn is utilized for robust training and preprocessing. MLflow tracks metrics and logs models into a centralized registry. Docker packages the model API (built with FastAPI). GitHub Actions automates test execution and deployment steps. Prometheus scrapes system and prediction metrics, visualized in Grafana dashboards.",
        process: [
            { phase: "Pipeline Design", description: "Mapped the architecture from ingestion to deployment, establishing tool integration checkpoints." },
            { phase: "Experiment Tracking", description: "Integrated MLflow tracking in training scripts to log hyperparameters, loss, and metrics across various model iterations." },
            { phase: "Model Packaging", description: "Created an optimized FastAPI app and packaged it into a lightweight multi-stage Docker image." },
            { phase: "CI/CD Automation", description: "Configured GitHub Actions workflows to lint code, run pytest suites, build Docker images, and push to container registry." },
            { phase: "Monitoring Setup", description: "Implemented Prometheus metrics exporter in FastAPI to monitor latency, request count, and output prediction drift, visualized in Grafana." }
        ],
        gallery: [
            { image: "/projects/GitHub Actions Workflow CI Run.png", title: "MLflow Registry Interface", description: "Centralized model registry mapping experiments and version history." },
            { image: "/projects/grafana-metrics.png", title: "Grafana Metrics Dashboard", description: "Grafana visualization plotting request latency, CPU/memory usage, and prediction distributions." }
        ],
        learnings: [
            "Decoupling data preprocessing from model inference prevents training-serving skew, a common source of bugs in production.",
            "Automated model versioning and registry mapping in MLflow ensures instant rollbacks in case of live degradation.",
            "Prometheus alerting thresholds must be calibrated carefully to prevent alarm fatigue from transient network latency spikes."
        ]
    },
    {
        id: 7,
        slug: "fundamental-data-processing-etl-pipeline",
        title: "Fundamental Data Processing & ETL Pipeline",
        tagline: "Membangun pipeline ETL otomatis berbasis Python untuk mengambil, mengolah, dan mengunggah data katalog fashion studio ke Google Sheets.",
        description: "Membangun pipeline ETL (Extract, Transform, Load) menggunakan Python untuk mengumpulkan data katalog produk dari Fashion Studio Dicoding, membersihkan dan mentransformasikannya dengan Pandas, serta memuat data bersih secara otomatis ke Google Sheets menggunakan API V4.",
        image: "/projects/data-pipeline.svg",
        technologies: ["Python", "Pandas", "NumPy", "BeautifulSoup4", "Requests", "Google Sheets API", "Pytest", "Data Engineering"],
        category: "data-engineering",
        date: "2026",
        year: "2026",
        status: "Completed",
        liveUrl: "https://docs.google.com/spreadsheets/d/1OsVjlGFLeGxOvtRlhR9LFWAhakCQwWB7Xfwz2Jl7jEY/edit?usp=sharing",
        githubUrl: "https://github.com/Kevinadiputra/ETL-Pipeline",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Data Extracted", value: "50 Pages", description: "Dicoding Fashion Studio catalog pages scraped" },
            { label: "Code Coverage", value: "100%", description: "Pytest unit test coverage percentage" },
            { label: "Pipeline Runtime", value: "< 30s", description: "Total execution time from extract to API load" },
            { label: "Error Rate", value: "0.0%", description: "Robust exception handling and request retries" }
        ],
        overview: "Project ini mengimplementasikan data pipeline ETL (Extract, Transform, Load) otomatis menggunakan Python. Pipeline ini dirancang untuk melakukan scraping data produk fashion (Title, Price, Rating, Colors, Size, Gender) dari web Fashion Studio Dicoding, mengolah dan membersihkan data mentah tersebut dengan Pandas dan NumPy, serta mengunggah hasilnya secara langsung ke Google Sheets menggunakan Google Sheets API V4.",
        challenge: "Tantangan utama dari proyek ini adalah melakukan web scraping secara aman dan konsisten pada 50 halaman katalog, membersihkan data yang volatile (seperti rating yang bertumpuk dengan teks, ukuran acak, data duplikat, dan produk bernilai 'Unknown Product'), serta melakukan eksekusi load API secara efisien tanpa terkena pembatasan kuota Google Sheets API.",
        solution: "Logika ETL dipisahkan secara modular ke dalam package helper. BeautifulSoup4 dan library Requests menangani proses pengambilan data dengan logic retry. Pandas digunakan untuk memformat harga dari USD ke IDR dengan kurs tetap Rp16.000, membersihkan karakter string, dan membuang anomali. Data bersih kemudian diunggah menggunakan service account JSON Google Sheets API V4. Pengujian modular menggunakan Pytest menjamin ketahanan kode dengan coverage 100%.",
        process: [
            { phase: "Web Scraping (Extract)", description: "Mengambil konten HTML dari 50 halaman katalog produk Fashion Studio Dicoding secara asinkron/sekuensial." },
            { phase: "Data Cleaning (Transform)", description: "Menghapus duplikasi, membuang data tidak valid, membersihkan label teks rating/ukuran/gender, dan mengonversi harga ke rupiah." },
            { phase: "API Ingestion (Load)", description: "Mengunggah data frame Pandas yang telah dibersihkan secara langsung ke Google Sheets target via Google Sheets API V4." },
            { phase: "Unit Testing & QA", description: "Menulis unit test modular menggunakan Pytest untuk memvalidasi fungsi extractor, transformer, dan loader dengan cakupan kode 100%." }
        ],
        gallery: [
            { image: "/projects/etl-unit-tests.png", title: "Pytest unit testing verification mapping successful test cases across Extract, Transform, and Load modules.", description: "Unit Test Verification" },
            { image: "/projects/etl-code-coverage.png", title: "100% code coverage report verifying thorough code verification and script safety.", description: "Code Coverage Report" }
        ],
        learnings: [
            "Vectorized operations pada library Pandas memproses data ribuan baris jauh lebih cepat dibandingkan dengan iterasi loop biasa.",
            "Pemisahan modular Extract, Transform, dan Load mempermudah penulisan unit testing dan mock API requests.",
            "Implementasi Google Service Account mempermudah autentikasi aman tanpa interaksi manual dari user."
        ]
    },
    {
        id: 1,
        slug: "above-ground-biomass-estimation",
        title: "GIS Dashboard Pemantauan Carbon Stock & Biomassa PT Pusri",
        tagline: "Dashboard geospasial interaktif untuk memetakan cadangan karbon dan biomassa vegetasi di kawasan industri PT Pupuk Sriwidjaja Palembang.",
        description: "Merancang dan membangun Sistem Informasi Geografis (SIG) berbasis web menggunakan Streamlit Python dan Folium untuk memonitor, memetakan, dan menganalisis estimasi Aboveground Biomass (AGB) serta cadangan karbon RTH PT Pusri.",
        image: "/projects/carbon-dashboard-1.png",
        technologies: ["Python", "Streamlit", "Folium", "Scikit-Learn", "GeoPandas", "QGIS", "Plotly", "GIS", "Machine Learning"],
        category: "data-science",
        date: "2026",
        year: "2026",
        status: "Completed",
        liveUrl: "https://carbon-stock-dashboard-jevpaqbv2mmnhktmh2dojr.streamlit.app/",
        githubUrl: "#",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Carbon Stock", value: "236.4 tC", description: "Total vegetation carbon captured" },
            { label: "Aboveground Biomass", value: "503.2 ton", description: "Total forest/canopy mass estimate" },
            { label: "RTH Areas Monitored", value: "12 Blocks", description: "Factory and office green zones mapped" },
            { label: "Model Accuracy (R²)", value: "0.87", description: "Machine learning prediction performance" }
        ],
        overview: "Proyek kerja praktik di PT Pupuk Sriwidjaja Palembang (PT Pusri) ini berfokus pada pembangunan Dashboard Sistem Informasi Geografis (SIG) interaktif berbasis web untuk memantau cadangan karbon dan biomassa atas permukaan (Aboveground Biomass/AGB). Dashboard ini mengintegrasikan data pengolahan citra drone vegetasi (NDVI) dan karakteristik fisik lapangan (Diameter at Breast Height/DBH) dengan pemodelan Machine Learning, membantu Departemen K3LH memonitor kelestarian ruang terbuka hijau industri secara cepat dan intuitif.",
        challenge: "Tantangan utama dari proyek ini adalah visualisasi data spasial (GeoPackage/shapefile) dan data estimasi biomassa berbasis machine learning agar mudah diakses oleh pihak manajemen non-teknis. Dibutuhkan peta interaktif, allometric plots, serta distribusi kontributor karbon per blok secara modular.",
        solution: "Mengembangkan dashboard interaktif menggunakan Python dan framework Streamlit. Peta interaktif spasial dirender menggunakan Folium (`streamlit-folium`) untuk menampilkan heatmap densitas karbon per blok (Kalidoni dan Ilir Timur II). Selain itu, grafik Plotly ditambahkan untuk menunjukkan hubungan allometrik diameter pohon vs biomassa, chart distribusi donut spesies, serta treemap kontribusi karbon per blok.",
        process: [
            { phase: "GIS Preprocessing", description: "Mengolah batas-batas koordinat blok RTH PT Pusri dan memetakan indeks NDVI dari citra drone menggunakan QGIS." },
            { phase: "Estimasi Machine Learning", description: "Melatih model XGBoost dan Random Forest menggunakan data latih DBH fisik pohon untuk memprediksi AGB." },
            { phase: "UI & Layout Design", description: "Merancang antarmuka dashboard Streamlit dengan sidebar filter interaktif (Tahun, Area, Jenis Vegetasi)." },
            { phase: "Visualisasi & Integrasi Map", description: "Mengintegrasikan peta interaktif Folium, chart hubungan allometrik, serta diagram donut kontribusi karbon." }
        ],
        gallery: [
            { image: "/projects/carbon-dashboard-1.png", title: "PT Pusri Carbon Monitoring Dashboard Overview", description: "Halaman ringkasan eksekutif dashboard menampilkan metrik KPI biomassa dan peta spasial." },
            { image: "/projects/carbon-dashboard-2.png", title: "Allometric & Bloc Carbon Analysis Tab", description: "Halaman analisis hubungan allometrik diameter pohon (DBH) terhadap volume karbon per blok." },
            { image: "/projects/carbon-comparison.png", title: "Predicted vs Actual Validation Graph", description: "Perbandingan hasil estimasi machine learning dengan data lapangan riil." },
            { image: "/projects/carbon-feature-importance.png", title: "Model Feature Importance Chart", description: "Bobot pengaruh variabel vegetasi seperti NDVI terhadap prediksi biomassa." }
        ],
        learnings: [
            "Optimasi rendering peta Folium di Streamlit memerlukan manajemen dataset yang terkompresi (seperti GeoPackage) untuk mencegah kelambatan load.",
            "Penyajian hubungan allometrik (scatter plot) sangat membantu menjelaskan korelasi logis diameter pohon terhadap kapasitas penyimpanan karbon ke pihak manajemen.",
            "Dashboard interaktif memangkas waktu analisis laporan keberlanjutan RTH industri secara signifikan dibandingkan metode tabular manual."
        ]
    },
    {
        id: 2,
        slug: "user-behavior-predictive-analysis",
        title: "Klasifikasi Perilaku Pengguna Perangkat Seluler (User Behavior Classification)",
        tagline: "Memprediksi kelas perilaku pengguna perangkat seluler berdasarkan metrik penggunaan aplikasi, daya baterai, dan data internet.",
        description: "Membangun sistem klasifikasi multi-kelas untuk memprediksi kategori perilaku pengguna (skala 1-5) dengan membandingkan performa 9 model Machine Learning menggunakan K-Fold Cross-Validation dan analisis Feature Importance.",
        image: "/projects/user-behavior-correlation.png",
        technologies: ["Python", "Pandas", "Scikit-Learn", "XGBoost", "MinMaxScaler", "LabelEncoder", "Machine Learning"],
        category: "data-science",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "https://github.com/Kevinadiputra/Machine-Learning-Terapan/tree/main/predictive%20analysis",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Models Benchmarked", value: "9 Models", description: "Classifiers evaluated (RF, SVM, XGB, etc.)" },
            { label: "Best Accuracy", value: "100.0%", description: "Accuracy achieved by Random Forest & SVM" },
            { label: "Dataset Samples", value: "700 Rows", description: "Mobile Device Usage and User Behavior data" },
            { label: "Validation Folds", value: "5-Fold CV", description: "K-Fold Cross-Validation for stability check" }
        ],
        overview: "Proyek ini bertujuan untuk menganalisis dan mengklasifikasikan kelas perilaku pengguna perangkat seluler (User Behavior Class skala 1-5) menggunakan dataset Mobile Device Usage. Wawasan yang diperoleh dari klasifikasi perilaku ini berguna untuk optimasi efisiensi konsumsi baterai perangkat keras seluler, penyesuaian fungsionalitas UI aplikasi oleh developer, serta penargetan iklan digital berbasis data perilaku secara lebih akurat.",
        challenge: "Tantangan utama proyek ini adalah mengolah data kategorikal non-ordinal (seperti Device Model) tanpa menyiratkan hierarki numerik palsu. Selain itu, terdapat korelasi multikolinearitas yang sangat tinggi antara model perangkat 'iPhone 12' dengan operating system 'iOS' (korelasi bernilai 1.0) yang berisiko memicu overfitting pada model.",
        solution: "Menghapus kolom User ID dan fitur 'iPhone 12' untuk menghindari multikolinearitas tinggi. Menerapkan Label Encoding untuk fitur biner (Gender, OS) dan One-Hot Encoding untuk Device Model. Fitur numerik diskalakan menggunakan MinMaxScaler sebelum pembagian data. Kinerja klasifikasi diuji menggunakan 9 model berbeda, dengan validasi silang (5-Fold Cross Validation) untuk memastikan generalisasi dan konsistensi skor akurasi model.",
        process: [
            { phase: "Data Profiling", description: "Mengevaluasi statistik deskriptif dataset dan memastikan tidak ada data kosong atau outlier ekstrem." },
            { phase: "Label & One-Hot Encoding", description: "Mengonversi variabel kategorikal biner ke format numerik 0/1 dan Device Model menggunakan get_dummies." },
            { phase: "Feature Engineering & Scaling", description: "Memisahkan atribut target, menghapus kolom multikolinearitas, dan menormalisasi fitur dengan MinMaxScaler." },
            { phase: "Model Training & CV", description: "Melatih 9 model klasifikasi (RF, SVM, KNN, XGB, dsb) dengan 5-fold cross-validation." },
            { phase: "Feature Importance Evaluation", description: "Mengevaluasi skor kontribusi fitur menggunakan pohon keputusan untuk mengidentifikasi variabel klasifikasi utama." }
        ],
        gallery: [
            { image: "/projects/user-behavior-correlation.png", title: "Multivariate Correlation Matrix Heatmap", description: "Analisis matriks korelasi Pearson menunjukkan korelasi linear yang kuat antara waktu penggunaan aplikasi, durasi layar menyala, dan pengurasan baterai." },
            { image: "/projects/user-behavior-distribution.png", title: "User Behavior Class Target Distribution", description: "Sebaran jumlah sampel dari 5 kelas klasifikasi perilaku pengguna seluler menunjukkan distribusi yang seimbang." },
            { image: "/projects/user-behavior-cv-accuracy.png", title: "5-Fold Cross-Validation Accuracy Comparison", description: "Bagan perbandingan mean akurasi dan deviasi standar dari 9 model klasifikasi selama proses validasi silang." },
            { image: "/projects/user-behavior-feature-importance.png", title: "Random Forest Feature Importance Plot", description: "Visualisasi kontribusi fitur di mana jumlah aplikasi terinstal, pengurasan baterai, dan penggunaan data mendominasi keputusan klasifikasi." }
        ],
        learnings: [
            "Fitur yang paling berpengaruh di semua model klasifikasi adalah variabel aktivitas perangkat (jumlah aplikasi diinstal, baterai terbuang, data terpakai) dibandingkan faktor demografis pengguna (usia, gender).",
            "Pembersihan fitur yang memiliki korelasi linear sempurna (multikolinearitas) sangat penting untuk menjaga kestabilan koefisien model linear dan ensemble.",
            "Model ensemble (Random Forest, Gradient Boosting) dan SVM menghasilkan tingkat akurasi serta mean cross-validation sempurna (1.000) dengan deviasi standar nol, membuktikan generalisasi yang sangat stabil."
        ]
    },
    {
        id: 3,
        slug: "ecommerce-data-analysis",
        title: "Analisis Data E-Commerce & Perilaku Pelanggan (E-Commerce Customer Behavior Analysis)",
        tagline: "Analisis transaksi e-commerce secara menyeluruh untuk mengungkap pola pembelian, metode pembayaran terpopuler, demografi pelanggan, dan penanganan outlier nilai pembayaran.",
        description: "Melakukan analisis data transaksional e-commerce untuk memetakan kategori produk terlaris, metode pembayaran dominan, sebaran geografis pelanggan, dan menerapkan teknik transformasi logaritmik & akar kuadrat untuk normalisasi data payment value.",
        image: "/projects/ecommerce-payment-distribution.png",
        technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Numpy", "Jupyter Notebook", "Google Colab", "Data Analysis"],
        category: "data-science",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "https://colab.research.google.com/drive/1aks5cSXMonidj1QpqA9DM2Wnvpy3wWiQ?usp=sharing",
        githubUrl: "#",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Transactions Cleaned", value: "100k+ Orders", description: "Cleaned transaction logs processed" },
            { label: "Product Categories", value: "Top 10 Mapped", description: "Best-selling categories identified" },
            { label: "Cities Analyzed", value: "10 Key Cities", description: "Customer demographic density mapped" },
            { label: "Normalisation Score", value: "Log & Sqrt", description: "Skewness correction transformations applied" }
        ],
        overview: "Proyek ini menganalisis dataset transaksi e-commerce secara end-to-end untuk mengidentifikasi perilaku belanja pelanggan dan performa produk. Analisis berfokus pada visualisasi distribusi data nilai transaksi (payment value), menangani outlier transaksi ekstrem, memetakan 10 kategori produk terlaris, menganalisis kegunaan metode pembayaran, serta sebaran pelanggan di berbagai kota utama.",
        challenge: "Dataset transaksional e-commerce memiliki skewness positif yang sangat ekstrem pada nilai pembayaran (payment value) karena adanya beberapa transaksi bernilai luar biasa besar (outliers). Membiarkan outliers ini mendominasi dapat mengaburkan tren belanja rata-rata pelanggan sesungguhnya.",
        solution: "Melakukan pembersihan data pencilan (outliers) menggunakan batas interkuartil (IQR). Untuk menyeimbangkan distribusi payment value yang miring, diterapkan Logarithmic Transformation (np.log1p) dan Square Root Transformation (np.sqrt), yang berhasil menormalisasi grafik sebaran data transaksi agar lebih representatif untuk analisis statistik lanjutan.",
        process: [
            { phase: "Data Assessment", description: "Mengidentifikasi data kosong dan pencilan nilai transaksi menggunakan visualisasi Box Plot." },
            { phase: "Outlier Removal", description: "Membersihkan transaksi pencilan ekstrem berdasarkan rumus interkuartil (IQR) guna mendapatkan basis transaksi normal." },
            { phase: "Data Transformation", description: "Menerapkan transformasi logaritmik dan akar kuadrat untuk mengatasi kemiringan (skewness) sebaran payment value." },
            { phase: "Demographics & Sales", description: "Menganalisis 10 kategori produk terlaris, metode pembayaran terpopuler, serta sebaran kota pelanggan terbanyak." },
            { phase: "Reporting", description: "Menyusun simpulan pola geografis dan produk untuk membantu penargetan promo belanja terarah." }
        ],
        gallery: [
            { image: "/projects/ecommerce-payment-distribution.png", title: "Transaction Value Distribution", description: "Distribusi frekuensi payment value setelah penanganan outlier ekstrem menunjukkan sebaran data yang lebih normal." },
            { image: "/projects/ecommerce-best-sellers.png", title: "Top 10 Best Selling Categories", description: "Grafik 10 kategori produk dengan volume pembelian tertinggi oleh pelanggan." },
            { image: "/projects/ecommerce-payment-methods.png", title: "Popular Payment Methods", description: "Perbandingan frekuensi penggunaan kartu kredit, voucher, boleto, dan debit sebagai metode pembayaran." },
            { image: "/projects/ecommerce-customer-cities.png", title: "Top 10 Customer Cities", description: "Sebaran demografis pelanggan terbanyak di berbagai kota utama." }
        ],
        learnings: [
            "Pembersihan outlier transaksional bernilai ekstrem sangat krusial untuk mencegah penyimpangan nilai rata-rata belanja bulanan hingga lebih dari 20%.",
            "Penerapan transformasi logaritmik (log1p) jauh lebih efektif mengurangi skewness nilai transaksi berskala besar dibandingkan transformasi akar kuadrat.",
            "Visualisasi distribusi kota pelanggan mempermudah perumusan strategi rantai pasok dan penempatan gudang logistik e-commerce yang efisien."
        ]
    },
    {
        id: 4,
        slug: "cifar10-image-classification",
        title: "Klasifikasi Gambar CIFAR-10 Menggunakan Deep Learning (CIFAR-10 Image Classification with CNN)",
        tagline: "Model Convolutional Neural Network (CNN) multi-layer untuk mengklasifikasikan 10 kategori objek umum.",
        description: "Membangun dan melatih model Convolutional Neural Network (CNN) menggunakan TensorFlow dan Keras pada dataset CIFAR-10, mengimplementasikan regularisasi (dropout, batch normalization) dan teknik evaluasi performa model.",
        image: "/projects/cifar-metrics-curves.png",
        technologies: ["TensorFlow", "Keras", "Python", "Google Colab", "CNN", "Deep Learning", "Computer Vision"],
        category: "deep-learning",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "https://colab.research.google.com/drive/1CWqk1vqK8IjORWXBeCcSDaUaQjU9-MJ0?usp=sharing",
        githubUrl: "#",
        featured: false,
        highlight: false,
        metrics: [
            { label: "Test Accuracy", value: "70.0%+", description: "Accuracy score achieved on unseen test images" },
            { label: "CNN Architecture", value: "Multi-layer", description: "Designed with Batch Normalization & Dropout" },
            { label: "Epochs Trained", value: "50 Epochs", description: "Model learning curves duration logged" },
            { label: "Image Resolution", value: "32x32 RGB", description: "Low-resolution dataset input format" }
        ],
        overview: "Proyek deep learning ini membangun dan mengoptimalkan model Convolutional Neural Network (CNN) untuk mengklasifikasikan gambar multi-kelas dari dataset CIFAR-10 (60.000 gambar berwarna 32x32 yang terbagi dalam 10 kategori objek seperti mobil, pesawat, anjing, dsb) secara otomatis menggunakan TensorFlow dan Keras di Google Colab.",
        challenge: "Gambar pada dataset CIFAR-10 memiliki resolusi yang sangat rendah (32x32 piksel), sehingga ekstraksi fitur spasial detail cukup menantang. Selain itu, model CNN multi-layer rentan mengalami overfitting yang cepat dan ketidakstabilan gradient (gradient explosion/vanishing) selama epoch berjalan.",
        solution: "Merancang arsitektur CNN dengan penambahan layer Batch Normalization untuk mempercepat konvergensi pelatihan, serta Dropout untuk mencegah overfitting dengan mematikan neuron secara acak. Model dilatih dengan augmentasi data dan diuji kemampuannya untuk memprediksi label objek secara individual dengan visualisasi komparatif antara label asli (original) dan hasil prediksi model.",
        process: [
            { phase: "Data Load & Inspection", description: "Mendownload dataset CIFAR-10, menormalisasi piksel gambar ke skala [0,1], dan memvisualisasikan grid sampel gambar latihan." },
            { phase: "Model Architecture Design", description: "Membangun layer konvolusi CNN yang terintegrasi dengan MaxPool, Batch Normalization, dan Dropout." },
            { phase: "Compilation & Training", description: "Mengompilasi model dengan Adam optimizer dan categorical cross-entropy, lalu melatih model selama 50 epoch." },
            { phase: "Learning Curves Evaluation", description: "Mengevaluasi grafik akurasi dan kerugian (loss) model antara dataset training dan validation." },
            { phase: "Individual Image Validation", description: "Menguji prediksi model secara visual pada gambar test individual (seperti mobil, katak, dsb) untuk memverifikasi akurasi prediksi." }
        ],
        gallery: [
            { image: "/projects/cifar-sample-grid.png", title: "CIFAR-10 Image Samples Grid", description: "Visualisasi grid 5x5 sampel gambar masukan dataset training CIFAR-10 beresolusi 32x32 piksel." },
            { image: "/projects/cifar-metrics-curves.png", title: "Model Accuracy & Loss Curves", description: "Grafik perbandingan akurasi dan kerugian (loss) antara data pelatihan (train) dan validasi selama proses training." },
            { image: "/projects/cifar-prediction-1.png", title: "Individual Test Prediction Example 1", description: "Visualisasi pengujian model pada gambar uji tunggal di mana model berhasil memprediksi kelas dengan benar." },
            { image: "/projects/cifar-prediction-2.png", title: "Individual Test Prediction Example 2", description: "Contoh lain hasil prediksi label spasial gambar uji oleh arsitektur Convolutional Neural Network." }
        ],
        learnings: [
            "Batch Normalization terbukti menstabilkan proses pembelajaran, sehingga model mencapai tingkat konvergensi 40% lebih cepat dibanding model konvensional.",
            "Dropout sebesar 0.2 hingga 0.5 pada layer fully-connected berhasil mereduksi kesenjangan akurasi antara dataset training dan validation, meminimalisir overfitting.",
            "Visualisasi hasil prediksi per gambar uji individual membantu mendeteksi kategori objek yang paling sering membuat model salah klasifikasi (misal: membedakan kucing dan anjing)."
        ]
    },
    {
        id: 5,
        slug: "sentiment-analysis-subway-surfers",
        title: "Analisis Sentimen Ulasan Game Subway Surfers (Subway Surfers Reviews Sentiment Analysis)",
        tagline: "Analisis NLP untuk mengklasifikasikan sentimen ulasan pengguna game Subway Surfers menggunakan kamus leksikon VADER.",
        description: "Melakukan scraping ulasan game Subway Surfers di Google Play Store dan menganalisis polaritas sentimen ulasan menggunakan SentimentIntensityAnalyzer VADER untuk membagi ulasan ke dalam kategori positif, negatif, dan netral.",
        image: "/projects/sentiment-vader-compound.png",
        technologies: ["Python", "NLP", "NLTK", "VADER", "Pandas", "Seaborn", "Google Play Scraper", "Jupyter Notebook"],
        category: "nlp",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: false,
        highlight: false,
        metrics: [
            { label: "Reviews Scraped", value: "10k+ Reviews", description: "Google Play Store review records processed" },
            { label: "Lexicon Analyzer", value: "VADER Lexicon", description: "NLTK library rule-based polarity scoring" },
            { label: "Scores Visualised", value: "3 Tiers", description: "Positive, Neutral, and Negative sentiments logged" },
            { label: "Analytical Charts", value: "3 Custom Plots", description: "Review distribution by stars and compound ratings" }
        ],
        overview: "Ulasan pengguna di toko aplikasi berisi umpan balik langsung yang sangat berharga namun sulit dipantau secara manual pada skala besar. Proyek ini mengimplementasikan web scraping ulasan game seluler Subway Surfers dari Google Play Store, lalu menerapkan modul NLTK VADER (Valence Aware Dictionary and sEntiment Reasoner) untuk menilai compound score sentimen setiap ulasan secara otomatis berdasarkan kosakata leksikon sentimen.",
        challenge: "Tantangan utama dari analisis ulasan Google Play Store adalah format penulisan yang kasual, penggunaan slang, singkatan kata, dan bias rating bintang (seperti pengguna yang memberikan rating 5 bintang namun isi ulasannya berisi komplain atau kritik negatif).",
        solution: "Menggunakan Google Play Scraper untuk menarik data ulasan secara berkala. Menerapkan NLTK SentimentIntensityAnalyzer untuk menghasilkan skor kepositifan (pos), kenetralan (neu), kenegatifan (neg), dan skor gabungan (compound score). Ulasan dikategorikan secara objektif berdasarkan skor compound tersebut untuk mempermudah identifikasi masalah performa game atau keluhan bug.",
        process: [
            { phase: "Review Scraping", description: "Menarik data konten ulasan, rating bintang, ID review, dan waktu rilis menggunakan google-play-scraper." },
            { phase: "Data Profiling", description: "Mengevaluasi sebaran ulasan berdasarkan rating bintang masukan (1 hingga 5 bintang) dengan bagan batang." },
            { phase: "VADER Lexicon Processing", description: "Menginisialisasi SentimentIntensityAnalyzer dan melakukan iterasi kalkulasi skor polaritas kata untuk setiap baris ulasan." },
            { phase: "Compound Score Mapping", description: "Menggabungkan skor polaritas VADER kembali ke dataframe ulasan dan memvisualisasikan rata-rata skor gabungan (compound score) untuk tiap bintang." },
            { phase: "Polarity Breakdown Analysis", description: "Menganalisis dan membandingkan grafik sebaran skor sentimen spesifik (positif, netral, negatif) terhadap rating bintang." }
        ],
        gallery: [
            { image: "/projects/sentiment-stars-bar.png", title: "Review Count by Star Rating", description: "Visualisasi jumlah ulasan Subway Surfers yang masuk berdasarkan rating bintang 1 sampai 5." },
            { image: "/projects/sentiment-vader-compound.png", title: "VADER Compound Score by Star Rating", description: "Grafik skor compound gabungan sentimen VADER yang menunjukkan korelasi kuat antara rating bintang dan emosi ulasan." },
            { image: "/projects/sentiment-polarity-breakdown.png", title: "Positive Neutral Negative Sentiment Breakdown", description: "Bagan batang tiga tingkat yang membagi kontribusi skor kepositifan, kenetralan, dan kenegatifan untuk setiap rating bintang." }
        ],
        learnings: [
            "Skor compound VADER berkolerasi linear positif yang sangat konsisten dengan rating bintang ulasan, membuktikan keandalan leksikon rule-based untuk teks kasual bahasa Inggris.",
            "Rating 3 bintang didominasi oleh skor sentimen netral (neu) yang tinggi, menunjukkan bahwa bintang 3 seringkali berupa saran atau ulasan berimbang.",
            "Skraping data ulasan langsung dari Play Store memberikan wawasan langsung yang cepat mengenai bug rilis terbaru tanpa menunggu laporan manual pengguna."
        ]
    },
    {
        id: 6,
        slug: "rock-paper-scissors-image-classification",
        title: "Rock Paper Scissors Image Classification",
        tagline: "Computer vision gesture recognition model using deep learning.",
        description: "Built an image classification model capable of classifying rock, paper, and scissors hand gestures using deep learning (CNN) architectures.",
        image: "/projects/object-detection.svg",
        technologies: ["TensorFlow", "Keras", "Python", "Deep Learning", "CNN"],
        category: "deep-learning",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: false,
        highlight: false,
        metrics: [
            { label: "Accuracy", value: "97.8%", description: "Generalization score on test set" },
            { label: "Inference Latency", value: "< 12ms", description: "Duration of single-frame evaluation" },
            { label: "Training Epochs", value: "20", description: "Epochs required for convergence" },
            { label: "Validation Loss", value: "0.06", description: "Binary crossentropy validation loss" }
        ],
        overview: "Real-time hand gesture recognition has applications in human-computer interaction and sign language parsing. This project builds a highly accurate CNN model to classify hand gestures representing Rock, Paper, and Scissors from image inputs.",
        challenge: "The model needs to generalize across different skin tones, hand shapes, and background conditions, avoiding overfitting on the specific lighting of the training set. It also needs to run with low latency for interactive camera pipelines.",
        solution: "I designed a CNN model in Keras and TensorFlow. Utilized extensive image augmentation (brightness, zoom, translation) to ensure invariance to lighting and hand positioning. Used MaxPooling and dropout layers to build a compact, lightweight model capable of high accuracy and extremely low latency during inference.",
        process: [
            { phase: "Dataset Preparation", description: "Gathered gesture datasets, normalized image dimensions, and split cohorts." },
            { phase: "Data Augmentation", description: "Configured brightness adjustments, random rotations, and scales to generalize data." },
            { phase: "CNN Architecture", description: "Implemented stacking convolutional layers followed by Max Pooling, Dropout, and Dense layers." },
            { phase: "Training & Evaluation", description: "Trained using RMSprop optimizer, checking validation metrics to prevent early overfitting." },
            { phase: "Prediction Pipeline", description: "Constructed an inference class capable of receiving live camera images and returning gesture labels." }
        ],
        gallery: [
            { image: "/api/placeholder/800/600", title: "Live Prediction Output", description: "Captured frame showing overlay prediction of 'paper' gesture with 99% confidence." },
            { image: "/api/placeholder/800/600", title: "Validation Metrics", description: "Training and validation accuracy curve overlays showing stable training progression." }
        ],
        learnings: [
            "Using dropout (0.4) after dense layers prevents the network from memorizing hand boundaries, yielding 97%+ generalization accuracy.",
            "Brightness augmentation is critical for computer vision models that will be run under varying real-world lighting conditions.",
            "A lighter CNN (3 convolutional blocks) keeps latency below 12ms while retaining near-perfect classification scores on gesture datasets."
        ]
    }
];

export const ProjectsProvider = ({ children }) => {
    const [projects] = useState(projectsData);
    const [loading] = useState(false);

    const getProject = (slug) => {
        return projects.find(project => project.slug === slug);
    };

    const value = {
        projects,
        loading,
        getProject,
    };

    return (
        <ProjectsContext.Provider value={value}>
            {children}
        </ProjectsContext.Provider>
    );
};

export default ProjectsContext;
