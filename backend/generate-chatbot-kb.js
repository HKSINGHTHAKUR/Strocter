const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  bufferPages: true,
  info: {
    Title: "Strocter — AI Chatbot Knowledge Base",
    Author: "Strocter Platform",
    Subject: "Comprehensive Product Knowledge Base for AI Chatbot Integration",
    Creator: "Strocter KB Generator",
  },
});

const outputPath = path.join(__dirname, "Strocter_Chatbot_Knowledge_Base.pdf");
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// ─── Color Palette ───
const C = {
  black: "#111111",
  dark: "#1A1A1A",
  darkGray: "#333333",
  medGray: "#555555",
  lightGray: "#888888",
  orange: "#EC5B13",
  green: "#38E6A2",
  purple: "#6E33B1",
  blue: "#3B82F6",
  white: "#FFFFFF",
  cream: "#FAFAF8",
  border: "#CCCCCC",
  softBorder: "#E0E0E0",
};

let currentPage = 0;
const tocEntries = [];
let sectionNum = 0;
let subNum = 0;
let subSubNum = 0;

// ─── Helpers ───
function addPageNum() { currentPage++; }

function h1(text) {
  sectionNum++;
  subNum = 0;
  subSubNum = 0;
  const label = `Section ${sectionNum}: ${text}`;
  tocEntries.push({ label, level: 1, page: currentPage + 1 });
  checkBreak(80);
  doc.moveDown(1.2);
  doc.fontSize(22).fillColor(C.orange).font("Helvetica-Bold").text(label);
  doc.moveTo(50, doc.y + 3).lineTo(545, doc.y + 3).strokeColor(C.orange).lineWidth(2).stroke();
  doc.moveDown(0.7);
  doc.fillColor(C.black).font("Helvetica");
}

function h2(text) {
  subNum++;
  subSubNum = 0;
  const label = `${sectionNum}.${subNum} ${text}`;
  tocEntries.push({ label, level: 2, page: currentPage + 1 });
  checkBreak(60);
  doc.moveDown(0.9);
  doc.fontSize(15).fillColor(C.darkGray).font("Helvetica-Bold").text(label);
  doc.moveTo(50, doc.y + 2).lineTo(420, doc.y + 2).strokeColor(C.border).lineWidth(0.5).stroke();
  doc.moveDown(0.4);
  doc.fillColor(C.black).font("Helvetica");
}

function h3(text) {
  subSubNum++;
  checkBreak(40);
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(C.medGray).font("Helvetica-Bold").text(`${sectionNum}.${subNum}.${subSubNum} ${text}`);
  doc.moveDown(0.3);
  doc.fillColor(C.black).font("Helvetica");
}

function h3plain(text) {
  checkBreak(40);
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(C.medGray).font("Helvetica-Bold").text(text);
  doc.moveDown(0.3);
  doc.fillColor(C.black).font("Helvetica");
}

function p(text) {
  doc.fontSize(10).fillColor(C.darkGray).font("Helvetica").text(text, { lineGap: 3.5 });
  doc.moveDown(0.35);
}

function b(text, indent = 60) {
  doc.fontSize(10).fillColor(C.darkGray).font("Helvetica").text(`•  ${text}`, indent, undefined, { lineGap: 2.5 });
}

function nb(label, text) {
  checkBreak(20);
  doc.fontSize(10).font("Helvetica-Bold").fillColor(C.darkGray).text(`${label}: `, 60, undefined, { continued: true });
  doc.font("Helvetica").text(text, { lineGap: 2.5 });
}

function code(text) {
  checkBreak(40);
  doc.moveDown(0.3);
  doc.fontSize(9).fillColor(C.medGray).font("Courier").text(text, 60, undefined, { lineGap: 2.5 });
  doc.moveDown(0.3);
  doc.font("Helvetica").fillColor(C.black);
}

function tableRow(cols, widths, isHeader = false) {
  const startX = 55;
  const startY = doc.y;
  const font = isHeader ? "Helvetica-Bold" : "Helvetica";
  const color = isHeader ? C.white : C.darkGray;
  const sz = isHeader ? 9 : 8.5;

  if (isHeader) {
    doc.rect(startX - 5, startY - 4, widths.reduce((a, b) => a + b, 0) + 10, 20).fill(C.orange);
  }

  let x = startX;
  cols.forEach((col, i) => {
    doc.fontSize(sz).fillColor(color).font(font).text(String(col), x, startY, { width: widths[i] - 5, lineBreak: false });
    x += widths[i];
  });
  doc.moveDown(0.7);
  if (!isHeader) {
    doc.moveTo(startX - 5, doc.y).lineTo(startX + widths.reduce((a, b) => a + b, 0) + 5, doc.y).strokeColor("#EEEEEE").lineWidth(0.3).stroke();
  }
}

function checkBreak(needed = 100) {
  if (doc.y > 750 - needed) {
    doc.addPage();
    addPageNum();
  }
}

function spacer(n = 0.5) { doc.moveDown(n); }

function divider() {
  doc.moveDown(0.4);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(C.softBorder).lineWidth(0.3).stroke();
  doc.moveDown(0.4);
}

function qaBlock(question, answer) {
  checkBreak(60);
  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica-Bold").fillColor(C.orange).text(`Q: ${question}`);
  doc.moveDown(0.15);
  doc.fontSize(10).font("Helvetica").fillColor(C.darkGray).text(`A: ${answer}`, { lineGap: 3 });
  doc.moveDown(0.4);
}

// ═══════════════════════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════════════════════
doc.rect(0, 0, 595, 842).fill("#0A0A0A");
doc.rect(0, 0, 595, 8).fill(C.orange);
doc.rect(0, 834, 595, 8).fill(C.orange);

// Logo
doc.circle(297, 220, 55).fill(C.orange);
doc.fontSize(52).fillColor(C.white).font("Helvetica-Bold").text("S", 274, 193);

doc.fontSize(44).fillColor(C.white).font("Helvetica-Bold").text("STROCTER", 0, 310, { align: "center" });
doc.fontSize(13).fillColor(C.lightGray).font("Helvetica").text("Behavioral Finance AI Platform", 0, 365, { align: "center" });
doc.fontSize(13).fillColor(C.lightGray).text("Money Psychology Tracker", 0, 385, { align: "center" });

doc.moveTo(200, 420).lineTo(395, 420).strokeColor(C.orange).lineWidth(1.5).stroke();

doc.fontSize(18).fillColor(C.white).font("Helvetica-Bold").text("AI Chatbot Knowledge Base", 0, 445, { align: "center" });
doc.moveDown(0.6);
doc.fontSize(11).fillColor(C.lightGray).font("Helvetica").text("Comprehensive Product Documentation", 0, 480, { align: "center" });
doc.fontSize(11).fillColor(C.lightGray).text("For Intelligent Chatbot Q&A Integration", 0, 498, { align: "center" });

// Bottom info
doc.fontSize(10).fillColor("#666666").text("11-Section Knowledge Architecture", 0, 600, { align: "center" });
doc.fontSize(9).fillColor("#555555").text("Product Overview | Core Features | User Flow | Technical Architecture", 0, 620, { align: "center" });
doc.fontSize(9).fillColor("#555555").text("Database | Analytics Engine | Security | Chatbot KB | Roadmap", 0, 636, { align: "center" });

doc.fontSize(10).fillColor(C.lightGray).text(`Generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`, 0, 720, { align: "center" });
doc.fontSize(9).fillColor("#555555").text("Version 1.0 — Early Access Edition", 0, 740, { align: "center" });
doc.fontSize(8).fillColor("#444444").text("CONFIDENTIAL — For Internal & Chatbot Use Only", 0, 760, { align: "center" });

addPageNum();

// ═══════════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();
const tocPageIndex = doc.bufferedPageRange().count - 1;

doc.fontSize(26).fillColor(C.orange).font("Helvetica-Bold").text("Table of Contents", { align: "center" });
doc.moveDown(0.5);
doc.fontSize(10).fillColor(C.lightGray).font("Helvetica").text("AI Chatbot Knowledge Base — 11 Sections", { align: "center" });
doc.moveDown(1.5);
const tocStartY = doc.y;

// ═══════════════════════════════════════════════════════════════
// SECTION 1: PRODUCT OVERVIEW
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Product Overview");

h2("What is Strocter?");
p("Strocter is a Behavioral Finance AI Platform — a Money Psychology Tracker designed to help individuals understand, analyze, and optimize their relationship with money. Unlike traditional expense trackers that only record numbers, Strocter digs into the psychology behind every transaction: why you spent, how you felt, and what patterns your spending reveals about your financial behavior.");

p("Strocter operates at the intersection of personal finance and behavioral psychology. It classifies every transaction as either emotional or logical, detects impulse spending spikes, computes financial stability indices, identifies your financial personality type, and generates AI-driven strategy memos to help you build healthier money habits.");

h2("Platform Identity");
nb("Full Name", "Strocter — Behavioral Finance AI Platform");
nb("Tagline", "Money Psychology Tracker");
nb("Landing Tagline", "Behavioral Finance, Redesigned");
nb("Currency", "INR (Indian Rupees, symbol: Rs)");
nb("Current Status", "Early Access — all premium features are available for free");
nb("Pricing", "Rs 0 during early access (regular price: Rs 499/month)");
nb("Trial Duration", "7 days from account creation (currently irrelevant since everything is free)");
nb("Target Users", "Individuals who want to understand and improve their spending psychology");
nb("Architecture", "Full-stack web application (SPA frontend + REST API backend)");

h2("Core Value Proposition");
p("Strocter answers questions that no traditional finance app does:");
b("Why did I spend this money? (Emotional vs. Logical classification)");
b("Am I an impulse spender? (Impulse Score: 0-100)");
b("How stable are my finances really? (Stability Index: 0-100 weighted composite)");
b("What kind of spender am I? (Financial Personality: Weekend Splurger, Stress Spender, etc.)");
b("When am I most vulnerable to bad spending? (Heatmap: 7x24 day/hour grid)");
b("What would happen if I resisted impulses? (Cognitive Friction Simulation)");
b("How can I improve? (AI Strategy Memos with trigger analysis and action protocols)");

h2("Platform Statistics");
p("These statistics are displayed on the Strocter landing page:");
b("98.7% Behavioral Accuracy");
b("2,400+ Patterns Detected");
b("150ms Response Time");
b("99.9% Uptime SLA");

h2("Key Differentiators");
b("Emotion-tagged transactions — users tag how they felt when spending (happy, stressed, impulsive, etc.)");
b("Psychological intent classification — every transaction gets classified as INVESTMENT, STRESS IMPULSE, EMOTIONAL/SOCIAL, or LOGICAL/ROUTINE");
b("Impulse detection engine — real-time spike detection with threshold-based analysis");
b("Cognitive friction simulation — model what-if scenarios for impulse resistance");
b("Institutional-grade PDF reports — professional behavioral analysis documents");
b("Heatmap visualization — see when you're most vulnerable to bad spending (day x hour grid)");
b("AI Strategy Memos — automated trigger identification and action recommendations");
b("Dark luxury UI — premium fintech aesthetic with 3D animations and glassmorphic design");

// ═══════════════════════════════════════════════════════════════
// SECTION 2: PROBLEM STROCTER SOLVES
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("The Problem Strocter Solves");

h2("The Gap in Personal Finance");
p("Traditional personal finance apps (like Mint, YNAB, Walnut, or Money Manager) focus exclusively on WHAT you spend. They track amounts, categories, and budgets. But they completely ignore WHY you spend — the emotional and psychological drivers behind financial decisions.");

p("Research in behavioral economics (Kahneman, Thaler, Ariely) shows that most financial decisions are not rational. People overspend when stressed, make impulse purchases for dopamine hits, spend more late at night, and have predictable psychological patterns that traditional apps never surface.");

h2("Problems Strocter Addresses");

h3("Emotional Blindness in Spending");
p("Most people cannot articulate why they spend. They know they overspent, but not that it was triggered by stress, loneliness, celebration, or boredom. Strocter solves this by requiring users to tag emotions on every transaction and then analyzing these patterns over time.");

h3("Invisible Impulse Patterns");
p("Impulse spending often goes unnoticed because individual transactions seem small or justified. Strocter detects impulse spikes by analyzing hourly spending patterns and flagging hours where spending exceeds 1.4x the average. It also tracks the ratio of emotionally-tagged transactions to total transactions, creating a composite Impulse Score (0-100).");

h3("No Psychological Self-Awareness");
p("Without behavioral analysis, users lack self-awareness about their financial personality. Strocter classifies users into personality types based on 14-day spending patterns: Weekend Splurger (spends more on weekends), Stress Spender (30%+ transactions at night), Impulsive Spender (50%+ small transactions under Rs 200), or Balanced Spender.");

h3("Reactive, Not Proactive Finance");
p("Traditional apps only show what happened. Strocter is proactive — it simulates cognitive friction scenarios to show what COULD happen if you resist impulses. It projects stability trends forward. It generates AI strategy memos with specific action protocols. It identifies your peak vulnerability hours so you can prepare.");

h3("Lack of Institutional-Quality Insight");
p("Individual users deserve the same quality of financial behavioral analysis that institutions get. Strocter generates professional PDF reports with executive summaries, behavioral metrics, cognitive analysis, trigger identification, and mitigation protocols — formatted like institutional-grade documents.");

h2("Strocter's Philosophy");
p("Money is emotional. Every rupee you spend carries a psychological story. Strocter believes that understanding your money psychology is the first step to financial wellness. The platform doesn't judge — it illuminates. It helps you see patterns you couldn't see before, quantifies behaviors you only felt intuitively, and gives you the tools to make deliberate financial decisions instead of reactive ones.");

p("The core philosophy can be summarized as: \"Track the feeling, not just the figure.\"");

// ═══════════════════════════════════════════════════════════════
// SECTION 3: CORE FEATURES
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Core Features");

h2("Transaction Tracking with Emotion Tagging");
p("Every transaction in Strocter includes both financial data and psychological metadata:");
b("Amount — the monetary value in INR");
b("Type — Income or Expense");
b("Category — one of 9 user-facing categories: Food & Dining, Housing, Transportation, Entertainment, Shopping, Utilities, Healthcare, Salary, Investment");
b("Note — optional free-text description of the transaction");
b("Emotion — the feeling at the time of spending: Logical/Routine, Impulsive, Stress/Anxiety, Celebratory, or Neutral (default)");
b("Tags — optional comma-separated labels for custom grouping");
b("Date — when the transaction occurred (defaults to today)");

spacer();
p("This emotion tagging is what separates Strocter from every other finance app. It creates a dataset that can be analyzed for behavioral patterns, not just financial patterns.");

h2("Dashboard — Financial Command Center");
p("The main dashboard provides a comprehensive financial overview at a glance:");
b("4 Metric Cards: Total Transactions, Logical %, Emotional %, High-Risk Spending");
b("2 Behavior Cards: Financial Stability Index (0-100) and Impulse Score (0-100) with circular progress indicators");
b("Wealth Flow Chart: 7-week line chart showing emotional vs. logical spending trends");
b("Intelligence Feed: Latest 20 transactions enriched with psychological intent (INVESTMENT, STRESS IMPULSE, EMOTIONAL/SOCIAL, LOGICAL/ROUTINE) and impact level (Low, Medium, High)");

h2("Behavioral Analytics — Deep Psychological Analysis");
p("A dedicated analytics page with 5 major components:");

h3("Behavioral Metrics");
p("5 metric cards with trend data: Emotional Spending %, Logical Spending %, Dopamine Index (0-100), Resilience Score (0-100), Volatility Index. Each shows current value, change percentage, and animated progress bar.");

h3("Spending Heatmap");
p("A 7-day by 24-hour grid visualization showing spending intensity. Each cell represents a specific day-of-week and hour-of-day combination, colored from dark (low) to bright orange (high). Identifies peak spending day and peak spending hour. This helps users see WHEN they are most vulnerable to overspending.");

h3("Cognitive Insight Panel");
p("Three-part analysis card showing: (1) Identified Trigger — what's causing problematic spending (Late-Night Spending, High Stress Spending, or Routine Drift), (2) Recommended Action — specific behavioral change recommendation, (3) Motivational Quote — contextual encouragement.");

h3("Sentiment Timeline");
p("6-week line chart tracking the ratio of Emotional vs. Logical spending over time. Two lines: orange (emotional %) and green (logical %). Shows whether the user's spending behavior is trending more emotional or more rational.");

checkBreak(80);
h3("Category Split");
p("Top 6 spending categories with stacked horizontal bars showing the emotional vs. logical split within each category. For example, 'Entertainment' might be 70% emotional and 30% logical. Helps identify which categories are most driven by emotions.");

h2("Impulse Lab — Impulse Detection Engine");
p("Dedicated page for understanding and controlling impulse spending:");

checkBreak(80);
h3plain("Impulse Metrics");
p("4 key impulse indicators: Impulse Score (0-100 with baseline), Stress Correlation (emotional spending % compared to 50% average), Late Night Window (transactions between 10PM-4AM), Impulse Volatility (coefficient of variation).");

checkBreak(80);
h3plain("Trigger Timeline");
p("Interactive timeline chart with two data series: Impulse Spikes (orange) and Stress Markers (purple dashed). Configurable time range: 24 hours, 7 days, or 30 days. Spikes detected where hourly spending exceeds 1.4x the average.");

checkBreak(80);
h3plain("Trigger Breakdown");
p("4 cards identifying: Top Trigger Category (highest spending category), Peak Vulnerability (the hour you spend the most), Emotional Pattern (most frequent emotion), Intensity Index (average transaction velocity).");

checkBreak(80);
h3plain("Cognitive Friction Simulation");
p("Interactive simulation tool. Users adjust a friction slider (0-100%) to model: 'What if I applied this much resistance to my impulsive spending?' The system calculates: Predicted Savings (how much money would be saved), Risk Reduction (how much risk would decrease), Stability Forecast (projected stability score). Formula: predictedSavings = emotionalTotal * friction * 0.6.");

doc.addPage();
addPageNum();

h2("Wealth & Stability — Financial Health Analysis");
p("Comprehensive wealth analysis with trend projection:");
b("Stability Index: Weighted composite (0-100) measuring overall financial health");
b("Risk Exposure: Emotional spending ratio classified as LOW/MODERATE/ELEVATED/HIGH");
b("Savings Growth: Savings rate compared to benchmark (above/on/below)");
b("Financial Buffer: How many months of expenses your savings can cover");
b("Stability Trend Chart: Historical stability scores + future projection with configurable range (6 months, 1 year, 3 years)");
b("Risk Radar Chart: 4-axis radar showing Liquidity, Market Risk, Leverage, Control");
b("Asset Allocation: Breakdown into Needs, Savings & Emergency, and Investments");
b("Strategic Growth Outlook: AI-generated narrative with behavioral impact analysis");

h2("Goals & Behavioral Planning");
p("Goal management system with AI-powered tracking:");
b("Goal Types: Behavioral, Savings, or Risk goals");
b("Time Horizons: 30 days, 60 days, or 90 days");
b("Risk Tolerance: Low, Moderate, or Aggressive");
b("AI Suggestions: Optional AI-powered milestone recommendations");
b("Quarterly Milestones: Q1-Q4 roadmap with achieved/active/pending status");
b("Goal Trajectory Chart: Actual vs. projected savings rate over time");
b("AI Strategy Memo: Automated trigger identification, recommended actions, and expected impacts");
b("Impact Summary: Projected savings amount, risk reduction %, and stability forecast");

h2("Archive & Reports — Intelligence Repository");
p("Professional-grade report generation and archival:");
b("Intelligence Overview: 4 real-time analytics cards (Monthly Behavioral Summary, Impulse Risk Report, Stability Evolution, Financial Health Snapshot)");
b("Reports Table: Historical report log with stability score, risk level, AI confidence percentage");
b("Report Preview: Institutional-style document with cream background, watermark, executive summary, narrative, mitigation protocols, and embedded metrics");
b("PDF Report Generation: A4 behavioral analysis reports with executive summary, 5 key metrics, cognitive analysis, and category breakdown");
b("CSV Export: Transaction data and analytics data exportable as CSV files");

h2("Settings & System Configuration");
p("Comprehensive system customization:");
b("AI Model Controls: Impulse sensitivity (0-2 scale), cognitive friction level, predictive risk sensitivity, auto-adjustment toggle");
b("Risk Governance: High-risk threshold, budget lock time window, category risk weights (leisure/essentials/enterprise, auto-normalized to 100%), late-night auto-control");
b("Security: 2FA toggle, biometric access toggle, session timeout (15m/30m/1h/4h/24h)");
b("Notification Protocols: 6 configurable alerts — impulse spikes, risk escalation, stability warnings, goal tracking, weekly summary, system reports");

// ═══════════════════════════════════════════════════════════════
// SECTION 4: USER FLOW
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("User Flow & Journey");

h2("Registration & Onboarding");
p("1. User visits the Strocter landing page — a dark, premium fintech website with a 3D animated background (an 'S' shape made of ~1,050 boxes that fracture on scroll).");
p("2. User clicks 'Get Started' or 'Login' to navigate to the authentication page.");
p("3. User registers with: Name, Email, and Password (minimum 6 characters).");
p("4. Password is securely hashed with bcryptjs (10 salt rounds) before storage.");
p("5. On successful registration, user is redirected to login.");
p("6. User logs in with email and password. Server returns a JWT token (valid for 7 days).");
p("7. Token is stored in browser localStorage. All subsequent API calls include this token.");
p("8. User lands on the Dashboard — their financial command center.");

h2("Daily Usage Flow");
p("The primary daily interaction cycle:");
spacer(0.2);
p("1. ADD TRANSACTION: User clicks 'Add Transaction' button in the top navigation bar. A full-screen modal appears with fields for amount, type (income/expense), category, note, emotion, tags, and date. The key differentiator is the EMOTION field — the user selects how they felt during this transaction.");
spacer(0.2);
p("2. VIEW DASHBOARD: Dashboard auto-updates showing 4 metric cards (total transactions, logical %, emotional %, high-risk spending), 2 behavior cards (stability index and impulse score), wealth flow chart, and intelligence feed.");
spacer(0.2);
p("3. EXPLORE ANALYTICS: User navigates to Behavioral Analytics to see deep insights — spending heatmap, cognitive analysis, sentiment trends, and category emotional/logical split.");
spacer(0.2);
p("4. CHECK IMPULSE LAB: User reviews impulse score, stress correlation, late-night spending window, and trigger breakdown. They can run cognitive friction simulations to see potential savings.");
spacer(0.2);
p("5. MONITOR WEALTH: User checks stability index, risk exposure, savings growth, financial buffer, and stability trend projections.");
spacer(0.2);
p("6. TRACK GOALS: User creates financial goals (behavioral, savings, or risk) and monitors progress through trajectory charts, AI memos, and milestone trackers.");
spacer(0.2);
p("7. REVIEW REPORTS: User accesses the Archive to view and download behavioral analysis reports in PDF or CSV format.");
spacer(0.2);
p("8. ADJUST SETTINGS: User fine-tunes AI sensitivity, risk thresholds, notification preferences, and security settings.");

h2("Navigation Structure");
p("Strocter has a fixed sidebar (88px wide) on the left with icon-based navigation:");
b("Dashboard — main overview");
b("Transactions — add and view transaction history with metrics");
b("Analytics — deep behavioral analysis (heatmap, cognitive insights, sentiment)");
b("Wealth — financial stability, trends, radar chart, asset allocation");
b("Goals — goal management, trajectory, AI strategy memos");
b("Archive — reports, document preview, export");
b("Settings — AI controls, risk governance, security, notifications");

spacer();
p("A top navigation bar (64px) provides: page title, search (UI placeholder), notifications, user avatar, and the 'Add Transaction' button accessible from any page.");

h2("Authentication Flow");
p("Strocter uses stateless JWT authentication:");
b("Registration: POST /api/auth/register with { name, email, password }");
b("Login: POST /api/auth/login returns { token } — JWT with 7-day expiry");
b("Token contains: { id, trialActive, subscriptionActive }");
b("Protected routes require Authorization: Bearer <token> header");
b("On 401 response: automatic logout and redirect to login page");
b("Session restored on page refresh by calling GET /api/auth/me with stored token");

// ═══════════════════════════════════════════════════════════════
// SECTION 5: TECHNICAL ARCHITECTURE
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Technical Architecture");

h2("System Architecture Overview");
p("Strocter follows a monorepo structure with clearly separated backend and frontend. The backend is a RESTful API server, and the frontend is a Single Page Application (SPA) that communicates with it via HTTP/JSON.");

code(`Architecture: Client-Server (SPA + REST API)
Frontend: React 19 SPA (Vite dev server on port 5173)
Backend:  Express v5 API server (port 5000)
Database: MongoDB Atlas (cloud-hosted)
Protocol: HTTPS (JSON request/response)
Auth:     Stateless JWT (Bearer token)`);

h2("Backend Technology Stack");
const backendStack = [
  ["Technology", "Version", "Purpose"],
  ["Node.js", "Runtime", "Server-side JavaScript runtime"],
  ["Express", "v5", "HTTP framework with middleware pipeline"],
  ["MongoDB Atlas", "Cloud", "NoSQL document database (cloud-hosted)"],
  ["Mongoose", "v9", "MongoDB ODM (Object Document Mapper)"],
  ["jsonwebtoken", "—", "JWT creation and verification"],
  ["bcryptjs", "—", "Password hashing (10 salt rounds)"],
  ["Razorpay SDK", "v2.9.6", "Payment gateway integration (INR)"],
  ["PDFKit", "v0.17.2", "PDF report generation"],
  ["json2csv", "—", "CSV export generation"],
  ["Morgan", "—", "HTTP request logging (dev mode)"],
  ["OpenAI SDK", "v6.25", "Installed but not actively used yet"],
  ["dotenv", "—", "Environment variable management"],
];
const bsWidths = [120, 60, 300];
backendStack.forEach((row, i) => {
  checkBreak(25);
  tableRow(row, bsWidths, i === 0);
});

spacer();

h2("Frontend Technology Stack");
const frontendStack = [
  ["Technology", "Version", "Purpose"],
  ["React", "v19.2", "UI component library"],
  ["Vite", "v7.3", "Build tool and dev server"],
  ["Tailwind CSS", "v4.2", "Utility-first CSS framework"],
  ["React Router DOM", "v7.13", "Client-side routing"],
  ["Axios", "—", "HTTP client with JWT interceptor"],
  ["Recharts", "v3.7", "Charting library (line, radar, area)"],
  ["Framer Motion", "v12.34", "Animation library"],
  ["Three.js", "v0.183", "3D graphics engine"],
  ["React Three Fiber", "v9.5", "React renderer for Three.js"],
  ["@react-three/drei", "v10.7", "Three.js helpers and abstractions"],
  ["GSAP", "v3.14", "Animation timeline (scroll triggers)"],
  ["Lenis", "v1.3", "Smooth scroll library"],
  ["Lucide React", "v0.575", "Icon library"],
  ["clsx + tailwind-merge", "—", "Conditional CSS class utilities"],
];
const fsWidths = [130, 60, 290];
frontendStack.forEach((row, i) => {
  checkBreak(25);
  tableRow(row, fsWidths, i === 0);
});

doc.addPage();
addPageNum();

h2("Backend Architecture");

h3("Project Structure");
code(`backend/
  server.js              — Express entry point (middleware + route mounting)
  config/
    db.js                — MongoDB Atlas connection
    razorpay.js          — Razorpay payment instance
  models/     (6 files)  — Mongoose data models
  middleware/ (4 files)  — Auth, errors, feature access, premium gate
  routes/    (13 files)  — API route definitions
  controllers/ (20 files) — Request handlers (thin layer)
  services/  (9 files)   — Business logic engines (core intelligence)
  utils/     (1 file)    — CSV export utility
  generated-reports/     — PDF output directory`);

h3("API Endpoint Summary");
p("Strocter exposes 47 API endpoints across 13 route groups:");

const apiSummary = [
  ["Route Group", "Base Path", "Endpoints", "Auth"],
  ["Health", "/", "1", "No"],
  ["Auth", "/api/auth", "3", "Partial"],
  ["Transactions", "/api/transactions", "4", "Yes"],
  ["Subscription", "/api/subscription", "4", "Yes"],
  ["Insights", "/api/insights", "8", "Yes + Feature"],
  ["Analytics", "/api/analytics", "6", "Yes + Premium"],
  ["Impulse", "/api/impulse", "3", "Yes + Premium"],
  ["Wealth", "/api/wealth", "5", "Yes + Premium"],
  ["Goals", "/api/goals", "6", "Yes + Premium"],
  ["Settings", "/api/settings", "3", "Yes"],
  ["Archive", "/api/archive", "3", "Yes + Premium"],
  ["Reports", "/api/reports", "3", "Yes + Premium"],
  ["Payment", "/api/payment", "2", "Yes"],
];
const apiWidths = [100, 130, 70, 100];
apiSummary.forEach((row, i) => {
  checkBreak(25);
  tableRow(row, apiWidths, i === 0);
});

h3("Middleware Pipeline");
p("Every request passes through a middleware pipeline:");
b("Level 1 — Global: CORS, JSON parsing, URL-encoded parsing, Morgan logging");
b("Level 2 — protect: JWT verification + user existence check (returns 401 if invalid)");
b("Level 3 — checkFeatureAccess: Trial period / subscription check (returns 403 if expired)");
b("Level 4 — premiumOnly: Premium subscription check (CURRENTLY BYPASSED — always passes)");

h3("Service Engine Architecture");
p("The backend separates business logic into specialized service engines. Controllers are thin — they validate input and delegate to engines. This is the core intelligence layer:");
b("analyticsEngine.js — Behavioral metrics, heatmap, cognitive analysis, sentiment trends");
b("impulseEngine.js — Impulse scoring, spike detection, friction simulation, trigger analysis");
b("wealthEngine.js — Stability index, risk exposure, savings, buffer, trend projections");
b("goalsEngine.js — Goal tracking, trajectory, AI memos, milestones, impact summary");
b("settingsEngine.js — Settings validation, normalization, sensitivity factor mapping");
b("subscriptionEngine.js — Subscription lifecycle, trial management, premium access control");
b("systemRecalculationService.js — Post-transaction risk evaluation (fire-and-forget)");
b("reportGenerator.js — PDFKit-based A4 report generation");
b("notificationEngine.js — Alert evaluation and channel preference checking");

doc.addPage();
addPageNum();

h2("Frontend Architecture");

h3("Project Structure");
code(`frontend/src/
  main.jsx         — Entry: BrowserRouter > AuthProvider > SubscriptionProvider > App
  App.jsx          — Route definitions (public + protected)
  index.css        — Global dark theme styles (Tailwind v4)
  lib/utils.js     — cn() utility (clsx + tailwind-merge)
  context/         — AuthContext.jsx, SubscriptionContext.jsx
  routes/          — ProtectedRoute.jsx (auth gate)
  services/        — 11 API service files (Axios-based)
  pages/           — 9 page components + sub-components
  components/      — 60+ reusable components`);

h3("State Management");
p("Strocter uses minimal state management — no Redux or Zustand:");
b("AuthContext (React Context): user object, token, login/register/logout functions");
b("SubscriptionContext (React Context): subscription status, isPremium flag");
b("Page-level state: useState hooks for API data, loading states, errors");
b("No client-side cache: data re-fetched on every page mount via useEffect");

h3("Design System");
p("Strocter uses a dark luxury fintech aesthetic:");
b("Background: Near-black (#050505) with noise overlay texture");
b("Cards: Dark glassmorphic panels (bg-white/[0.03], backdrop-blur, border-white/5)");
b("Primary Accent: Orange (#EC5B13) for CTAs, active states, highlights");
b("Secondary: Emerald Green (#38E6A2) for positive indicators, Purple (#6E33B1) for projections");
b("Typography: White headings, gray body text, monospace for data");
b("Animations: Framer Motion page transitions, staggered card entrances, hover scale effects");
b("3D: Three.js + R3F for landing page S-logo animation (1,050 instanced boxes, GSAP scroll fracture)");
b("Layout: Fixed sidebar (88px) + fixed top nav (64px) + scrollable main content");

// ═══════════════════════════════════════════════════════════════
// SECTION 6: DATABASE STRUCTURE
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Database Structure");

p("Strocter uses MongoDB Atlas (cloud-hosted NoSQL) with Mongoose v9 as the ODM. There are 6 data models that represent all entities in the platform.");

h2("User Model");
p("Stores user accounts, authentication credentials, and subscription state.");
const userFields = [
  ["Field", "Type", "Required", "Notes"],
  ["name", "String", "Yes", "Trimmed, max 50 chars"],
  ["email", "String", "Yes", "Unique, lowercase, regex validated"],
  ["password", "String", "Yes", "Min 6 chars, bcrypt hashed, select: false"],
  ["trialStartDate", "Date", "No", "Default: Date.now"],
  ["trialActive", "Boolean", "No", "Default: true"],
  ["subscriptionActive", "Boolean", "No", "Default: false"],
  ["subscription", "String", "No", "Enum: free/premium, Default: free"],
  ["subscriptionStart", "Date", "No", "Set on premium activation"],
  ["subscriptionEnd", "Date", "No", "Set on premium activation"],
  ["createdAt", "Date", "No", "Default: Date.now"],
];
const fWidths = [110, 80, 55, 230];
userFields.forEach((row, i) => { checkBreak(25); tableRow(row, fWidths, i === 0); });

spacer();

h2("Transaction Model");
p("Core data model — stores individual financial transactions with emotional and categorical metadata. Has compound indexes for efficient user-specific queries.");
const txnFields = [
  ["Field", "Type", "Required", "Notes"],
  ["user", "ObjectId (ref: User)", "Yes", "Indexed"],
  ["amount", "Number", "Yes", "Transaction value in INR"],
  ["type", "String", "Yes", "Enum: income / expense"],
  ["category", "String", "Yes", "Trimmed, indexed"],
  ["note", "String", "No", "Free-text description"],
  ["emotion", "String", "No", "User-selected emotion tag"],
  ["tags", "[String]", "No", "Default: empty array"],
  ["createdAt", "Date", "No", "Default: Date.now, indexed"],
];
txnFields.forEach((row, i) => { checkBreak(25); tableRow(row, fWidths, i === 0); });
spacer(0.3);
p("Compound Indexes: { user: 1, createdAt: -1 } and { user: 1, category: 1, createdAt: -1 } for efficient queries.");

h2("Goal Model");
p("Stores user financial goals with AI-powered milestone tracking.");
const goalFields = [
  ["Field", "Type", "Required", "Notes"],
  ["userId", "ObjectId (ref: User)", "Yes", "Goal owner"],
  ["type", "String", "No", "Enum: behavioral/savings/risk. Default: behavioral"],
  ["targetValue", "Number", "Yes", "Goal target amount"],
  ["currentValue", "Number", "No", "Default: 0"],
  ["horizon", "String", "No", "Enum: 30D/60D/90D. Default: 60D"],
  ["riskTolerance", "String", "No", "Enum: low/moderate/aggressive. Default: moderate"],
  ["aiSuggestions", "Boolean", "No", "Default: true"],
  ["milestones", "Array", "No", "Q1-Q4 with status: achieved/active/pending"],
  ["createdAt", "Date", "No", "Default: Date.now"],
];
goalFields.forEach((row, i) => { checkBreak(25); tableRow(row, fWidths, i === 0); });

doc.addPage();
addPageNum();

h2("SystemSettings Model");
p("Per-user system configuration with deeply nested AI controls, risk governance, security, and notification preferences. Unique constraint on userId ensures one settings document per user.");

h3plain("AI Controls Section");
b("impulseSensitivity: Number (0-2), Default: 1 — controls impulse detection sensitivity");
b("cognitiveFriction: Enum [minimal, balanced, aggressive], Default: balanced");
b("predictiveRiskSensitivity: Enum [minimal, balanced, aggressive], Default: balanced");
b("autoAdjustment: Boolean, Default: true — system auto-tunes based on behavior");

h3plain("Risk Governance Section");
b("highRiskThreshold: Number (1-100), Default: 15 — multiplied by 1000 for actual threshold");
b("lockStartTime: String, Default: '23:00' — budget lock window start");
b("lockEndTime: String, Default: '06:00' — budget lock window end");
b("categoryWeights: { leisure: 40, essentials: 15, enterprise: 45 } — auto-normalized to 100%");
b("lateNightAutoControl: Boolean, Default: false");

h3plain("Security Section");
b("twoFAEnabled: Boolean, Default: true (UI toggle only — not enforced in backend)");
b("biometricEnabled: Boolean, Default: true (UI toggle only — placeholder)");
b("sessionTimeout: Enum [15m, 30m, 1h, 4h, 24h], Default: 30m (stored but not enforced)");

h3plain("Notifications Section");
b("impulseSpikes: Boolean, Default: true");
b("riskEscalation: Boolean, Default: true");
b("stabilityWarnings: Boolean, Default: true");
b("goalTracking: Boolean, Default: true");
b("weeklySummary: Boolean, Default: true");
b("systemReports: Boolean, Default: false");

h2("Payment Model");
p("Records Razorpay payment transactions. Fields: userId (ref User), razorpayOrderId, razorpayPaymentId, amount, status (created/success/failed), createdAt.");

h2("Subscription Model");
p("Manages subscription lifecycle with unique index on userId. Fields: plan (free/premium), pricePaid, currency (INR), status (active/cancelled/expired/pending), paymentProvider, paymentId, paymentDate, expiresAt.");

h2("Data Relationships");
p("The database uses a simple relational pattern:");
b("User is the central entity — all other models reference userId");
b("Transactions belong to a User (user field, ObjectId reference)");
b("Goals belong to a User (userId field)");
b("SystemSettings belong to a User (userId field, unique)");
b("Subscriptions belong to a User (userId field, unique)");
b("Payments belong to a User (userId field)");
b("No cross-model joins — each query is scoped to a single user's data");

// ═══════════════════════════════════════════════════════════════
// SECTION 7: ANALYTICS ENGINE — ALGORITHMS & FORMULAS
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Analytics Engine — Algorithms & Formulas");

p("This section documents every algorithm and formula used in Strocter's behavioral analysis. This is the core intelligence layer of the platform.");

h2("Emotional vs. Logical Classification");
p("Every transaction is classified as either emotional or logical based on the emotion tag. The classification uses keyword matching against predefined lists:");

h3("Classification Logic");
p("Three different emotion keyword lists are used across different engines:");
b("7-item list (transactionController): stressed, impulsive, sad, excited, anxious, bored, happy");
b("9-item list (impulseEngine): impulse, stressed, anxious, angry, sad, bored, excited, happy, emotional");
b("12-item list (analyticsEngine): impulse, stress, angry, anxious, sad, bored, happy, excited, emotional, frustrated, revenge, retail therapy");
spacer(0.3);
p("If a transaction's emotion field contains (case-insensitive) any keyword from the relevant list, it is classified as EMOTIONAL. Otherwise, it is LOGICAL/ROUTINE.");

h2("Impulse Score (0-100)");
p("Composite metric measuring impulsive spending tendency. Used in Dashboard, Insights, and Impulse Lab.");

code(`impulseScore = (spikeRatio * 50) + (emotionalRatio * 50)

Where:
  spikeRatio    = (# of hours where amount > avgHourly * 1.4) / totalHours
  emotionalRatio = emotionalTransactionCount / totalTransactionCount
  baseline      = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100`);

p("The spike threshold of 1.4x means any hour where spending exceeds 140% of the average hourly spending is flagged as an impulse spike.");

h2("Financial Stability Index (0-100)");
p("Weighted composite score measuring overall financial health. Two implementations exist:");

h3("Wealth Engine (5-component weighted)");
code(`stabilityIndex = (savingsRate     * 0.30)
               + (volatilityScore * 0.25)
               + (impulseControl  * 0.20)
               + (incomeConsist.  * 0.15)
               + (liquidityRatio  * 0.10)

Where:
  savingsRate      = min(100, (savings / income) * 200)
  volatilityScore  = max(0, 100 - (coeffOfVariation * 50))
  impulseControl   = max(0, 100 - (emotionalRatio * 100))
  incomeConsistency = incomeCount > 0 ? 70 : 30
  liquidityRatio   = min(100, (savings / avgExpense) * 50)`);

h3("Insights Engine (Simple deduction)");
code(`stabilityIndex starts at 100
  - If volatility > 2: deduct 15;  if > 4: deduct 25
  - If impulseRatio > 0.3: deduct 10;  if > 0.6: deduct 15
  - If highLateNightRatio: deduct 10
  - If highWeekendRatio:   deduct 10

Result: score 0-100
  >= 70: "Stable"  |  >= 40: "Watchlist"  |  < 40: "Critical"`);

doc.addPage();
addPageNum();

h2("Risk Level Classification");
p("Based on volatility score calculated as the ratio of highest single expense to average daily spending:");
code(`volatilityScore = highestExpense / avgDailySpending

Risk Levels:
  volatilityScore < 2  → "Low Risk"
  volatilityScore < 5  → "Medium Risk"
  volatilityScore >= 5 → "High Risk"`);

h2("Risk Exposure (Wealth Engine)");
p("Based on emotional spending as a percentage of total spending:");
code(`emotionalRatio = emotionalSpending / totalSpending

Levels:
  < 20%  → LOW        "Minimal emotional exposure"
  < 40%  → MODERATE   "Some emotional patterns detected"
  < 60%  → ELEVATED   "Significant emotional spending"
  >= 60% → HIGH       "Critical emotional spending levels"`);

h2("Financial Personality Types");
p("Analyzed from the last 14 days of expense transactions:");
code(`1. Weekend Splurger:  weekendSpending > weekdaySpending
2. Stress Spender:    nightTransactions(10PM-5AM) > 30% of total
3. Impulsive Spender: transactions < Rs 200 > 50% of total
4. Balanced Spender:  default (none of above triggered)

Evaluation order: Weekend → Stress → Impulsive → Balanced`);

h2("Dopamine Index (0-100)");
p("Estimates emotional reward-seeking behavior in spending patterns:");
code(`dopamineIndex = min(100, (smallEmotionalCount / totalCount) * 150 + 30)

Where: smallEmotionalCount = emotional transactions with amount < Rs 500`);

h2("Cognitive Friction Simulation");
p("Models what-if scenarios for impulse resistance:");
code(`Input:  frictionValue (0-100, default 65)

predictedSavings  = totalEmotionalSpending * (friction/100) * 0.6
riskReduction     = friction * 0.75
stabilityForecast = min(100, baseStabilityScore + friction * 0.15)`);

h2("Psychological Intent Classification");
p("Every transaction receives a psychological intent label:");
code(`Category-based:
  investment/stocks/crypto/mutual fund/savings → "INVESTMENT"

Emotion-based:
  stressed/impulsive/sad/anxious/bored → "STRESS IMPULSE"
  excited/happy OR category = entertainment/shopping/dining → "EMOTIONAL/SOCIAL"

Default:
  Everything else → "LOGICAL/ROUTINE"`);

h2("Impact Score (15-85)");
p("Evaluates the financial impact of each transaction:");
code(`If emotion is emotional:
  amount > Rs 5000: score=80, "High Risk"
  amount > Rs 1000: score=55, "Moderate"
  else:             score=35, "Neutral"

If emotion is NOT emotional:
  category in [investment, education, savings]: score=15, "Optimal"
  else: score=30, "Neutral"`);

checkBreak(120);
h2("Spending Heatmap");
p("A 7x24 grid (day-of-week x hour-of-day) of spending intensity:");
code(`1. Group all expenses by {dayOfWeek, hour}
2. Sum amounts for each cell
3. Find maximum cell value
4. Normalize all cells to 0-5 scale: ceil((cellValue / maxValue) * 5)
5. Identify peak spending day and peak hour`);

checkBreak(100);
h2("Overspending Detection");
p("Compares current week vs. previous week spending by category:");
code(`For each category:
  increasePercent = ((currentWeek - prevWeek) / prevWeek) * 100
  If increasePercent > 30%: flagged as OVERSPENDING`);

checkBreak(100);
h2("Spike Detection");
p("Used in impulse timeline to identify spending anomalies:");
code(`1. Group transactions by hour (within selected range: 24h/7d/30d)
2. Calculate average hourly spending
3. Threshold = average * 1.4
4. Any hour exceeding threshold → marked as impulse spike`);

checkBreak(120);
h2("Volatility Classification");
p("Based on coefficient of variation (standard deviation / mean):");
code(`coeffOfVariation = stddev(amounts) / mean(amounts)

Levels:
  < 0.5  → "Low"
  < 1.0  → "Low-Med"
  < 1.5  → "Medium"
  >= 1.5 → "High"`);

checkBreak(120);
h2("Post-Transaction Risk Evaluation");
p("Fire-and-forget evaluation triggered after every transaction creation:");
code(`Trigger conditions:
  1. amount > highRiskThreshold * 1000 → risk alert
  2. Transaction during lock window (default 23:00-06:00)
     AND lateNightAutoControl enabled → late-night alert
  3. amount > Rs 5,000  → impulse spike alert
  4. amount > Rs 10,000 → risk elevation alert`);

// ═══════════════════════════════════════════════════════════════
// SECTION 8: SECURITY & AUTHENTICATION
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Security & Authentication");

h2("Authentication System");
p("Strocter uses stateless JWT-based authentication. There is no server-side session storage — all authentication state is carried in the JWT token.");

h3("Registration Process");
p("1. User submits { name, email, password } to POST /api/auth/register.");
p("2. Server validates email format using regex pattern.");
p("3. Server checks for duplicate email in the database.");
p("4. Password is hashed using bcryptjs with 10 salt rounds.");
p("5. User document is created in MongoDB with hashed password.");
p("6. Response returns user data (without password) — user must log in separately.");

h3("Login Process");
p("1. User submits { email, password } to POST /api/auth/login.");
p("2. Server finds user by email, explicitly selecting the password field (normally hidden).");
p("3. Server compares submitted password against bcrypt hash using bcrypt.compare().");
p("4. On match: server signs a JWT with payload { id, trialActive, subscriptionActive }.");
p("5. JWT is signed with JWT_SECRET environment variable, expires in 7 days.");
p("6. Token returned to client, stored in localStorage.");

h3("Token Verification");
p("1. Every protected API request must include: Authorization: Bearer <token>.");
p("2. The protect middleware extracts the token from the header.");
p("3. Token is verified using jwt.verify() with JWT_SECRET.");
p("4. If valid: user is fetched from database (excluding password), attached to req.user.");
p("5. If invalid/expired/missing: 401 Unauthorized response.");

h2("Authorization Layers");
p("Strocter has three layers of authorization, applied as Express middleware:");

b("Layer 1 — protect: JWT verification + user existence. Required for all authenticated routes. Returns 401 if token is invalid, expired, or user not found.");
spacer(0.2);
b("Layer 2 — checkFeatureAccess: Checks trial period and subscription status. If user is within 7-day trial period OR has active subscription, access is granted. Otherwise returns 403.");
spacer(0.2);
b("Layer 3 — premiumOnly: Checks premium subscription. CURRENTLY BYPASSED — always calls next(), granting all users free access. Comment in code: 'Revert this when payment gateway is added.'");

h2("Password Security");
b("Hashing: bcryptjs with 10 salt rounds");
b("Storage: password field has select: false in schema — never included in queries by default");
b("Validation: minimum 6 characters enforced at model level");
b("Comparison: bcrypt.compare() used for timing-safe comparison");

h2("Trial System");
b("Duration: 7 days from account creation (user.createdAt or user.trialStartDate)");
b("Computation: trial days remaining calculated dynamically on each request");
b("After expiry: premium features locked unless subscriptionActive = true");
b("Current state: trial system is irrelevant because all features are free (premiumOnly bypassed)");

h2("Payment Security (Razorpay)");
p("Payment verification uses HMAC-SHA256 signature validation:");
b("1. Server creates order via Razorpay API (amount: Rs 1 = 100 paise, currency: INR)");
b("2. Client completes payment on Razorpay's hosted checkout widget");
b("3. Client receives { razorpay_order_id, razorpay_payment_id, razorpay_signature }");
b("4. Server computes HMAC-SHA256 of 'order_id|payment_id' using RAZORPAY_KEY_SECRET");
b("5. If computed hash matches razorpay_signature: payment is verified and user is upgraded");
b("6. If mismatch: payment is rejected, no upgrade occurs");

h2("Security Features (Settings)");
p("The following security features are configurable in Settings but currently exist as UI toggles only — they are NOT enforced in the backend authentication flow:");
b("Two-Factor Authentication (2FA): Toggle in Settings UI. Not connected to the login flow.");
b("Biometric Access (FaceID/TouchID): Toggle in Settings UI. Placeholder — no native integration.");
b("Session Timeout: Configurable 15m/30m/1h/4h/24h. Value stored in SystemSettings but not enforced server-side (JWT expiry is always 7 days regardless).");

h2("CORS Configuration");
p("Backend only accepts requests from these origins:");
b("http://localhost:5173");
b("http://127.0.0.1:5173");
b("Credentials are enabled for cookie/header forwarding");
b("Content-Disposition header is exposed for file downloads");
b("No production domain is currently configured");

// ═══════════════════════════════════════════════════════════════
// SECTION 9: CHATBOT KNOWLEDGE BASE — Q&A
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Chatbot Knowledge Base — Q&A Reference");

p("This section provides a comprehensive Q&A reference for the AI chatbot. These are the most common questions users are likely to ask, with accurate answers based on the actual platform implementation.");

h2("General Questions");

qaBlock("What is Strocter?",
  "Strocter is a Behavioral Finance AI Platform — a Money Psychology Tracker. It helps you understand the psychology behind your spending by tracking transactions with emotion tags, detecting impulse patterns, computing financial stability scores, and providing AI-driven behavioral insights. It goes beyond traditional expense tracking by analyzing WHY you spend, not just WHAT you spend.");

qaBlock("Is Strocter free?",
  "Currently, yes. Strocter is in early access mode, and ALL features — including premium ones — are available completely free at Rs 0. Normally, the platform has a 7-day free trial followed by a premium subscription at Rs 499/month. During early access, there is no payment required.");

qaBlock("What currency does Strocter use?",
  "Strocter uses Indian Rupees (INR, Rs). All amounts, thresholds, and calculations are in INR.");

qaBlock("How do I create an account?",
  "Visit the Strocter landing page and click 'Get Started'. You'll need to provide your Name, Email, and Password (minimum 6 characters). After registration, log in with your email and password to access the dashboard.");

qaBlock("Is my data secure?",
  "Yes. Passwords are hashed using bcryptjs with 10 salt rounds (never stored in plain text). Authentication uses JWT tokens that expire every 7 days. All API routes are protected and require a valid token. The database is hosted on MongoDB Atlas with cloud-level security.");

qaBlock("Can I use Strocter on mobile?",
  "Strocter is a responsive web application. While it's optimized for desktop, it works on mobile browsers with a responsive layout. There is no native mobile app at this time.");

h2("Transaction Questions");

qaBlock("How do I add a transaction?",
  "Click the 'Add Transaction' button in the top navigation bar (available from any page). Fill in: Amount (in Rs), Type (Income or Expense), Category, optional Note, Emotion (how you felt), optional Tags, and Date. The emotion tag is key — it's what powers all behavioral analysis.");

qaBlock("What categories can I choose?",
  "The 9 user-facing categories are: Food & Dining, Housing, Transportation, Entertainment, Shopping, Utilities, Healthcare, Salary, and Investment.");

qaBlock("What emotions can I tag?",
  "The 5 user-facing emotion options are: Logical/Routine, Impulsive, Stress/Anxiety, Celebratory, and Neutral (selected by default).");

qaBlock("Can I edit or delete a transaction?",
  "The current version focuses on adding transactions. Transaction history is viewable on the Transactions page with pagination (up to 50 per page). Each transaction shows its category, amount, type, emotion, tags, psychological intent, and impact level.");

qaBlock("What is 'Psychological Intent' on my transactions?",
  "Each transaction is automatically classified into one of 4 psychological intents: INVESTMENT (stocks, crypto, savings), STRESS IMPULSE (stressed, impulsive, sad, anxious), EMOTIONAL/SOCIAL (excited, happy, entertainment), or LOGICAL/ROUTINE (everything else). This helps you see the psychological driver behind each transaction.");

qaBlock("What is the 'Impact Score'?",
  "Each transaction receives an impact score from 15-85 indicating its financial impact. Emotional transactions over Rs 5,000 get 'High Risk' (80), over Rs 1,000 get 'Moderate' (55). Investment/education transactions get 'Optimal' (15). This helps identify which transactions have the biggest behavioral impact.");

doc.addPage();
addPageNum();

h2("Analytics & Insights Questions");

qaBlock("What is my Impulse Score?",
  "Your Impulse Score (0-100) measures how impulsive your spending is. It's calculated as: 50% based on spike frequency (hours where you spent more than 1.4x your average) + 50% based on the ratio of emotionally-tagged transactions. Lower is better. A score above 50 suggests significant impulse spending patterns.");

qaBlock("What is the Stability Index?",
  "The Financial Stability Index (0-100) is a weighted composite measuring your overall financial health: savings rate (30%), spending volatility (25%), impulse control (20%), income consistency (15%), and liquidity ratio (10%). Scores above 70 are 'Stable', 40-70 are 'Watchlist', below 40 are 'Critical'.");

qaBlock("What is the Spending Heatmap?",
  "The heatmap is a 7-day by 24-hour grid showing when you spend the most. Each cell represents a specific day-of-week and hour combination, colored by intensity (dark = low, bright orange = high). It helps you identify your peak spending times — for example, you might discover you overspend on Saturday evenings or weekday lunch hours.");

qaBlock("What is my Financial Personality?",
  "Based on your last 14 days of spending, Strocter classifies you as one of 4 personality types: Weekend Splurger (you spend more on weekends than weekdays), Stress Spender (30%+ of your transactions happen between 10PM-5AM), Impulsive Spender (50%+ of your transactions are under Rs 200), or Balanced Spender (none of the above patterns detected).");

qaBlock("What is Cognitive Friction?",
  "Cognitive Friction is a simulation tool in the Impulse Lab. It models what would happen if you applied a resistance factor (0-100%) to your impulsive spending. You adjust a slider and see: how much money you'd save, how much your risk would decrease, and what your stability score would become. It's a 'what-if' tool for behavioral planning.");

qaBlock("What is the Dopamine Index?",
  "The Dopamine Index (0-100) estimates emotional reward-seeking behavior in your spending. It's calculated based on the ratio of small emotional transactions (under Rs 500) to total transactions. A higher index suggests more frequent small emotional purchases — a pattern associated with dopamine-driven spending.");

qaBlock("What does the Sentiment Timeline show?",
  "The Sentiment Timeline is a 6-week chart showing the percentage of emotional vs. logical spending over time. Two lines — orange (emotional %) and green (logical %) — show whether your spending is trending more emotional or more rational. Ideally, you want to see the green line trending upward.");

qaBlock("What is Risk Exposure?",
  "Risk Exposure measures how much of your total spending is emotional. Levels: LOW (under 20% emotional), MODERATE (20-40%), ELEVATED (40-60%), HIGH (over 60%). Lower emotional spending ratio = lower risk exposure.");

qaBlock("What is a Financial Buffer?",
  "Your Financial Buffer shows how many months of expenses your savings can cover. It's calculated as: accumulated savings (income minus expenses) divided by average monthly expenses. A buffer of 3+ months is generally considered healthy.");

h2("Goals & Planning Questions");

qaBlock("How do I create a financial goal?",
  "Go to the Goals page and click 'Create New Goal'. Choose a goal type (Behavioral, Savings, or Risk), set a target value in Rs, select a time horizon (30, 60, or 90 days), set your risk tolerance (Low, Moderate, or Aggressive), and optionally enable AI suggestions. The system auto-creates 4 quarterly milestones (Q1-Q4).");

qaBlock("What is the AI Strategy Memo?",
  "The AI Strategy Memo is an automated recommendation generated by analyzing your spending triggers. It identifies your primary trigger (late-night spending, emotional transactions, or irregular patterns), recommends a specific action (like 'Budget Auto-Lock'), and calculates expected impacts on savings, risk, and stability.");

qaBlock("What are Goal Milestones?",
  "When you create a goal, Strocter generates 4 quarterly milestones (Q1-Q4). Each milestone has a status: Achieved (completed), Active (currently working on), or Pending (upcoming). The milestone tracker displays these as a horizontal roadmap with connected nodes.");

doc.addPage();
addPageNum();

h2("Reports & Export Questions");

qaBlock("Can I export my data?",
  "Yes, Strocter supports two export formats: (1) CSV — export your transaction data or analytics data as CSV files from the Archive page. (2) PDF — generate professional behavioral analysis reports with executive summary, metrics, cognitive analysis, and category breakdown.");

qaBlock("What's in a PDF report?",
  "A generated PDF report (A4 size) includes: Report header with ID and date, Executive Summary of your behavioral patterns, 5 Key Behavioral Metrics (emotional spending, dopamine index, resilience score, volatility, logical spending), Cognitive Analysis (identified trigger, recommended action, motivational quote), and Category Breakdown with emotional/logical split.");

qaBlock("What is the Report Preview in Archive?",
  "The Archive page shows institutional-style document previews with a formal cream-colored background. Each preview includes: document metadata (series ID, version, release date, auth code), executive summary, narrative analysis, mitigation protocols, embedded metrics bars (stability, risk variance, emotional spend %), and a 6-month projection.");

h2("Settings Questions");

qaBlock("What can I customize in Settings?",
  "Settings has 4 sections: (1) AI Model Controls — adjust impulse sensitivity (0-2), cognitive friction level, predictive risk sensitivity, and auto-adjustment. (2) Risk Governance — set high-risk threshold, budget lock time window, category risk weights, and late-night auto-control. (3) Security — toggle 2FA, biometric access, and session timeout. (4) Notifications — toggle 6 types of alerts.");

qaBlock("What does Impulse Sensitivity control?",
  "The Impulse Sensitivity slider (0-2) controls how sensitive the impulse detection engine is. 0 = low sensitivity (less sensitive, fewer flags), 1 = balanced (default), 2 = high sensitivity (more sensitive, more flags). It maps to a multiplier: 0→0.7x, 1→1.0x, 2→1.4x applied to impulse calculations.");

qaBlock("What is the Budget Lock Time Window?",
  "The Budget Lock window defines hours when late-night spending triggers additional alerts. Default: 23:00 to 06:00. If 'Late-Night Auto-Control' is enabled, transactions during this window may trigger risk alerts.");

qaBlock("What are Category Risk Weights?",
  "Category Risk Weights determine how much weight each spending category has in risk calculations. Three categories: Leisure (default: 40%), Essentials (default: 15%), Enterprise (default: 45%). The system automatically normalizes these to sum to 100% when you adjust them.");

h2("Account & Subscription Questions");

qaBlock("How long is the free trial?",
  "The standard free trial is 7 days from account creation. However, during the current early access period, ALL features are completely free with no time limit. The trial system is currently irrelevant.");

qaBlock("How does payment work?",
  "Payment is handled through Razorpay (Indian payment gateway). When activated, the introductory price is Rs 1 for the first month. Payment flow: create order → complete on Razorpay checkout → signature verification → account upgraded to premium for 30 days. Currently, payment is not required as everything is free.");

qaBlock("Can I cancel my subscription?",
  "Yes, you can cancel at any time. Cancellation immediately downgrades your account to the free plan. During early access, this is irrelevant since all features are free.");

// ═══════════════════════════════════════════════════════════════
// SECTION 10: FUTURE ROADMAP
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Future Roadmap & Planned Features");

p("Based on the current codebase analysis, the following features are either partially implemented, planned, or represent natural evolution paths for the Strocter platform:");

h2("Features in Code but Not Active");

h3("OpenAI Integration");
p("The OpenAI SDK (v6.25) is installed as a dependency with an API key in the environment variables, but no active code uses it. This suggests planned AI-powered features such as natural language insights, chatbot conversations, or GPT-generated financial advice. The infrastructure is ready for activation.");

h3("Impulse Lab Page");
p("A fully built ImpulseLab page exists at src/pages/impulse/ImpulseLab.jsx with 4 components (ImpulseMetrics, TriggerTimelineChart, TriggerBreakdownCards, SimulationPanel), and the backend API endpoints are functional. However, the page is NOT mounted in the router (App.jsx). It could be activated by adding a single route line.");

h3("Premium Subscription System");
p("The full subscription system exists — models, controllers, Razorpay integration, trial management, feature gating middleware, and frontend components (PremiumGate, UpgradeModal, PricingCards). Everything is currently bypassed for early access but can be activated by restoring the premiumOnly middleware and PremiumGate component logic.");

h2("Potential Enhancements");

h3("Security Enforcement");
p("2FA, biometric authentication, and session timeout settings exist in the UI and database but are not enforced in the backend. Implementing actual 2FA (via email/SMS OTP or authenticator apps), real session management with server-side timeout, and proper session invalidation would strengthen security.");

h3("Search Functionality");
p("The search input in the top navigation bar is currently a UI placeholder with no functionality. Implementing transaction search (by category, note, amount range, date range, emotion, tags) would significantly improve the user experience.");

h3("Transaction Editing and Deletion");
p("Currently, transactions can only be created. Adding edit and delete capabilities with proper recalculation triggers would complete the transaction lifecycle.");

h3("Production Deployment");
p("CORS is currently restricted to localhost origins. For production, the backend needs production domain configuration, HTTPS enforcement, environment-specific settings, and proper error handling without stack traces.");

h2("Natural Evolution Path");
b("AI Chatbot: Integrate OpenAI for conversational financial advice (SDK already installed)");
b("Budget Planning: Monthly budget creation with category-level allocations");
b("Recurring Transactions: Automatic tracking of subscriptions and recurring expenses");
b("Bank Integration: Automatic transaction import via banking APIs or UPI");
b("Multi-currency Support: Expand beyond INR to support global users");
b("Social Features: Anonymous comparison with peers in similar demographics");
b("Mobile App: Native iOS/Android app for on-the-go tracking");
b("Notifications: Push notifications for impulse spike alerts and goal milestones");
b("Data Visualization: Additional chart types, custom date ranges, and comparative analytics");
b("Machine Learning: Move from rule-based classification to ML-based behavioral prediction");

// ═══════════════════════════════════════════════════════════════
// SECTION 11: CONCLUSION
// ═══════════════════════════════════════════════════════════════
doc.addPage();
addPageNum();

h1("Conclusion");

h2("What Strocter Is");
p("Strocter is a Behavioral Finance AI Platform that transforms how individuals understand their relationship with money. By requiring emotion tags on every transaction, it creates a unique psychological dataset that powers deep behavioral analysis — something no traditional expense tracker offers.");

p("The platform computes proprietary metrics like the Impulse Score (0-100), Financial Stability Index (weighted 5-component composite), Dopamine Index, Risk Exposure levels, and Financial Personality Types. It visualizes spending patterns through heatmaps, sentiment timelines, and category emotional/logical splits. It projects future stability, simulates cognitive friction scenarios, and generates institutional-grade reports.");

h2("Current State");
p("Strocter is in early access mode. All premium features are free. The platform is fully functional with:");
b("Complete transaction tracking with emotion tagging");
b("6 analytical engines (analytics, impulse, wealth, goals, settings, subscription)");
b("47 API endpoints across 13 route groups");
b("9 frontend pages with 60+ components");
b("Professional PDF and CSV report generation");
b("Razorpay payment integration (ready but bypassed)");
b("Dark luxury UI with 3D animations, glassmorphic design, and responsive layout");

h2("Key Numbers for Chatbot Reference");
const keyNumbers = [
  ["Metric", "Value"],
  ["API Endpoints", "47 across 13 route groups"],
  ["Database Models", "6 (User, Transaction, Goal, SystemSettings, Payment, Subscription)"],
  ["Service Engines", "9 specialized business logic engines"],
  ["Frontend Pages", "9 routed pages"],
  ["Frontend Components", "60+ reusable components"],
  ["Transaction Categories", "9 user-facing options"],
  ["Emotion Options", "5 user-facing options"],
  ["Impulse Score Range", "0-100 (spike ratio 50% + emotional ratio 50%)"],
  ["Stability Index Range", "0-100 (5-component weighted composite)"],
  ["Impact Score Range", "15-85"],
  ["Spike Threshold", "1.4x average hourly spending"],
  ["JWT Expiry", "7 days"],
  ["Password Salt Rounds", "10 (bcryptjs)"],
  ["Trial Duration", "7 days"],
  ["Subscription Duration", "30 days (premium)"],
  ["Intro Price", "Rs 1 (currently Rs 0 — early access)"],
  ["Heatmap Grid", "7 days x 24 hours = 168 cells"],
  ["Personality Types", "4 (Weekend Splurger, Stress Spender, Impulsive, Balanced)"],
  ["Risk Levels", "4 (LOW, MODERATE, ELEVATED, HIGH)"],
];
const knWidths = [180, 310];
keyNumbers.forEach((row, i) => {
  checkBreak(25);
  tableRow(row, knWidths, i === 0);
});

spacer();

h2("Chatbot Integration Summary");
p("This document serves as the comprehensive knowledge base for the Strocter AI chatbot. It contains everything the chatbot needs to accurately answer user questions about:");
b("What Strocter is and what problems it solves");
b("All features, how they work, and what they show");
b("The complete user flow from registration to daily usage");
b("Technical architecture, tech stack, and system design");
b("Database structure and data models");
b("Every algorithm and formula used in behavioral analysis");
b("Security implementation and authentication flow");
b("Frequently asked questions with detailed answers");
b("Platform roadmap and planned features");

spacer();
p("The chatbot should use this document as its primary source of truth for all Strocter-related questions. For questions not covered here, the chatbot should indicate that the question falls outside the current knowledge base and suggest the user contact Strocter support.");

spacer(1.5);
divider();
spacer(0.5);
doc.fontSize(10).fillColor(C.lightGray).font("Helvetica").text("End of Strocter AI Chatbot Knowledge Base", { align: "center" });
doc.fontSize(9).fillColor(C.lightGray).text(`Version 1.0 — Generated ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`, { align: "center" });
doc.fontSize(8).fillColor(C.lightGray).text("Strocter — Behavioral Finance AI Platform — Money Psychology Tracker", { align: "center" });

// ═══════════════════════════════════════════════════════════════
// FINALIZE — TOC + Page Numbers
// ═══════════════════════════════════════════════════════════════

const pages = doc.bufferedPageRange();

// Write Table of Contents
doc.switchToPage(tocPageIndex);
let tocY = tocStartY;
tocEntries.forEach((entry) => {
  if (tocY > 780) return;
  const indent = entry.level === 1 ? 55 : 80;
  const fontSize = entry.level === 1 ? 12 : 10;
  const font = entry.level === 1 ? "Helvetica-Bold" : "Helvetica";
  const color = entry.level === 1 ? C.darkGray : C.medGray;

  doc.fontSize(fontSize).fillColor(color).font(font).text(entry.label, indent, tocY);
  // Page number on the right
  doc.fontSize(fontSize).fillColor(C.lightGray).font("Helvetica").text(`${entry.page}`, 500, tocY, { width: 45, align: "right" });
  tocY += entry.level === 1 ? 26 : 19;
});

// Add page numbers and footer to all pages (except cover)
for (let i = 1; i < pages.start + pages.count; i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor(C.lightGray).font("Helvetica").text(
    `Strocter — AI Chatbot Knowledge Base  |  Page ${i}  |  Confidential`,
    50, 812,
    { width: 495, align: "center" }
  );
}

doc.end();

stream.on("finish", () => {
  const stats = fs.statSync(outputPath);
  console.log("");
  console.log("=".repeat(55));
  console.log("  STROCTER — AI CHATBOT KNOWLEDGE BASE");
  console.log("=".repeat(55));
  console.log(`  File:   ${outputPath}`);
  console.log(`  Size:   ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`  Pages:  ${pages.count}`);
  console.log(`  Sections: 11`);
  console.log(`  TOC Entries: ${tocEntries.length}`);
  console.log("=".repeat(55));
  console.log("  PDF generated successfully!");
  console.log("");
});

stream.on("error", (err) => {
  console.error("PDF generation failed:", err);
});
