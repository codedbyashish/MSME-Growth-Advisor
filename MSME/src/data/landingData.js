export const defaultLandingData = {
  hero: {
    badge: "⚡ AI-POWERED MSME GROWTH ENGINE 2.0",
    title: "Accelerate Your Business Growth with Real-Time AI Financial Intelligence.",
    description: "Stop relying on delayed spreadsheets. MSME Growth Advisor continuously syncs your financial ledgers, predicts cash shortages before they happen, unlocks collateral-free credit, and guides your daily growth trajectory.",
    ctaPrimary: "CALCULATE YOUR GROWTH",
    ctaSecondary: "TEST AI CO-PILOT LIVE",
    companyMock: {
      name: "Apex Electronics & Supplies",
      syncSource: "Live Sync: Tally Prime + Bank Feeds",
      status: "Active Co-Pilot",
      growthScore: 92,
      growthTrend: "+18.4% YoY",
      netRevenue: "₹24.8 Lakhs",
      burnRate: "₹4.2 Lakhs"
    },
    heroPrompts: [
      {
        id: "cash-flow",
        label: "🔮 Forecast 90-Day Cash Flow",
        query: "What is my cash runway for the next 90 days?",
        answer: "Surplus of ₹6.4L projected by Month 3. Overdue invoices of ₹3.2L from 2 clients need automated collection reminders.",
        growthMetric: "+22% Working Capital",
        growthScore: 94,
        bars: [40, 55, 70, 85, 100]
      },
      {
        id: "loan-eligible",
        label: "🏦 Check CGTMSE Loan Limit",
        query: "Am I eligible for CGTMSE collateral-free credit?",
        answer: "Eligible for up to ₹25.0 Lakhs at 8.75% p.a. Bank audit readiness score is 92/100 (Pre-approved).",
        growthMetric: "₹25L Credit Approved",
        growthScore: 96,
        bars: [50, 65, 80, 92, 98]
      },
      {
        id: "inventory-cut",
        label: "📦 Optimize Inventory Deadstock",
        query: "How can I reduce inventory carrying costs by 15%?",
        answer: "3 fast-moving SKUs are understocked by 18%, while SKU-B4 has ₹1.8L tied up. Reallocate stock to unlock cash in 7 days.",
        growthMetric: "₹1.8L Cash Unlocked",
        growthScore: 91,
        bars: [30, 45, 60, 78, 91]
      }
    ]
  },
  calculator: {
    badge: "INTERACTIVE MSME GROWTH ENGINE",
    title: "See How Fast Your MSME Can Scale",
    subtitle: "Select your sector & monthly turnover below to generate your personalized 90-day AI Growth Directive.",
    sectors: [
      { id: "textile", name: "Textiles & Garments", icon: "Shirt" },
      { id: "manufacturing", name: "Manufacturing & Engineering", icon: "Factory" },
      { id: "retail", name: "Retail & Wholesale Trading", icon: "ShoppingBag" },
      { id: "services", name: "Services & Tech Agencies", icon: "Laptop" },
      { id: "food", name: "Food & Agriculture", icon: "Utensils" }
    ],
    turnovers: [
      { id: "t1", label: "₹2L - ₹5L / mo", value: 3.5 },
      { id: "t2", label: "₹5L - ₹15L / mo", value: 10 },
      { id: "t3", label: "₹15L - ₹50L / mo", value: 30 },
      { id: "t4", label: "₹50L+ / mo", value: 75 }
    ],
    goals: [
      { id: "cashflow", label: "Recover Overdue Payments", icon: "Zap" },
      { id: "credit", label: "Unlock Collateral-Free Loans", icon: "Building2" },
      { id: "margin", label: "Expand Profit Margins", icon: "TrendingUp" }
    ]
  },
  comparison: {
    badge: "THE MSME TRANSFORMATION",
    title: "Traditional Bookkeeping vs. MSME Growth Advisor",
    subtitle: "Move from reactive tax-filing to continuous proactive growth acceleration.",
    items: [
      {
        title: "Cash Flow Forecasting",
        traditional: "Guesswork based on bank balance at month-end",
        advisor: "AI-predicted 90-day cash runway with automated risk warnings",
        impact: "Zero Cash Outages"
      },
      {
        title: "Overdue Invoice Recovery",
        traditional: "Manual phone calls & 45+ day payment delays",
        advisor: "Automated WhatsApp payment reminders with one-tap UPI links",
        impact: "14 Days Faster Collection"
      },
      {
        title: "Bank Credit Access",
        traditional: "Months of paperwork & rejection due to informal metrics",
        advisor: "Instant bank-ready credit health score & CGTMSE matching",
        impact: "₹25L Unlocked Fast"
      },
      {
        title: "Strategic Decision Making",
        traditional: "Waiting 6 months for CA audit reports",
        advisor: "Instant 24/7 AI Co-Pilot chat for pricing, hiring & expansion advice",
        impact: "+24% Margin Growth"
      }
    ]
  },
  liveTickerEvents: [
    { city: "Surat, Gujarat", sector: "Textiles", result: "Unlocked ₹18.5L CGTMSE Credit", time: "2 mins ago" },
    { city: "Rajkot, Gujarat", sector: "Auto Parts", result: "Recovered ₹4.2L Overdue Receivables", time: "5 mins ago" },
    { city: "Jaipur, Rajasthan", sector: "Crafts & Exports", result: "Boosted Profit Margin by +6.8%", time: "9 mins ago" },
    { city: "Bengaluru, Karnataka", sector: "Electronics", result: "Reduced Inventory Carrying Cost by 18%", time: "14 mins ago" },
    { city: "Ludhiana, Punjab", sector: "Manufacturing", result: "Achieved 96/100 Bank Credit Score", time: "18 mins ago" }
  ],
  features: {
    title: "Enterprise-grade intelligence for the MSME ecosystem.",
    subtitle: "We strip away the complexity of financial modeling, providing you with clear directives rather than confusing spreadsheets.",
    items: [
      {
        id: "ai-advisor",
        title: "AI Strategic Advisor",
        description: "Ask questions about your business in plain English. Get data-backed strategic advice instantly.",
        badgeQuestion: "Can I afford a new hire?",
        badgeAnswer: "Based on ₹4k burn rate, yes. Suggest hiring in Q3.",
        icon: "MessageSquare",
        color: "emerald"
      },
      {
        id: "predictive-sales",
        title: "Predictive Sales",
        description: "Forecast revenue confidently based on historical trends and current pipeline velocity.",
        target: "Q4 Target: ₹45.2k",
        icon: "TrendingUp",
        color: "teal"
      },
      {
        id: "health-score",
        title: "Business Health Score",
        description: "A single metric summarizing cash flow, liabilities, and growth trajectory.",
        score: 84,
        icon: "ShieldCheck",
        color: "emerald"
      }
    ]
  },
  onboarding: {
    tag: "ONBOARDING",
    title: "From zero to insight in minutes.",
    subtitle: "Scroll down to watch our automated AI pipeline initialize in real-time.",
    steps: [
      {
        number: 1,
        title: "Connect Data Sources",
        description: "Securely link your accounting software, bank accounts, and CRM with one click.",
        triggerScroll: 15,
        icons: ["Building2", "Database", "Zap"]
      },
      {
        number: 2,
        title: "AI Processing & Categorization",
        description: "Our engine categorizes transactions, identifies anomalies, and builds a predictive baseline model.",
        triggerScroll: 50,
        badge: "Active Engine"
      },
      {
        number: 3,
        title: "Act on Insights",
        description: "Review personalized recommendations and monitor your live health score co-pilot dashboard.",
        triggerScroll: 85,
        badge: "Dashboard Ready"
      }
    ]
  },
  about: {
    badge: "EMPOWERING INDIAN MSMEs",
    title: "Financial Clarity for 63+ Million MSMEs",
    description: "Micro, Small, and Medium Enterprises generate over 30% of India's GDP. We built MSME Growth Advisor to eliminate cash-flow anxiety, streamline inventory management, and unlock collateral-free bank credit.",
    stats: [
      {
        value: "₹500Cr+",
        label: "Revenue Analyzed",
        sublabel: "Real-time ledger processing",
        color: "emerald-500"
      },
      {
        value: "12,000+",
        label: "Active Business Owners",
        sublabel: "Across 24 Indian States",
        color: "teal-400"
      },
      {
        value: "98.4%",
        label: "Prediction Accuracy",
        sublabel: "AI Risk & Cash Flow Model",
        color: "emerald-400"
      },
      {
        value: "₹2.5Cr",
        label: "Avg Credit Unlocked",
        sublabel: "CGTMSE & Mudra Schemes",
        color: "amber-400"
      }
    ]
  },
  pricing: {
    badge: "TRANSPARENT & AFFORDABLE PRICING",
    title: "Simple plans built for Indian MSMEs",
    subtitle: "Start with a 14-day free trial. Scale as your turnover grows with no hidden setup fees.",
    discountBadge: "SAVE 20%",
    plans: [
      {
        id: "starter",
        name: "Starter / Micro",
        subtitle: "Perfect for small traders, artisans & local retail shops.",
        monthlyPrice: "999",
        annualPrice: "799",
        features: [
          "Up to 200 Monthly Invoices",
          "Real-time Cash Flow Tracker",
          "Basic Inventory Low Stock Alerts",
          "GST Invoicing & Billing"
        ],
        disabledFeatures: [
          "AI Co-Pilot Financial Advisor"
        ],
        ctaText: "START FREE TRIAL",
        isPopular: false
      },
      {
        id: "growth",
        name: "Growth / SME Pro",
        subtitle: "For growing manufacturers, wholesalers & multi-branch firms.",
        monthlyPrice: "2,499",
        annualPrice: "1,999",
        features: [
          "Unlimited Invoices & Expenses",
          "AI Strategic Financial Co-Pilot",
          "Automated Risk & Bank Health Audit",
          "MSME Govt Subsidy & Credit Tracker",
          "Priority WhatsApp & Phone Support"
        ],
        disabledFeatures: [],
        ctaText: "START 14-DAY FREE TRIAL",
        isPopular: true,
        popularBadge: "MOST POPULAR FOR MSMEs"
      },
      {
        id: "enterprise",
        name: "Enterprise & Franchise",
        subtitle: "For multi-entity businesses requiring custom ERP integration.",
        monthlyPrice: "5,999",
        annualPrice: "4,799",
        features: [
          "Everything in Growth Plan",
          "Custom Tally & Busy ERP Integration",
          "Multi-User Role & GST Permissions",
          "Dedicated CA / Financial Consultant",
          "Custom API & Export Access"
        ],
        disabledFeatures: [],
        ctaText: "TALK TO SALES",
        isPopular: false
      }
    ]
  },
  testimonials: {
    badge: "VERIFIED MSME OWNER REVIEWS",
    title: "Loved by MSME Leaders across India",
    subtitle: "See how business owners are accelerating growth and reducing financial stress.",
    hoverNotice: "(Hover to pause auto-scroll)",
    reviews: [
      {
        name: "Rajesh Sharma",
        role: "Owner, Surat Weavers & Textiles",
        location: "Surat, Gujarat",
        rating: 5,
        comment: "MSME Growth Advisor helped us identify ₹14 Lakhs in uncollected pending invoices within 2 weeks. The AI Co-Pilot chat feels like having a senior CA on speed dial!",
        metric: "+14.2% Cash Flow"
      },
      {
        name: "Ananya Patel",
        role: "Managing Director, Rajkot Auto Parts",
        location: "Rajkot, Gujarat",
        rating: 5,
        comment: "We qualified for the CGTMSE collateral-free loan thanks to the automated bank health audit report generated by the app. Processed smoothly in 4 days!",
        metric: "₹25L Loan Approved"
      },
      {
        name: "Vikram Singh",
        role: "Founder, Jaipur Craft Exports",
        location: "Jaipur, Rajasthan",
        rating: 5,
        comment: "The inventory low stock alerts saved our factory from missing a major shipping deadline. Must-have co-pilot software for Indian manufacturers.",
        metric: "Zero Stock Bottlenecks"
      },
      {
        name: "Karthik Iyer",
        role: "CEO, Tirupur Garments Co.",
        location: "Tirupur, Tamil Nadu",
        rating: 5,
        comment: "Our net profit margin improved from 12% to 17% in just 3 months by following the AI co-pilot vendor cost reduction strategy!",
        metric: "+5% Margin Boost"
      },
      {
        name: "Pooja Agarwal",
        role: "Director, Mumbai Retail Distributors",
        location: "Mumbai, Maharashtra",
        rating: 5,
        comment: "The fluid light/dark UI and instant health score give me total peace of mind every morning before opening our warehouse branches.",
        metric: "98/100 Health Score"
      }
    ]
  },
  cta: {
    title: "Ready to scale with certainty?",
    subtitle: "Join thousands of MSMEs already optimizing their cash flow and predicting growth.",
    inputPlaceholder: "Enter your work email",
    buttonText: "GET STARTED",
    disclaimer: "NO CREDIT CARD REQUIRED. 14-DAY FREE TRIAL."
  },
  footer: {
    brandName: "MSME Growth Advisor",
    links: [
      { name: "Product", href: "#product" },
      { name: "Company", href: "#company" },
      { name: "Support", href: "#support" },
      { name: "Legal", href: "#legal" }
    ],
    copyright: "© 2026 MSME Growth Advisor. All rights reserved."
  }
};
