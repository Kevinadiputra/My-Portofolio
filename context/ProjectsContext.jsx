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
        id: 1,
        slug: "above-ground-biomass-estimation",
        title: "Above Ground Biomass Estimation Using Machine Learning and Remote Sensing",
        tagline: "Estimating aboveground forest biomass and carbon stock using remote sensing and machine learning.",
        description: "Developed a machine learning model to estimate forest biomass using Random Forest and XGBoost. Utilized remote sensing datasets, LiDAR scans, and QGIS for spatial validation and analysis.",
        image: "/projects/analytics-dashboard.svg",
        technologies: ["Python", "Scikit-Learn", "Random Forest", "XGBoost", "QGIS", "Remote Sensing", "LiDAR"],
        category: "data-science",
        date: "2024",
        year: "2024",
        status: "Completed",
        liveUrl: "#",
        githubUrl: "#",
        featured: true,
        highlight: true,
        metrics: [
            { label: "R² Score", value: "0.87", description: "Biomass prediction variance explained" },
            { label: "RMSE", value: "12.4 tC/ha", description: "Root Mean Squared Error on test set" },
            { label: "MAE", value: "9.2 tC/ha", description: "Mean Absolute Error" },
            { label: "LiDAR Samples", value: "15,000+", description: "Annotated spatial data points" }
        ],
        overview: "As part of a carbon offsetting initiative, estimating aboveground biomass and carbon stock accurately is crucial. This project leverages remote sensing, LiDAR datasets, and machine learning (Random Forest and XGBoost) to model and estimate carbon levels across diverse forest regions, providing a scalable and cost-effective alternative to physical tree counting.",
        challenge: "The main challenges lay in processing high-dimensional and noisy spatial datasets from satellites, aligning LiDAR point cloud data with ground truth measurements, and addressing spatial autocorrelation during model validation. Overfitting on localized canopy features was also a major concern.",
        solution: "I developed a pipeline using Python and spatial analysis libraries to preprocess and clean the raster/vector data. Extracted vegetation indices (NDVI, EVI) from remote sensing images and combined them with canopy height models (CHM) from LiDAR. We trained Random Forest and XGBoost models, evaluating performance with MAE, RMSE, and R². QGIS was used to validate spatial estimations and map the carbon distribution visually.",
        process: [
            { phase: "Research", description: "Analyzed existing diagnostic architectures and reviewed domain literature on carbon estimation methodologies." },
            { phase: "Data Collection", description: "Aggregated multi-temporal satellite imagery and high-density LiDAR point clouds." },
            { phase: "Data Processing", description: "Calculated vegetation indices and normalized LiDAR returns to extract ground and canopy levels." },
            { phase: "Model Development", description: "Trained Random Forest and XGBoost estimators using nested spatial cross-validation." },
            { phase: "Evaluation", description: "Validated model performance using RMSE, MAE, and R² scores, assessing feature importance graphs." },
            { phase: "Visualization", description: "Generated spatial carbon density maps in QGIS for visual distribution analysis." }
        ],
        gallery: [
            { image: "/api/placeholder/800/600", title: "Biomass Density Mapping", description: "Spatial biomass distribution map plotted via QGIS." },
            { image: "/api/placeholder/800/600", title: "Feature Importance Chart", description: "XGBoost feature importances showing LiDAR height metrics dominate prediction power." }
        ],
        learnings: [
            "Integrating LiDAR height data with multispectral indices improves carbon stock prediction accuracy by 25% compared to satellite imagery alone.",
            "XGBoost handles non-linear canopy structures better than Random Forest, though it requires stricter regularization to prevent overfitting on local plots.",
            "Spatial validation is essential in geospatial modeling; standard random k-fold splits underestimate spatial prediction errors."
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
