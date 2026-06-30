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

Searches patent databases to identify similar inventions and evaluates prior art using PatentsView.

## 💡 Innovation Agent

Analyzes the originality of the invention and suggests improvements using Google Gemini AI.

## ⚙️ Feasibility Agent

Evaluates technical complexity, required technologies, development effort, and implementation feasibility.

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

<img width="1197" height="735" alt="Home Page" src="https://github.com/user-attachments/assets/0e6d901b-92a3-44b8-85db-b56356fbda5c" />

---

## 📊 Analysis Dashboard

<img width="1342" height="836" alt="Analysis Dashboard" src="https://github.com/user-attachments/assets/34acb652-e722-4943-9d5f-85e6007dc715" />

---

## 💡 Innovation Assessment

<img width="1097" height="835" alt="Innovation Assessment" src="https://github.com/user-attachments/assets/a46eabda-b314-4ae0-82b5-0da4be9b9e09" />

---

## ⚠️ Risk Assessment

<img width="1112" height="822" alt="Risk Assessment" src="https://github.com/user-attachments/assets/f9465b06-c64c-491e-a0aa-4bbb3793aaa9" />

---

# 🏗️ System Diagrams

## 🏛️ System Architecture

This diagram illustrates the overall architecture of PatentVerse, showing the interaction between the Next.js frontend, AI agents, Google Gemini API, PatentsView API, and the analysis modules.

<img width="466" height="372" alt="system arc" src="https://github.com/user-attachments/assets/25bfb2be-ce10-4240-964b-b83cedb2e674" />

---

## 🔄 Multi-Agent Pipeline

This workflow demonstrates how an invention idea is processed through the Similarity Agent, Innovation Agent, Feasibility Agent, and Risk Agent before generating the final patent intelligence report.

<img width="462" height="373" alt="mulit" src="https://github.com/user-attachments/assets/b96149f5-841f-4705-acf8-07846daf49cd" />


---

## 📊 Data Flow Diagram

This diagram explains how user input flows through the system, interacts with Google Gemini AI and PatentsView, and generates the final AI-powered patent analysis report.
<img width="923" height="251" alt="data flow" src="https://github.com/user-attachments/assets/f77f4432-3acf-4130-8d25-79b98e23f0be" />


---

# 🛠️ Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js API Routes

## Artificial Intelligence

- Google Gemini API

## External APIs

- Google Gemini API
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
├── diagrams/
│   ├── system_architecture.png
│   ├── multi_agent_pipeline.png
│   └── dataflow_diagram.png
├── styles/
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/Raksha28112005/patent-verse.git
```

## Navigate into the Project

```bash
cd patent-verse
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create a file named `.env.local`

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PATENTSVIEW_API_KEY=
```

## Start the Development Server

```bash
npm run dev
```

Open your browser and visit

```text
http://localhost:3000
```

---

# 🔑 Google Gemini API Setup

1. Visit Google AI Studio

https://aistudio.google.com/app/apikey

2. Sign in using your Google account.

3. Create a new API Key.

4. Copy the key into your `.env.local` file.

Example

```env
GEMINI_API_KEY=YOUR_API_KEY
```

---

# 📈 Output

PatentVerse generates:

- Patent Similarity Report
- Innovation Score
- Novelty Analysis
- Technical Feasibility Analysis
- Patent Risk Assessment
- Market Risk Assessment
- AI Recommendations
- Final Patent Intelligence Verdict

---

# 🎯 Applications

- Patent Research
- Startup Validation
- Product Innovation
- Research Projects
- Final Year Engineering Projects
- Technology Assessment
- Intellectual Property Analysis

---

# ⚠️ Important Notes

> [!IMPORTANT]
> A valid Google Gemini API Key is required to perform AI-powered patent analysis.

> [!WARNING]
> Never upload or commit your `.env.local` file or API key to GitHub.

> [!TIP]
> Store your API key securely in the `.env.local` file.

> [!NOTE]
> PatentVerse requires an active internet connection to communicate with Google Gemini and PatentsView APIs.

---

# 👩‍💻 Team

| Name | Contribution |
|------|--------------|
| Kusuma R | AI Integration & Backend Development |
| Meghana R | Similarity Analysis Module |
| Monikha M | Risk Assessment Module |
| Raksha R | Documentation, Testing & Deployment |

**Department of Computer Science and Engineering**

**Final Year Project**

---

# 📄 License

This project is licensed under the MIT License.
