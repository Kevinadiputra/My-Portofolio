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
        image: "/projects/carbon-dashboard.png",
        technologies: ["Python", "Streamlit", "Folium", "Scikit-Learn", "GeoPandas", "QGIS", "Plotly", "GIS", "Machine Learning"],
        category: "data-science",
        date: "2026",
        year: "2026",
        status: "Completed",
        liveUrl: "#",
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
        challenge: "Data geospasial mentah (shapefile dan GeoPackage) dan hasil prediksi model estimasi machine learning umumnya sangat kompleks untuk dipahami oleh pihak manajemen dan tim K3LH non-teknis. Dibutuhkan visualisasi terpadu yang menampilkan persebaran spasial karbon per blok RTH, hubungan allometrik variabel fisik, serta tren temporal secara real-time.",
        solution: "Mengembangkan dashboard interaktif menggunakan Python dan framework Streamlit. Peta interaktif spasial dirender menggunakan Folium (`streamlit-folium`) untuk menampilkan heatmap densitas karbon per blok (Kalidoni dan Ilir Timur II). Selain itu, grafik Plotly ditambahkan untuk menunjukkan hubungan allometrik diameter pohon vs biomassa, chart distribusi donut spesies, serta treemap kontribusi karbon per blok.",
        process: [
            { phase: "GIS Preprocessing", description: "Mengolah batas-batas koordinat blok RTH PT Pusri dan memetakan indeks NDVI dari citra drone menggunakan QGIS." },
            { phase: "Estimasi Machine Learning", description: "Melatih model XGBoost dan Random Forest menggunakan data latih DBH fisik pohon untuk memprediksi AGB." },
            { phase: "UI & Layout Design", description: "Merancang antarmuka dashboard Streamlit dengan sidebar filter interaktif (Tahun, Area, Jenis Vegetasi)." },
            { phase: "Visualisasi & Integrasi Map", description: "Mengintegrasikan peta interaktif Folium, chart hubungan allometrik, serta diagram donut kontribusi karbon." }
        ],
        gallery: [
            { image: "/projects/carbon-dashboard.png", title: "PT Pusri Carbon Monitoring Dashboard Interface", description: "Main Dashboard Page" },
            { image: "/projects/carbon-map.png", title: "Folium interactive mapping showing carbon density distribution across green open space blocks.", description: "Interactive GIS Map" },
            { image: "/projects/carbon-comparison.png", title: "Plotly comparison charts mapping machine learning model prediction vs actual ground measurements.", description: "Predicted vs Actual Validation" },
            { image: "/projects/carbon-feature-importance.png", title: "Feature importance weights displaying variables contributing to the carbon stock estimation.", description: "Feature Importance Chart" }
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
        title: "User Behavior Predictive Analysis",
        tagline: "Predicting user activity and behavior patterns using machine learning.",
        description: "Built a predictive model to analyze and forecast user activity levels and behavior patterns using historical usage logs and engagement metrics.",
        image: "/projects/recommendation-system.svg",
        technologies: ["Python", "Pandas", "NumPy", "Scikit-Learn", "Matplotlib"],
        category: "data-science",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Accuracy", value: "91.2%", description: "Classification score on test cohort" },
            { label: "Precision", value: "89.5%", description: "Positive class positive predictive value" },
            { label: "Recall", value: "92.1%", description: "Proportion of target behaviors identified" },
            { label: "Users Analyzed", value: "50,000+", description: "Historical log records processed" }
        ],
        overview: "Understanding user retention and engagement patterns is a core business need. This project focuses on building a machine learning model to classify and predict user activity levels, identifying users at risk of churning based on historical logs and engagement data.",
        challenge: "Raw user log files are massive, time-series dependent, and highly unstructured. We faced challenges in feature engineering to capture temporal trends (like drop-offs in usage frequency) and handling imbalanced datasets where active users vastly outnumbered inactive ones.",
        solution: "I developed an end-to-end data science pipeline. First, I performed extensive data preprocessing and cleaning using Pandas and NumPy. Next, I engineered rolling engagement features (e.g., active days per week, session duration ratios). I trained classification models (Logistic Regression, Random Forest) using Scikit-Learn and handled class imbalance using SMOTE. Performance was visualized using Matplotlib.",
        process: [
            { phase: "Data Preprocessing", description: "Addressed missing values, converted timestamp strings, and removed duplicate logs." },
            { phase: "Exploratory Data Analysis", description: "Analyzed user engagement trends and identified correlations between usage drop-offs and churn." },
            { phase: "Feature Engineering", description: "Created windowed features mapping usage frequency, session lengths, and login consistency." },
            { phase: "Model Development", description: "Trained Random Forest and Logistic Regression classifiers, tuning hyperparameters with grid search." },
            { phase: "Evaluation", description: "Evaluated classifiers using confusion matrices, ROC-AUC curves, and F1 scores." },
            { phase: "Visualization", description: "Plotted ROC curves and feature importance bar plots to present model findings." }
        ],
        gallery: [
            { image: "/api/placeholder/800/600", title: "ROC Curve Analysis", description: "Classifier performance curves comparing Random Forest and baseline models." },
            { image: "/api/placeholder/800/600", title: "Engagement Distribution", description: "User cohort distribution classified by activity level over time." }
        ],
        learnings: [
            "Temporal features, such as rate of change in usage duration, are the strongest predictors of user behavior changes.",
            "Proper scaling and preprocessing of behavioral data prevents distance-based models from being skewed by outliers.",
            "Balancing target labels is critical; otherwise, the model fails to identify the minority churn category."
        ]
    },
    {
        id: 3,
        slug: "ecommerce-data-analysis",
        title: "E-Commerce Data Analysis",
        tagline: "Uncovering sales trends and customer behavior in retail transaction data.",
        description: "Performed end-to-end analysis of e-commerce transaction data to uncover business insights, customer behavior trends, and sales metrics.",
        image: "/projects/etl-pipeline.svg",
        technologies: ["Python", "Pandas", "Matplotlib", "Seaborn", "Jupyter Notebook"],
        category: "data-science",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: true,
        highlight: true,
        metrics: [
            { label: "Transactions", value: "100,000+", description: "Cleaned and processed transaction entries" },
            { label: "Sales Insights", value: "8 Key", description: "Strategic retail patterns identified" },
            { label: "Processing Speed", value: "< 2s", description: "Analysis run duration in Jupyter" },
            { label: "Visual Reports", value: "12 Charts", description: "Custom plots detailing customer behavior" }
        ],
        overview: "Modern retail stores generate huge amounts of transaction logs. This project analyzes transaction datasets to identify purchase trends, customer demographics, peak sales hours, and high-performing product categories to inform inventory and marketing strategies.",
        challenge: "The raw database entries had significant cleaning issues, including cancelled orders, duplicate transactions, and empty fields. Visualizing multidimensional sales trends clearly without cluttering reports was also a priority.",
        solution: "I constructed a Jupyter Notebook workflow to clean and analyze the dataset. Removed erroneous and returned transaction records. Conducted customer behavior analysis (RFM - Recency, Frequency, Monetary scoring) and visualized sales trends and category distributions using Matplotlib and Seaborn.",
        process: [
            { phase: "Data Cleaning", description: "Identified and removed missing customer identifiers, cancellations, and duplicate database keys." },
            { phase: "Exploratory Analysis", description: "Aggregated monthly and hourly transaction volumes to map customer purchasing windows." },
            { phase: "Customer Analysis", description: "Conducted RFM analysis to segment the customer base into distinct value tiers." },
            { phase: "Visualization", description: "Generated custom heatmaps, bar charts, and line plots to represent demographic and category distributions." },
            { phase: "Reporting", description: "Synthesized observations into actionable recommendations for inventory stocking." }
        ],
        gallery: [
            { image: "/api/placeholder/800/600", title: "RFM Segment Heatmap", description: "Heatmap displaying user density categorized by Recency and Frequency scores." },
            { image: "/api/placeholder/800/600", title: "Sales Revenue Trend", description: "Aggregated timeline chart tracking sales peaks across different days of the week." }
        ],
        learnings: [
            "Cleaning returns and cancellations is crucial; leaving them in skews daily sales peaks by up to 15%.",
            "Seaborn visualizations, such as correlation heatmaps and boxplots, are highly effective in communicating customer density to non-technical stakeholders.",
            "Segmenting customer profiles by RFM metrics allows targeted marketing campaigns, increasing repeat purchases."
        ]
    },
    {
        id: 4,
        slug: "cifar10-image-classification",
        title: "CIFAR-10 Image Classification",
        tagline: "Deep learning image classifier for general object categories.",
        description: "Developed and optimized image classification models using convolutional neural networks (CNN) on the CIFAR-10 dataset.",
        image: "/projects/medical-image.svg",
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
            { label: "Accuracy", value: "86.5%", description: "Test set classification accuracy" },
            { label: "CNN Layers", value: "8 Conv", description: "Optimized model depth structure" },
            { label: "Parameters", value: "1.2M", description: "Trainable neural network variables" },
            { label: "Inference Time", value: "< 15ms", description: "Inference duration per 32x32 image" }
        ],
        overview: "Image classification is a fundamental computer vision task. This project uses the CIFAR-10 dataset (60,000 32x32 color images across 10 classes) to train, refine, and optimize convolutional neural networks, establishing benchmark architectures for object detection.",
        challenge: "The low resolution (32x32) of CIFAR-10 images makes feature extraction difficult, as fine-grained details are lost. We also had to deal with fast overfitting due to the relatively shallow nature of standard CNNs when scaled.",
        solution: "I developed a multi-layer CNN using TensorFlow and Keras. Implemented data augmentation (random flips, shifts, zooms) to combat overfitting. Integrated Batch Normalization and Dropout layers after convolutional blocks to stabilize learning. Used learning rate scheduling and early stopping to find the optimal training stop point.",
        process: [
            { phase: "Data Preprocessing", description: "Normalized pixel values to [0,1] range and split dataset into training, validation, and test cohorts." },
            { phase: "Data Augmentation", description: "Applied random rotations, translations, and horizontal flips to prevent overfitting." },
            { phase: "Model Development", description: "Designed a multi-stage CNN architecture with Batch Normalization and Dropout layers." },
            { phase: "Model Optimization", description: "Configured learning rate decay, Adam optimizer, and early stopping callbacks." },
            { phase: "Performance Evaluation", description: "Assessed training curves, computed confusion matrices, and calculated per-class F1-scores." }
        ],
        gallery: [
            { image: "/api/placeholder/800/600", title: "Loss Curves", description: "Plot showing training vs validation loss across 50 epochs." },
            { image: "/api/placeholder/800/600", title: "Confusion Matrix", description: "Detailed matrix tracking model errors across the 10 object classes." }
        ],
        learnings: [
            "Batch Normalization significantly speeds up convergence, reducing required training epochs by 40%.",
            "Data augmentation is essential for generalizing small-resolution images; it raised test accuracy by 8%.",
            "Deep architectures without residual paths face vanishing gradient problems; bottleneck layers help preserve representation."
        ]
    },
    {
        id: 5,
        slug: "sentiment-analysis-subway-surfers",
        title: "Sentiment Analysis on Subway Surfers Reviews",
        tagline: "NLP system for analyzing mobile game review sentiments.",
        description: "Performed sentiment analysis on user reviews of the Subway Surfers mobile game using natural language processing (NLP) techniques.",
        image: "/projects/sentiment-engine.svg",
        technologies: ["Python", "NLP", "TensorFlow", "Pandas", "Scikit-Learn"],
        category: "nlp",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: false,
        highlight: false,
        metrics: [
            { label: "Accuracy", value: "88.7%", description: "Sentiment classification accuracy" },
            { label: "Reviews Scraped", value: "20,000+", description: "Play Store user reviews processed" },
            { label: "Vocabulary Size", value: "15,000", description: "Unique token dictionary length" },
            { label: "F1 Score", value: "0.87", description: "Weighted harmonic mean score" }
        ],
        overview: "App store reviews contain vital user feedback, but reading them manually is impossible at scale. This project uses Natural Language Processing (NLP) to parse, clean, and classify player reviews of the game Subway Surfers into positive, negative, and neutral sentiments, allowing developers to spot bug complaints and feature requests instantly.",
        challenge: "App reviews are filled with informal slang, emojis, spelling mistakes, and abbreviations. Standard text processing fails on such text. Classifying mixed-sentiment reviews (e.g., 'Love the game but it keeps crashing') was also difficult.",
        solution: "I built an NLP text preprocessing pipeline in Python, performing tokenization, lemmatization, stop-word removal, and cleaning slang. Converted text to numeric vectors using TF-IDF and word embeddings. Trained and compared classification models (Naive Bayes, Logistic Regression, LSTM using TensorFlow) to identify the optimal sentiment classifier.",
        process: [
            { phase: "Text Preprocessing", description: "Cleaned HTML tags, handled emoji mappings, lowercased, and performed tokenization." },
            { phase: "Text Normalization", description: "Removed custom stop-words and applied lemmatization to extract root word forms." },
            { phase: "Vectorization", description: "Transformed text inputs into numerical representations using TF-IDF and word tokenizers." },
            { phase: "Sentiment Classification", description: "Trained Naive Bayes and deep LSTM networks to classify sentiments as positive, negative, or neutral." },
            { phase: "Evaluation & Analytics", description: "Analyzed word frequencies and generated word clouds highlighting core feedback issues." }
        ],
        gallery: [
            { image: "/api/placeholder/800/600", title: "Word Frequency Cloud", description: "Word cloud mapping the most common words in negative reviews (e.g., 'crash', 'lag')." },
            { image: "/api/placeholder/800/600", title: "Model Accuracy Comparison", description: "Bar chart comparing Naive Bayes, Random Forest, and LSTM accuracy scores." }
        ],
        learnings: [
            "Lemmatization preserves the semantic roots of words better than simple stemming, raising classifier precision.",
            "LSTM networks capture word order and dependencies (e.g., handling negations like 'not good') much better than bag-of-words models.",
            "Informal text cleaning (such as mapping emojis to words) preserves sentiment signals that would otherwise be discarded as noise."
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
