import { InternshipTrack } from '../types';

export const INTERNSHIP_TRACKS: InternshipTrack[] = [
  {
    id: 'fullstack-web',
    title: 'Full-Stack Web Engineering',
    badge: 'Most Popular',
    category: 'Full Stack',
    shortDesc: 'Master modern frontend & backend architectures with React, Node.js, TypeScript, PostgreSQL, and cloud deployments.',
    durationOptions: ['4 Weeks', '8 Weeks', '12 Weeks'],
    stipendType: 'Performance & Project Based',
    prerequisites: ['Basic HTML/CSS', 'Basic JavaScript fundamentals'],
    skillsGained: ['React 19', 'Node.js & Express', 'PostgreSQL & Prisma', 'REST & GraphQL APIs', 'Tailwind CSS', 'Docker basics'],
    curriculum: [
      'Module 1: Advanced Frontend Systems & Modern State Management',
      'Module 2: Scalable Backend Services & Database Modeling',
      'Module 3: Authentication, Security & Role-Based Access Control',
      'Module 4: CI/CD Pipelines & Cloud Production Deployment'
    ],
    projects: [
      'Multi-tenant SaaS Collaboration Platform',
      'High-throughput E-Commerce API with Payment Integration'
    ],
    rating: 4.9,
    enrolledStudents: 14200,
    popular: true
  },
  {
    id: 'ai-ml-engineering',
    title: 'Generative AI & Machine Learning',
    badge: 'High Demand',
    category: 'AI & ML',
    shortDesc: 'Build real-world LLM applications, RAG pipelines, neural models, and fine-tuning workflows with PyTorch and LangChain.',
    durationOptions: ['4 Weeks', '8 Weeks', '12 Weeks'],
    stipendType: 'Performance & Project Based',
    prerequisites: ['Python basics', 'Fundamental Linear Algebra & Calculus'],
    skillsGained: ['PyTorch & TensorFlow', 'LLMs & LangChain', 'RAG Architectures', 'Vector Databases (Pinecone/Milvus)', 'FastAPI Model Serving'],
    curriculum: [
      'Module 1: Supervised & Unsupervised Machine Learning Foundations',
      'Module 2: Deep Learning, CNNs & Transformer Architectures',
      'Module 3: Retrieval-Augmented Generation (RAG) & Agentic AI',
      'Module 4: Model Optimization, Quantization & Production Serving'
    ],
    projects: [
      'Enterprise Knowledge Base RAG Assistant with Hybrid Search',
      'Multimodal Document Understanding & Automated Extraction Pipeline'
    ],
    rating: 4.95,
    enrolledStudents: 11800,
    popular: true
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Architecture & DevOps Engineering',
    badge: 'Industry Essential',
    category: 'Cloud & DevOps',
    shortDesc: 'Automate infrastructure, build containerized CI/CD systems, and manage clusters with AWS, Docker, Kubernetes, and Terraform.',
    durationOptions: ['4 Weeks', '8 Weeks', '12 Weeks'],
    stipendType: 'Performance & Project Based',
    prerequisites: ['Linux command line', 'Basic networking concepts'],
    skillsGained: ['AWS Solutions Architecture', 'Docker & Containerization', 'Kubernetes Orchestration', 'Terraform IaC', 'GitHub Actions CI/CD', 'Prometheus & Grafana'],
    curriculum: [
      'Module 1: Linux System Administration & Cloud Foundations (AWS)',
      'Module 2: Containers & Microservices with Docker',
      'Module 3: Kubernetes Pod Management, Ingress & Deployments',
      'Module 4: Infrastructure as Code (Terraform) & Zero-Downtime CI/CD'
    ],
    projects: [
      'Automated GitOps Multi-Environment Kubernetes Cluster',
      'High-Availability Cloud Architecture with Auto-scaling & Monitoring'
    ],
    rating: 4.85,
    enrolledStudents: 8900
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security & Ethical Hacking',
    badge: 'Certified',
    category: 'Cyber Security',
    shortDesc: 'Learn offensive & defensive cybersecurity techniques, network penetration testing, OWASP Top 10 vulnerabilities, and digital forensics.',
    durationOptions: ['4 Weeks', '8 Weeks', '12 Weeks'],
    stipendType: 'Performance & Project Based',
    prerequisites: ['Networking fundamentals (TCP/IP)', 'Basic Linux commands'],
    skillsGained: ['Wireshark & Nmap', 'Burp Suite & OWASP Top 10', 'Penetration Testing', 'Network Defense', 'Cryptography & SOC Analysis'],
    curriculum: [
      'Module 1: Network Protocols, Reconnaissance & Vulnerability Scanning',
      'Module 2: Web Application Security Auditing & Exploit Analysis',
      'Module 3: Cryptographic Systems, SSL/TLS & Identity Hardening',
      'Module 4: Incident Response, SIEM Monitoring & Red/Blue Team Labs'
    ],
    projects: [
      'Full-scope Vulnerability Assessment Report on Staging Web Infrastructure',
      'Intrusion Detection System (IDS) Rule Config & Log Analysis Tool'
    ],
    rating: 4.88,
    enrolledStudents: 7400
  },
  {
    id: 'data-science',
    title: 'Data Science & Business Intelligence',
    badge: 'Trending',
    category: 'Data Science',
    shortDesc: 'Transform raw data into strategic insights with Python, Pandas, Advanced SQL, PowerBI dashboards, and predictive modeling.',
    durationOptions: ['4 Weeks', '8 Weeks', '12 Weeks'],
    stipendType: 'Performance & Project Based',
    prerequisites: ['Basic mathematics/statistics', 'Basic Python or Excel'],
    skillsGained: ['Pandas & NumPy', 'Advanced SQL & Data Warehousing', 'PowerBI & Tableau', 'Statistical Testing', 'Predictive Modeling'],
    curriculum: [
      'Module 1: Exploratory Data Analysis & Advanced SQL Queries',
      'Module 2: Statistical Hypothesis Testing & Experimentation',
      'Module 3: Interactive Executive Dashboards in PowerBI',
      'Module 4: Predictive Regression & Classification Models'
    ],
    projects: [
      'Customer Lifetime Value & Churn Prediction Model',
      'Executive KPI Dashboard with Real-time Data Pipeline'
    ],
    rating: 4.8,
    enrolledStudents: 9600
  },
  {
    id: 'mobile-app-dev',
    title: 'Cross-Platform Mobile App Development',
    badge: 'Hands-on',
    category: 'Mobile Dev',
    shortDesc: 'Design, develop, and publish cross-platform iOS & Android mobile applications using Flutter / React Native with backend sync.',
    durationOptions: ['4 Weeks', '8 Weeks', '12 Weeks'],
    stipendType: 'Performance & Project Based',
    prerequisites: ['Basic programming in JavaScript or Dart/Java'],
    skillsGained: ['Flutter & Dart / React Native', 'State Management (Riverpod/Zustand)', 'Offline-first SQLite/Realm', 'Push Notifications', 'App Store & Play Store Deployment'],
    curriculum: [
      'Module 1: Mobile UI Design Patterns & Component Architecture',
      'Module 2: State Management & Local Offline Storage',
      'Module 3: Hardware APIs (Camera, GPS, Biometrics) & Push Alerts',
      'Module 4: Release Management, Code Signing & App Store Publishing'
    ],
    projects: [
      'Fintech Expense & Budget Tracking Mobile Application',
      'On-demand Delivery Tracker with Real-time GPS Location Sync'
    ],
    rating: 4.82,
    enrolledStudents: 6800
  }
];
