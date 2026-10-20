<div align="center">

# 🛡️ Borrower Copilot

#### `AI-Powered Loan Advisor for Indian Borrowers`

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
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://borrower-copilot-pi.vercel.app)

<br/>

### 🚀 [Live Application](https://borrower-copilot-pi.vercel.app) &nbsp;|&nbsp; 📦 [GitHub Repository](https://github.com/KandatiRanjithKumarReddy/Borrower-Copilot)

<br/>

[Key Features](#-key-features) •
[Core Thesis](#-core-thesis) •
[BorrowerIQ AI](#-borroweriq-ai-insights) •
[System Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[Financial Engine](#-financial-rules-engine) •
[Privacy Commitment](#-privacy--security-commitment)

<br/>

</div>

---

## 💡 Core Thesis

### The Problem

When you walk into a bank and ask for a loan, the bank runs its own calculator. That calculator is designed to figure out the **maximum amount the bank can lend you** — not the maximum amount you can **safely repay**.

These are two very different numbers. Banks approve loans based on eligibility. But eligibility ignores your rent, your groceries, your kids' school fees, and your emergency savings. The result? Millions of borrowers take on loans they technically qualify for — but practically can't afford.

### The Solution

**Borrower Copilot** flips the table. Instead of asking *"How much can the bank give me?"*, it answers:

> **"How much can I actually repay every month without putting my household at financial risk?"**

It gives you:
- ✅ A clear **BORROW / BORROW LESS / DON'T BORROW** decision
- ✅ Your **safe loan amount** vs what the bank would approve
- ✅ A **fair interest rate range** so you know if you're being overcharged
- ✅ An **AI-generated summary** explaining everything in plain English
- ✅ A one-page **Negotiation Card** to carry into your bank meeting

---

## 🎯 The Four Questions Every Borrower Should Ask

| # | Question | What You Get | How It Works |
|:---:|:---|:---|:---|
| **1** | **Should I borrow at all?** | `BORROW` · `BORROW LESS` · `DON'T BORROW` | Analyzes your income, existing debts, savings buffer, and repayment history |
| **2** | **How much can I safely borrow?** | **Bank's Amount** vs **Your Safe Amount** | Shows the gap between what a bank will approve and what you can actually afford |
| **3** | **What's a fair interest rate?** | **Fair Rate Range** + **True Cost (APR)** | Calculates what you should be paying based on your profile, not what the bank quotes |
| **4** | **What EMI should I commit to?** | **EMI Ceiling** + **Tenure Options** | Caps your monthly payment at what your household budget can handle |

---

## ✨ Key Features

- **⚡ Adaptive 5-Step Diagnostic** — Smart question flow tailored for *Salaried*, *Self-Employed*, and *Gig/Informal* workers.
- **🛡️ Honest Decision Engine** — Built to protect you. Outputs **`DON'T BORROW`** when it detects a debt trap.
- **📊 Dual-Amount Comparison** — See your bank's approved amount side-by-side with your actual safe repayment limit.
- **🏷️ Fair Rate Band** — Know the fair interest rate range for your profile before stepping into a bank.
- **🔬 True APR Calculator** — Computes the real annual cost of your loan including processing fees and GST.
- **🌪️ Stress Testing** — Tests if you can still repay after a 15% income drop or a 2% interest rate hike.
- **🎴 Negotiation Card** — A printable one-page cheat sheet with talking points for your bank meeting.
- **🧠 BorrowerIQ AI Insights** — 5 plain-English takeaways powered by Google Gemini AI.
- **💬 Feedback Widget** — Built-in feedback system for submitting ideas, problems, and suggestions.
- **🔐 Accounts & History** — Sign in with email or Google, save assessments, and track your diagnostic history.

---

## 🧠 BorrowerIQ AI Insights

After completing your assessment, BorrowerIQ uses **Google Gemini AI** to generate five personalized takeaways in plain English:

1. **Household Budget Impact** — What this EMI actually means for your daily expenses and savings.
2. **Bank Sales vs Your Safety** — Why the bank's approved amount is higher than what's safe for you.
3. **Emergency Buffer Check** — Whether your savings stay protected or get drained by loan costs.
4. **Practical Adjustment Tip** — How tweaking tenure or down payment keeps things comfortable.
5. **Prepayment & Add-on Trap** — How to avoid unnecessary insurance add-ons and save on interest.

> **Reliability:** BorrowerIQ uses an automatic model fallback cascade (`gemini-3.5-flash-lite` → `gemini-3.7-flash` → `gemini-3.8-flash`) to ensure insights are always generated, even under heavy load.

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
| **Frontend** | `React 19` + `Tailwind CSS 4.0` | Modern UI with concurrent rendering and utility-first styling |
| **Build Tool** | `Vite 6.0` | Fast development server and optimized production builds |
| **Backend** | `Express 4.21` + `TypeScript 5.7` | Type-safe REST API with middleware and error handling |
| **Runtime** | `Node.js 18+` | Server-side JavaScript runtime |
| **Database** | `MySQL 8.0` | Relational storage with foreign keys and indexing |
| **AI Engine** | `Google Gemini AI` (`@google/genai`) | AI-powered insights with multi-model fallback cascade |
| **Auth** | `JWT` + `bcryptjs` + `Google OAuth` | Secure authentication with encrypted passwords and social login |
| **Deployment** | `Vercel` (Frontend + Backend) | Edge network for frontend, serverless functions for API |
| **Cloud Database** | `Aiven Cloud MySQL` | Managed MySQL with SSL encryption |
| **Icons & Fonts** | `Lucide React` + `Inter` | Clean iconography and readable financial typography |

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

<div align="center">

Distributed under the **MIT License**.

`© 2026 Borrower Copilot · Built independently by Ranjith ❤️`

</div>
