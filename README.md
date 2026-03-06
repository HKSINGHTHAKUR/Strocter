# Strocter 💠

> **Behavioral Finance Intelligence Platform** — Decode your money psychology and master your spending patterns.

[![Node.js](https://img.shields.io/badge/node-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/mongodb-atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)]()

Strocter is an enterprise-grade **behavioral finance platform** that fuses spending analytics with cognitive psychology to reveal **why** you spend — not just **what** you spend. It leverages purpose-built engines for **Impulse Detection**, **Wealth Stability Analysis**, **Risk Scoring**, and **Behavioral Pattern Recognition** to deliver actionable financial intelligence.

---

## 🏛️ System Architecture

Strocter operates on a decoupled **client-server architecture** with dedicated analytics engines processing behavioral data in real time.

```mermaid
graph TB
    subgraph Client["🖥️ Frontend · React + Vite"]
        UI["Dashboard UI"]
        Charts["Recharts Analytics"]
        ThreeJS["Three.js Landing"]
        Auth["Auth Context"]
    end

    subgraph Server["⚙️ Backend · Node.js + Express"]
        API["REST API Layer"]
        MW["Auth & Premium Middleware"]
        subgraph Engines["Analytics Engines"]
            AE["Analytics Engine"]
            IE["Impulse Engine"]
            WE["Wealth Engine"]
            GE["Goals Engine"]
            NE["Notification Engine"]
        end
        Controllers["20 Controllers"]
    end

    subgraph Data["🗄️ Data Layer"]
        Mongo["MongoDB Atlas"]
    end

    subgraph External["🔗 External Services"]
        RP["Razorpay Payments"]
        CB["Chatbase AI Assistant"]
    end

    UI --> API
    Charts --> API
    Auth --> API
    API --> MW --> Controllers --> Engines
    Engines --> Mongo
    Controllers --> Mongo
    API --> RP
    UI --> CB

    style Client fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style Server fill:#0f172a,stroke:#a78bfa,color:#e2e8f0
    style Data fill:#0f172a,stroke:#34d399,color:#e2e8f0
    style External fill:#0f172a,stroke:#fb923c,color:#e2e8f0
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4 | Interactive fintech dashboard with glassmorphism UI |
| **3D & Motion** | Three.js, React Three Fiber, GSAP, Framer Motion | Immersive landing page & micro-animations |
| **Backend** | Node.js, Express 5 | RESTful API with layered controller architecture |
| **Database** | MongoDB Atlas, Mongoose ODM | Document store for transactions & behavioral data |
| **Payments** | Razorpay SDK | Subscription management & premium tier |
| **AI Assistant** | Chatbase | Context-aware financial guidance chatbot |
| **Visualization** | Recharts | Dynamic charts for behavioral analytics |

---

## 🔄 Execution Flow

The internal data lifecycle demonstrates how Strocter processes, analyzes, and surfaces behavioral financial insights.

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend
    participant Auth as Auth Middleware
    participant API as Express API
    participant Engine as Analytics Engines
    participant DB as MongoDB Atlas
    participant AI as Chatbase AI

    User->>Frontend: Login / Register
    Frontend->>API: POST /api/auth/login
    API->>DB: Validate credentials
    DB-->>API: User document
    API-->>Frontend: JWT Token

    User->>Frontend: Add Transaction
    Frontend->>Auth: Attach JWT header
    Auth->>API: POST /api/transactions
    API->>DB: Store transaction
    API->>Engine: Trigger behavioral analysis

    Engine->>DB: Query transaction history
    DB-->>Engine: Historical data
    Engine->>Engine: Compute impulse score
    Engine->>Engine: Evaluate wealth stability
    Engine->>Engine: Generate risk assessment
    Engine-->>DB: Persist computed insights

    User->>Frontend: Open Dashboard
    Frontend->>Auth: Authenticated request
    Auth->>API: GET /api/analytics
    API->>DB: Fetch insights & metrics
    DB-->>API: Aggregated data
    API-->>Frontend: Dashboard payload

    Frontend->>Frontend: Render charts & heatmaps

    User->>AI: Ask financial question
    AI-->>User: Contextual guidance
```

---

## ✨ Key Features

### 🧠 Behavioral Spending Analysis
Identifies patterns in impulsive purchases, emotional spending triggers, and cognitive biases. The **Impulse Engine** tracks spending velocity, regret-tagged transactions, and trigger categories to build a comprehensive behavioral profile.

### 📊 Financial Intelligence Dashboard
A premium fintech dashboard with real-time analytics, spending heatmaps, sentiment charts, cognitive load panels, and category breakdowns — all rendered with interactive Recharts visualizations.

### 💰 Wealth Stability Engine
Monitors financial health through asset allocation tracking, risk radar analysis, stability trend forecasting, and strategic growth outlooks. Delivers a composite stability score for long-term wealth management.

### 🎯 Goal Tracking System
Set, monitor, and achieve financial goals with intelligent progress tracking. The **Goals Engine** provides milestone analysis, completion predictions, and motivational insights.

### 🤖 AI Financial Assistant
An integrated Chatbase-powered chatbot embedded across all authenticated pages. Provides contextual financial guidance, spending recommendations, and behavioral coaching in real time.

### 💳 Subscription & Premium Tier
Razorpay-powered subscription system supporting free and premium tiers. Premium features are gated through dedicated middleware ensuring secure paywall enforcement.

### 🛡️ Secure Authentication
JWT-based authentication layer with protected API routes. Features include route-level access control via `authMiddleware`, premium-only feature gating via `premiumOnly` middleware, and configurable feature access policies.

### 🎨 Modern Fintech UI/UX
Glassmorphism design system with dark theme, 3D perspective cards, an animated Three.js landing hero, smooth GSAP scroll animations, and Framer Motion transitions — optimized for financial data density.

### 📁 Data Archival & Export
Full transaction archival system with CSV/PDF export capabilities via `json2csv` and `PDFKit`. Enables data portability and compliance-ready record keeping.

### 📈 Risk Scoring Engine
Quantifies financial risk exposure through multi-factor behavioral analysis. Assigns dynamic risk scores based on spending volatility, impulse frequency, and wealth stability metrics.

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/strocter.git
cd strocter
```

### 2. Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#-environment-variables)):

```bash
npm run dev
```

The API server will start at **`http://localhost:5000`**.

### 3. Start the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```bash
npm run dev
```

The app will launch at **`http://localhost:5173`**.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `NODE_ENV` | Runtime environment | `development` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your_jwt_secret_key` |
| `RAZORPAY_KEY_ID` | Razorpay API key | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret | `your_razorpay_secret` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay publishable key | `rzp_test_...` |

---

## 🌐 Deployment

Strocter uses a fully decoupled deployment strategy, enabling independent scaling of each tier.

```mermaid
graph LR
    subgraph Production["☁️ Production Stack"]
        V["Vercel<br/>React Frontend"]
        R["Render<br/>Node.js API"]
        M["MongoDB Atlas<br/>Database Cluster"]
    end

    V -->|HTTPS API Calls| R
    R -->|Mongoose ODM| M

    style V fill:#0f172a,stroke:#38bdf8,color:#e2e8f0
    style R fill:#0f172a,stroke:#a78bfa,color:#e2e8f0
    style M fill:#0f172a,stroke:#34d399,color:#e2e8f0
```

| Service | Platform | Details |
|---------|----------|---------|
| **Frontend** | [Vercel]((https://strocter.vercel.app)) | Automatic deployments from `main` branch, edge CDN |
| **Backend** | [Render](https://render.com) | Auto-deploy with health check at `/health` |
| **Database** | [MongoDB Atlas](https://mongodb.com/atlas) | M0 free tier or dedicated cluster with auto-scaling |

> **Note:** The architecture supports **horizontal scaling** — the stateless Express API can be replicated behind a load balancer, and MongoDB Atlas supports read replicas for query distribution.

---

## 📂 Project Structure

```
strocter/
│
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   ├── db.js                   # MongoDB connection setup
│   │   └── razorpay.js             # Razorpay SDK initialization
│   ├── controllers/                # Request handlers (20 controllers)
│   │   ├── authController.js       # Registration & login logic
│   │   ├── transactionController.js# CRUD + behavioral tagging
│   │   ├── behavioralController.js # Behavioral pattern aggregation
│   │   ├── impulseController.js    # Impulse detection & scoring
│   │   ├── wealthController.js     # Wealth stability metrics
│   │   ├── riskScoreController.js  # Risk factor computation
│   │   ├── goalsController.js      # Goal tracking operations
│   │   ├── dashboardController.js  # Dashboard data aggregation
│   │   ├── insightController.js    # Insight generation
│   │   ├── paymentController.js    # Razorpay order & verification
│   │   ├── subscriptionController.js # Premium tier management
│   │   ├── archiveController.js    # CSV/PDF data export
│   │   └── ...                     # + 8 more controllers
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification guard
│   │   ├── errorHandler.js         # Global error handler
│   │   ├── featureAccess.js        # Feature-level access control
│   │   └── premiumOnly.js          # Premium tier paywall gate
│   ├── models/                     # Mongoose schemas (6 models)
│   │   ├── User.js                 # User profile + auth data
│   │   ├── Transaction.js          # Financial transactions
│   │   ├── Goal.js                 # Financial goals
│   │   ├── Payment.js              # Payment records
│   │   ├── Subscription.js         # Premium subscriptions
│   │   └── SystemSettings.js       # Application configuration
│   ├── routes/                     # Express route modules (14 routes)
│   ├── services/                   # Business logic engines
│   │   ├── analyticsEngine.js      # Core analytics computation
│   │   ├── impulseEngine.js        # Impulse behavior analysis
│   │   ├── wealthEngine.js         # Wealth stability calculations
│   │   ├── goalsEngine.js          # Goal progress engine
│   │   ├── notificationEngine.js   # Alert & notification logic
│   │   ├── reportGenerator.js      # PDF/CSV report generation
│   │   ├── subscriptionEngine.js   # Subscription lifecycle
│   │   └── settingsEngine.js       # Dynamic settings management
│   ├── utils/
│   │   └── exportCSV.js            # CSV serialization utility
│   └── server.js                   # Express app entry point
│
├── frontend/                       # React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing/            # Landing page sections
│   │   │   │   ├── HeroScene.jsx   # Three.js 3D hero
│   │   │   │   ├── BackgroundS.jsx # Animated "S" particle system
│   │   │   │   ├── Feature3DCard.jsx # 3D perspective cards
│   │   │   │   ├── IntelligenceSection.jsx
│   │   │   │   ├── SecuritySection.jsx
│   │   │   │   └── ...             # + 6 more sections
│   │   │   ├── behavior/           # Behavioral analytics panels
│   │   │   │   ├── HeatmapPanel.jsx
│   │   │   │   ├── SentimentChart.jsx
│   │   │   │   ├── CognitivePanel.jsx
│   │   │   │   └── CategoryBreakdown.jsx
│   │   │   ├── Wealth/             # Wealth stability widgets
│   │   │   │   ├── RiskRadarChart.jsx
│   │   │   │   ├── StabilityTrendChart.jsx
│   │   │   │   ├── AssetAllocationPanel.jsx
│   │   │   │   └── StrategicGrowthOutlook.jsx
│   │   │   ├── Impulse/            # Impulse tracking components
│   │   │   ├── Goals/              # Goal management components
│   │   │   ├── Archive/            # Data export interface
│   │   │   ├── Pricing/            # Subscription plans
│   │   │   ├── Settings/           # User preferences
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── TopNav.jsx          # Header navigation
│   │   │   └── ChatbotWidget.jsx   # AI assistant widget
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── dashboard/
│   │   │   ├── transactions/
│   │   │   ├── behavioral/
│   │   │   ├── wealth/
│   │   │   ├── impulse/
│   │   │   ├── goals/
│   │   │   ├── archive/
│   │   │   ├── settings/
│   │   │   └── pricing/
│   │   ├── services/               # API client layer (11 services)
│   │   ├── context/                # React context providers
│   │   │   └── AuthContext.jsx     # Authentication state
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx  # Route guard HOC
│   │   └── App.jsx                 # Root router configuration
│   ├── index.html
│   ├── vite.config.js
│   └── vercel.json                 # Vercel deployment config
│
└── README.md
```

---

## 🔒 Security Considerations

| Layer | Mechanism | Details |
|-------|-----------|---------|
| **Authentication** | JWT Tokens | Stateless auth with signed JSON Web Tokens |
| **Route Protection** | Auth Middleware | All `/api/*` routes (except auth) require valid JWT |
| **Premium Gating** | Premium Middleware | Feature-level access control for paid subscribers |
| **Password Security** | bcrypt.js | Salted & hashed password storage |
| **Payment Security** | Razorpay SDK | Server-side payment verification with signature validation |
| **CORS Policy** | Origin Whitelist | Strict origin validation for allowed domains |
| **Environment Secrets** | dotenv | All secrets loaded from environment — never committed |
| **Error Handling** | Global Handler | Centralized error handler prevents stack trace leakage |

---

## 🗺️ Future Roadmap

- [ ] **AI-Driven Spending Predictions** — ML-powered forecasting engine for proactive financial planning
- [ ] **Mobile Application** — React Native companion app for on-the-go tracking
- [ ] **Multi-Account Aggregation** — Connect and unify data from multiple bank accounts
- [ ] **Advanced Behavioral Scoring** — Composite psychology score with temporal decay modeling
- [ ] **Financial Habit Coaching** — Personalized coaching engine with streak tracking and nudge systems
- [ ] **Social Benchmarking** — Anonymous peer comparison for spending behavior analysis
- [ ] **Budget Automation** — Rule-based automatic budget allocation using behavioral signals
- [ ] **Webhook Integrations** — Real-time alerts via Slack, Discord, and email

---



### Built with 🧠 by [Harsh K. Singh](https://github.com/your-username)

**Strocter** — *Because understanding your money starts with understanding your mind.*

</div>
