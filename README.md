# RFQ Intelligence Agent 🤖💼

> **Turn broad business ideas into actionable Request for Quotes (RFQs) instantly.**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📖 Overview

The **RFQ Intelligence Agent** is a Next.js-based AI concept explorer designed to streamline the procurement process. It bridges the gap between vague high-level requirements (e.g., *"I want to open a coffee shop in Mumbai"*) and specific, actionable commercial intent.

Instead of browsing endless catalogs, users simply state their business goal. The agent intelligently breaks this down into:
1.  **A complete list of necessary items/equipment** (Product breakdown)
2.  **Recommended specifications** for each item.
3.  **Estimated quantities** based on the scale of operation.
4.  **Price ranges** (in INR) relevant to the Indian market.
5.  **Sourcing intelligence** (key hubs, suppliers, and brands).

## ✨ Key Features

-   **🧠 Natural Language Understanding**: Interprets user queries like "Setup a 2000sqft gym" or "Need 1000 plain t-shirts".
-   **🏢 Business Logic Decomposition**: Automatically identifies if a request is for a single product, a business setup (projects), or a solution-based requirement.
-   **📝 Editable Business Context**: Users can fine-tune requirements by editing:
    -   **Industry** (e.g., Hospitality, Manufacturing)
    -   **Sourcing Location** (e.g., Pan India, Mumbai, Gujarat)
    -   **Budget Signal** (Low, Medium, High)
    -   **Scale** (Small Business vs Enterprise)
-   **🎨 Modern Monochromatic UI**: A clean, professional, white-and-black minimalist interface inspired by Linear and Vercel.
-   **⚡ Instant Estimates**: Provides immediate price estimations and quantity breakdowns.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
-   **Language**: JavaScript (React)
-   **Styling**: Pure CSS (Custom `globals.css` with CSS Variables), Flexbox/Grid layouts.
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: React `useState` / Hooks.
-   **Logic Engine**: Custom rule-based inference engine (Simulated AI) with scalable patterns for product/project breakdown.

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **npm** or **yarn** or **pnpm**

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/rishabhpatre/quote-generator.git
    cd quote-generator
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📂 Project Structure

```bash
/app
  /api
    /rfq          # Backend logic for Intent Classification & RFQ Generation
  globals.css     # Global styles & Theme variables
  layout.js       # Root layout
  page.js         # Landing Page (Search & Hero Section)
/components
  RFQLayout.js    # Main Results UI (Item Cards, Context Modal, Action Bar)
/public           # Static assets
```

## 💡 How It Works

1.  **User Input**: User enters a query (e.g., *"Start a clothing store"*).
2.  **Intent Classification**: The backend (`/api/rfq`) identifies if this is a:
    -   `SINGLE_PRODUCT`: Buying a specific item.
    -   `BUSINESS_IDEA`: Setting up a new venture.
    -   `PROBLEM_GOAL`: Looking for a solution to a problem.
3.  **Context Extraction**: It extracts location (e.g., "Mumbai"), quantity (e.g., "100 units"), and business type.
4.  **Generation**: The system generates a structured JSON response containing recommended items, specs, and price ranges.
5.  **Refinement**: User edits the "Business Requirements" (Context) or adjusts item quantities/specs in the UI.
6.  **Action**: User clicks "Float All RFQs" to initiate the sourcing process (Simulation).

## 🔮 Future Roadmap

-   [ ] **Real LLM Integration**: Connect to Gemini Pro / GPT-4 for dynamic generation outside of hardcoded categories.
-   [ ] **User Authentication**: Save RFQ history and drafts.
-   [ ] **Supplier Matching**: Real-time matching with actual supplier databases.
-   [ ] **PDF Export**: Download generated RFQ packages as PDF documents.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

**Built with ❤️ by [Rishabh Patre](https://github.com/rishabhpatre)**
