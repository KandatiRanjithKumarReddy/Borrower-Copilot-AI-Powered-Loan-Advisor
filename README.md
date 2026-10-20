<div align="center">

# 🛡️ Borrower Copilot

### *The Borrower's Side of the Table.*

### *Know what you can afford before you negotiate.*

A full-stack financial self-assessment system, negotiation card generator, and AI-powered loan advisor designed for Indian retail borrowers.

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://borrower-copilot-pi.vercel.app)

<br/>

### 🚀 [Live Application](https://borrower-copilot-pi.vercel.app) &nbsp;|&nbsp; ⚡ [Backend API Health](https://borrower-copilot-backend.vercel.app/api/health) &nbsp;|&nbsp; 📦 [GitHub Repository](https://github.com/KandatiRanjithKumarReddy/Borrower-Copilot)

<br/>

[Key Features](#-key-features) •
[Core Thesis](#-core-thesis) •
[BorrowerIQ AI](#-borroweriq-ai-insights) •
[System Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[Database Schema](#-database-schema) •
[Quick Start](#-quick-start) •
[Deployment](#-deployment) •
[Financial Engine](#-financial-rules-engine) •
[Privacy Commitment](#-privacy--security-commitment)

<br/>

</div>

---

## 💡 Core Thesis

```
┌────────────────────────────────────────────────────────────────────────┐
│               Lender Eligibility  ≠  Borrower Affordability            │
└────────────────────────────────────────────────────────────────────────┘
```

Standard bank calculators answer: **"What is the maximum amount we can extract from this borrower?"**  
**Borrower Copilot** answers: **"What is the maximum amount this borrower can repay without risking household financial distress?"**

It sits firmly on the borrower's side of the table, arming consumers with mathematical truth, fair interest rate ranges, plain-English **BorrowerIQ** insights, and an actionable **Negotiation Card** before speaking with loan officers.

---

## 🎯 The Four Critical Questions

| # | Question | Decision-Support Output | Engine Derivation |
|:---:|:---|:---|:---|
| **1** | **Should I borrow at all?** | `BORROW` · `BORROW LESS` · `DON'T BORROW` | Multi-variable decision matrix factoring FOIR, stress buffers, bounce history & high-cost debt |
| **2** | **How much am I really eligible for?** | **Lender-Indicative** vs **Borrower-Safe** Amount | Exposes the dangerous gap between what a bank will sanction vs what income supports |
| **3** | **What is a fair interest rate?** | **Fair Rate Range (Min–Max)** + **True APR** | Product-indexed base rates with risk adjustments; APR solved via Newton-Raphson iteration |
| **4** | **What EMI should I commit to?** | **EMI Ceiling** + **Tenure Trade-Off Matrix** | Constrained by minimum of FOIR threshold and uncommitted monthly cash surplus |

---

## ✨ Key Features

- **⚡ Adaptive 5-Step Diagnostic** — Contextual question flow dynamically tailored for *Salaried*, *Self-Employed*, and *Informal/Gig* workers.
- **🛡️ Honest Decision Engine** — Built to protect borrowers. The engine decisively outputs **`DON'T BORROW`** when debt-traps or cash-flow insolvency are detected.
- **📊 True Dual-Amount Visualization** — Side-by-side comparative bar revealing when a lender's sanctioned offer overshoots the borrower's safe repayment capacity.
- **🏷️ Multi-Factor Fair Rate Band** — Evaluates credit tiers, job stability, income variance, and penalizes predatory APRs.
- **🔬 Mathematical APR Solver** — Numerical Newton-Raphson algorithm computing effective annual percentage rate accounting for processing fees and 18% GST.
- **🌪️ Dual-Shock Stress Testing** — Evaluates resilience under:
  - **Income Shock:** Immediate 15% reduction in net monthly earnings.
  - **Rate Shock:** +200 bps (+2.0%) interest spike for floating-rate loans.
- **🎴 Single-Screen Negotiation Card** — Clean, printer-friendly summary with high-leverage talking points tailored to the borrower's exact profile.
- **🧠 BorrowerIQ AI Insights** — 5 plain-English strategic takeaways highlighting budget defense, bank sales tactics, emergency buffers, tenure adjustments, and prepayment defense.
- **💬 Floating User Feedback Widget** — Global, persistent bottom-right modal allowing borrowers to submit Ideas, Problems, and suggestions directly into MySQL.
- **🔐 User Accounts & Assessment History** — JWT authentication, Google OAuth sign-in, profile management, and saved diagnostic timelines.

---

## 🧠 BorrowerIQ AI Insights

BorrowerIQ evaluates your numerical assessment through our backend analytical engine to deliver five clear, personalized takeaway points:

1. **Household Budget Impact:** What this payment means for daily living, rent, and monthly savings.
2. **Bank Sales vs Your Protection:** Why lenders push higher loan amounts to meet sales targets, and why sticking to your safe limit protects your family.
3. **Emergency Buffer:** Keeping family safety savings untouched rather than draining them for loan fees or down payments.
4. **Practical Adjustment Tip:** How adjusting tenure or down payment keeps monthly payments comfortable.
5. **Prepayment Defense & Add-on Trap:** How opting out of unnecessary lender-bundled insurance packages and making small early principal prepayments slashes front-loaded interest without stressing monthly cash flow.

### Automatic Model Fallback Cascade
To guarantee high availability and resilience under rate limits, BorrowerIQ implements an automated model cascade:
1. Primary: `gemini-3.8-flash`
2. Fallback 1: `gemini-3.7-flash`
3. Fallback 2: `gemini-3.5-flash-lite`

All model and vendor names are sanitized in the user interface to preserve clean consumer-facing branding.

---

## 🏛️ System Architecture

Borrower Copilot is built as a modern, decoupled full-stack application deployed on cloud infrastructure:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  FRONTEND · Vercel Edge Network                                │
│                  https://borrower-copilot-pi.vercel.app                        │
│                  React 19 + Vite + Tailwind CSS 4                              │
│                                                                                 │
│  LandingPage ──► Questionnaire ──► ResultsPage ──► NegotiationCard              │
│       │                 │                │                                      │
│  AboutPage         ContactPage    AssessmentHistory    PrivacyPolicy            │
│                                                                                 │
│  [HeaderBrand with Profile Dropdown]    [Floating FeedbackWidget]               │
└──────────────────────────────────┬──────────────────────────────────────────────┘
                                   │ REST API (JSON / Bearer JWT)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  BACKEND · Vercel Serverless Functions                          │
│                  https://borrower-copilot-backend.vercel.app                    │
│                  Node.js + Express + TypeScript                                 │
│                                                                                 │
│  /api/auth          - Register, Login, Google OAuth, Profile (/me)              │
│  /api/assessments   - Create, List, Detail, Preview, BorrowerIQ AI              │
│  /api/contact       - Inquiries & Message Submissions                           │
│  /api/feedback      - Idea / Problem / Other Categorized Feedback               │
│  /api/health        - Database & Service Health Check                            │
└───────────────────┬─────────────────────────────────┬───────────────────────────┘
                    │                                 │
                    ▼                                 ▼
       ┌─────────────────────────────┐   ┌─────────────────────────────┐
       │   Aiven Cloud MySQL 8.0     │   │   Google Gemini AI API      │
       │   (Managed · SSL · 5 Tables)│   │   (Model Fallback Cascade)  │
       └─────────────────────────────┘   └─────────────────────────────┘
```

---

## 💻 Tech Stack

| Tier | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | `React 19` | Modern concurrent rendering, fast client-side state management |
| **Frontend Styling** | `Tailwind CSS 4.0` | High-performance CSS engine with customized tokens |
| **Build Tooling** | `Vite 6.0` | Lightning-fast development server and optimized production bundling |
| **Backend Framework** | `Express 4.21` | REST API routes, authentication middleware, error handling |
| **Runtime & Language** | `Node.js 18+` / `TypeScript 5.7` | Strict end-to-end type safety across engine and API contracts |
| **Database** | `MySQL 8.0` (`mysql2/promise`) | Relational persistence with foreign keys and index optimization |
| **Authentication** | `JWT` + `bcryptjs` + Google OAuth | Salted password hashing and secure token sessions |
| **AI Integration** | `@google/genai` | Multi-model fallback cascade for BorrowerIQ insights |
| **Icons & Typography** | `Lucide React` + `Inter` | Clean stroke iconography and legible tabular financial figures |

---

## 🗄️ Database Schema

The backend uses a normalized MySQL database (`project3`) containing five core tables:

1. **`users`** — User credentials (email, bcrypt password hash, Google ID, display name, created_at).
2. **`assessments`** — Saved financial diagnostics with foreign key to `users(id)`, storing JSON inputs and calculated results.
3. **`ai_summaries`** — BorrowerIQ insights associated with assessments, caching generated text and the model used.
4. **`contact_inquiries`** — General support inquiries submitted through the Contact page.
5. **`feedback`** — User feedback submitted via the floating widget, categorized by `ENUM('Idea', 'Problem', 'Other')`.

---

## 📁 Repository Structure

```
p3/
├── README.md                    # Project documentation
├── back-end/                    # Express + TypeScript Backend
│   ├── src/
│   │   ├── config/              # Database connection pool and environment validation
│   │   ├── controllers/         # Auth, Assessment, Contact, Feedback controllers
│   │   ├── middleware/          # JWT authentication and user validation
│   │   ├── migrations/          # schema.sql database definition
│   │   ├── routes/              # Express API route declarations
│   │   ├── services/            # Gemini AI service, assessment services
│   │   └── index.ts             # Express application entry point
│   ├── package.json
│   └── tsconfig.json
│
└── front-end/                   # React 19 + TypeScript Frontend
    ├── src/
    │   ├── api/client.ts        # Typed API client for auth, assessment, feedback, contact
    │   ├── components/          # UI components (Header, Footer, Modals, Pages, Widgets)
    │   │   ├── AboutPage.tsx        # Purpose, Affordability vs Eligibility, Diagnostic Suite
    │   │   ├── AiSummaryCard.tsx    # BorrowerIQ 5 Key Takeaways with bold styling
    │   │   ├── AssessmentHistory.tsx # Saved diagnostic timeline
    │   │   ├── AuthModal.tsx        # Login & registration modal with Google Sign-In
    │   │   ├── ContactPage.tsx      # Contact form and expanded borrower FAQs
    │   │   ├── FeedbackWidget.tsx   # Floating Send Feedback modal (Idea/Problem/Other)
    │   │   ├── Footer.tsx           # 3-column layout, Ranjith ♡ credit, Privacy Policy link
    │   │   ├── HeaderBrand.tsx      # Navigation, styled red logout, profile dropdown
    │   │   ├── LandingPage.tsx      # Hero, verified privacy banner, demo personas
    │   │   ├── LoginPage.tsx        # Standalone login view
    │   │   ├── NegotiationCard.tsx  # Printable negotiation cheat-sheet
    │   │   ├── PrivacyPolicyPage.tsx # Dedicated transparent privacy disclosures
    │   │   ├── ProfileModal.tsx     # User profile editor
    │   │   ├── Questionnaire.tsx    # 5-stage borrower diagnostic
    │   │   ├── RegisterPage.tsx     # Standalone account creation view
    │   │   └── ResultsPage.tsx      # Full diagnostic dashboard
    │   ├── engine/              # Headless financial rules engine
    │   ├── utils/               # Currency formatters, persona definitions
    │   ├── App.tsx              # Main application router
    │   └── main.tsx             # React mount
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MySQL**: 8.0+ running locally, or a cloud-hosted MySQL instance (e.g. [Aiven](https://aiven.io/))
- **Google Gemini API Key**: from [Google AI Studio](https://aistudio.google.com/)
- **Google OAuth Client ID**: from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 1. Clone the Repository
```bash
git clone https://github.com/KandatiRanjithKumarReddy/Borrower-Copilot.git
cd Borrower-Copilot
```

### 2. Database Setup
Create the MySQL database and run the schema migration:
```sql
CREATE DATABASE project3;
USE project3;
SOURCE back-end/src/migrations/schema.sql;
```

### 3. Backend Setup
```bash
cd back-end
npm install
cp .env.example .env
# Edit .env with your database, JWT, Gemini, and OAuth credentials
npm run build
npm start
```

### 4. Frontend Setup
```bash
cd front-end
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:3001
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## ☁️ Deployment

Borrower Copilot is deployed on **Vercel** (frontend + backend) with **Aiven Cloud MySQL** as the managed database.

| Service | Platform | Live URL |
|---|---|---|
| **Frontend** | Vercel (Edge) | [borrower-copilot-pi.vercel.app](https://borrower-copilot-pi.vercel.app) |
| **Backend API** | Vercel (Serverless) | [borrower-copilot-backend.vercel.app](https://borrower-copilot-backend.vercel.app) |
| **Database** | Aiven Cloud MySQL 8.0 | Managed · SSL · 5 Tables |
| **AI Engine** | Google Gemini API | Model fallback cascade |
| **OAuth** | Google Cloud Console | Authorized JS origins configured |
| **Source Code** | GitHub | [KandatiRanjithKumarReddy/Borrower-Copilot](https://github.com/KandatiRanjithKumarReddy/Borrower-Copilot) |

### Vercel Environment Variables

**Backend** (`back-end/`):
| Variable | Description |
|---|---|
| `DB_HOST` | Aiven MySQL hostname |
| `DB_PORT` | Aiven MySQL port |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name (e.g. `defaultdb`) |
| `DB_SSL` | Set to `true` for cloud databases |
| `JWT_SECRET` | Secure random secret for JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 Client Secret |
| `CORS_ORIGIN` | Frontend URL (e.g. `https://borrower-copilot-pi.vercel.app`) |

**Frontend** (`front-end/`):
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://borrower-copilot-backend.vercel.app`) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## 🧪 Built-in Test Personas

The application includes 3 instant-load borrower personas reflecting realistic Indian borrowing scenarios:

```
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ Persona   Profile                        Loan Requested     Outcome       Key Dynamic     │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ 👩 Priya   Salaried SWE (Bengaluru)       ₹8.0 Lakh          BORROW        Healthy FOIR,   │
│           ₹1,10,000/mo · CIBIL 760       (Personal/Wedding) (Safe: ₹8.0L) High buffer     │
│                                                                                           │
│ 👨 Ravi    Self-Employed (Mysuru)         ₹15.0 Lakh         BORROW LESS   ITR Haircut,    │
│           ₹90,000/mo Cash · CIBIL 690    (Business Exp.)    (Safe: ₹9.5L) Suggests LAP    │
│                                                                                           │
│ 🛵 Anita   Gig Delivery Worker (Hubballi) ₹1.5 Lakh          DON'T BORROW  Over-leveraged, │
│           ₹28,000/mo · 3 App Loans       (Two-Wheeler)      (Safe: ₹0)    Bounce flags    │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📐 Financial Rules Engine

### 1. Sustainable Income Calculation
Instead of taking top-line self-reported income at face value, the engine applies sector-calibrated haircuts:
- **Salaried:** Fixed base (100%) + Variable/Bonus subjected to a **50% haircut**.
- **Self-Employed:** Blended sustainable baseline:
  $$\text{Income}_{\text{sustainable}} = (0.60 \times \text{ITR}) + (0.25 \times \text{Typical Cash}) + (0.15 \times \text{Lowest Month})$$
- **Informal / Gig:** Conservative stability weighting:
  $$\text{Income}_{\text{sustainable}} = (0.60 \times \text{Lowest Month}) + (0.40 \times \text{Typical Cash})$$

### 2. Tiered FOIR (Fixed Obligation to Income Ratio)
| Net Monthly Income | Salaried Max FOIR | Self-Employed Max FOIR | Gig / Informal Max FOIR |
|---|:---:|:---:|:---:|
| **< ₹25,000** | 35% | 30% | 25% |
| **₹25,000 – ₹50,000** | 40% | 35% | 30% |
| **₹50,000 – ₹1,00,000** | 50% | 45% | 35% |
| **> ₹1,00,000** | 55% | 50% | 40% |

$$\text{Safe EMI} = \min\Big(\big(\text{Sustainable Income} \times \text{FOIR}\big) - \text{Existing EMIs},\; \text{Uncommitted Surplus} \times 0.85\Big)$$

### 3. All-In APR Solver (Newton-Raphson)
True borrowing costs must reflect upfront loan origination fees and statutory taxes:

$$\text{Principal} - \text{Total Upfront Fees} = \sum_{t=1}^{n} \frac{\text{EMI}}{(1 + r)^t}$$

$$\text{APR} = r \times 12 \times 100$$

Where $\text{Total Upfront Fees} = (\text{Principal} \times \text{Processing Fee \%}) \times (1 + \text{GST 18\%})$.

---

## 🔒 Privacy & Security Commitment

- 🚫 **Zero Credit Bureau Impact** — Never triggers hard or soft inquiries on your CIBIL or Experian file.
- 🚫 **No Sensitive Identity Docs** — Never requests or stores PAN cards, Aadhaar numbers, or passport copies.
- 🚫 **No Banking Credentials** — Never asks for net-banking logins, debit card details, UPI PINs, or OTPs.
- 🛡️ **Isolated MySQL Storage** — Assessments are saved with row-level user isolation and bcrypt password encryption.
- 🚫 **Zero Lead Monetization** — We never sell, lease, or broker your information to lenders or telemarketing agencies.

---

## 📄 License & Credit

Distributed under the **MIT License**.

```
© 2026 Borrower Copilot · Built independently by Ranjith ❤️
```
