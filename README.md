# 🚀 PatentVerse – AI Patent Intelligence Platform

PatentVerse is an AI-powered multi-agent patent intelligence platform that analyzes invention ideas using Google Gemini AI and patent prior-art search. It helps inventors, researchers, startups, and students evaluate the novelty, feasibility, and risks of their ideas before investing time and resources.

---

# ✨ Features

- 🔍 Prior Art (Patent Similarity) Search
- 💡 Innovation & Novelty Assessment
- ⚙️ Technical Feasibility Analysis
- ⚠️ Patent & Market Risk Evaluation
- 📊 AI-generated Patent Intelligence Report
- 🤖 Multi-Agent AI Workflow
- 🌐 Modern Next.js Dashboard
- 🎨 Responsive Dark UI

---

# 🧠 AI Agents

## 🔍 Similarity Agent

Searches patent databases to identify similar inventions and evaluates prior art.

## 💡 Innovation Agent

Analyzes the originality of the invention and suggests improvements using Google Gemini AI.

## ⚙️ Feasibility Agent

Evaluates technical complexity, required technologies, estimated development effort, and implementation feasibility.

## ⚠️ Risk Agent

Analyzes:

- Patent Risk
- Technical Risk
- Market Risk

and generates the final recommendation.

---

# 🔄 Multi-Agent Workflow

```text
User Idea
     │
     ▼
Similarity Agent
     │
     ▼
Innovation Agent
     │
     ▼
Feasibility Agent
     │
     ▼
Risk Agent
     │
     ▼
Patent Intelligence Report
```

---

# 📸 Application Screenshots

## 🏠 Home Page

![Home Page](screenshots/home_page.png)

---

## 📊 Analysis Dashboard

![Analysis Dashboard](screenshots/analysis_dashboard.png)

---

## 💡 Innovation Assessment

![Innovation](screenshots/innovation_page.png)

---

## ⚠️ Risk Assessment

![Risk](screenshots/risk_page.png)

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js API Routes

## AI

- Google Gemini API

## APIs

- Google Gemini
- PatentsView API

---

# 📂 Project Structure

```text
PatentVerse
│
├── app/
├── components/
├── lib/
├── public/
├── screenshots/
├── styles/
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Raksha28112005/patent-verse.git
```

Go inside

```bash
cd patent-verse
```

Install packages

```bash
npm install
```

Create a `.env.local` file

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PATENTSVIEW_API_KEY=
```

Start the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

---

# 🔑 Google Gemini API

Get a free API key from

https://aistudio.google.com/app/apikey

Copy it into

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

# 📈 Output

PatentVerse generates:

- Patent Similarity Report
- Innovation Score
- Novelty Analysis
- Technical Feasibility
- Patent Risk
- Market Risk
- Final AI Verdict

---

# 🎯 Applications

- Patent Research
- Startup Validation
- Research Projects
- Final Year Projects
- Product Innovation
- Idea Validation

---

# ⚠️ Important

The `.env.local` file is intentionally excluded from GitHub.

Never commit your Gemini API Key.

---

# 👩‍💻 Team

| Name | Contribution |
|------|--------------|
| Kusuma R | AI Integration |
| Meghana R | Similarity Analysis |
| Monikha M | Risk Analysis |
| Raksha R | Documentation, Testing & Deployment |

Department of Computer Science and Engineering

---

# 📄 License

This project is licensed under the MIT License.
