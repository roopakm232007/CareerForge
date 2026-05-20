# 🔥 CareerForge

<div align="center">

![CareerForge Banner](https://img.shields.io/badge/CareerForge-AI%20Powered%20Career%20Platform-6366f1?style=for-the-badge&logo=rocket&logoColor=white)

**Your AI-powered career co-pilot — from resume to internship, all in one place.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-F55036?style=flat-square&logo=ai)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](#) • [Features](#-features) • [Setup](#-getting-started) • [Screenshots](#-screenshots)

</div>

---

## 🚀 What is CareerForge?

CareerForge is an AI-powered career guidance platform built for students and freshers. It helps you:

- 🎤 **Build your resume** by answering voice-based interview questions
- 📊 **Analyze your skill gaps** based on your target role
- 🗺️ **Get a personalized learning roadmap** to fill those gaps
- 💼 **Discover internship opportunities** that match your profile

No more guessing what skills you need. CareerForge tells you exactly what to learn and where.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🎤 Voice Resume Builder | Speak your answers, AI generates a professional resume |
| 📊 Skill Gap Analysis | Compare your skills vs what top companies want |
| 🗺️ Learning Roadmap | Curated free resources for every missing skill |
| 💼 Internship Matcher | Find real internships matching your target role |
| 🔐 Firebase Auth | Secure login and user data management |
| 📄 PDF Export | Download your resume as a polished PDF |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router v7
- **AI Engine:** Groq API (LLaMA 3.3 70B)
- **Auth & DB:** Firebase v12
- **PDF:** jsPDF + html2canvas
- **Styling:** Pure CSS (no UI library — fully custom)

---

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- A [Groq API Key](https://console.groq.com)
- A [Firebase Project](https://console.firebase.google.com)

### Installation

```bash
git clone https://github.com/roopakm232007/CareerForge.git
cd CareerForge
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_GROQ_KEY=your_groq_api_key_here
```

### Run Locally

```bash
npm start
```

---

## 📁 Project Structure
CareerForge/
├── src/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Interview.jsx
│   │   ├── Resume.jsx
│   │   ├── SkillGap.jsx
│   │   └── JobMatcher.jsx
│   └── firebase.js
├── .env
└── package.json
---

## 🔮 Roadmap

- [ ] LinkedIn profile import
- [ ] Mock interview with AI feedback
- [ ] Resume scoring system
- [ ] Email alerts for new internships

---

## 👨‍💻 Author

**Roopak M** — [@roopakm232007](https://github.com/roopakm232007)

---

<div align="center">

Made with ❤️ for students who deserve better career tools.

⭐ Star this repo if you found it helpful!

</div>
