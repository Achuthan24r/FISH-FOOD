# CHANNA PELLET
### Complete Nutrition for Carnivorous Fish & Monster Fishes
*Built by **Team Connected Minds** for **Euphoria Hackathon: Agri Venture - The Agribusiness Challenge***

---

## 🌟 Executive Overview
**CHANNA PELLET** is a modern agritech Progressive Web Application (PWA) designed for aquaculture farmers and carnivorous fish cultivators across Tamil Nadu. 

Formulated with **20% Fish Meal**, **20% Squid Meal**, **10% Jawla Meal**, de-oiled groundnut powder, soya meal, rice/corn flour binders, digestive multi-enzymes, essential amino acids, and chelated micronutrients, AquaVigor accelerates aquaculture growth, boosts survival rate beyond 92%, enhances natural astaxanthin skin/shell pigmentation, and shortens the standard **60-day culture duration to 45 days** (saving 15 days of operating aeration power, labor, and feed costs).

---

## 👥 Demo Personas & Credentials (1-Click Switcher Available in UI)

| Role | Name | Phone / Login | District / Access |
|---|---|---|---|
| **Farmer** | Murugan Ramanathan (முருகன் ராமநாதன்) | `+91 98401 23456` (OTP: `4521`) | Nagapattinam • 4 Ponds (Vannamei Shrimp) • Active Day 32 Batch |
| **Company Admin** | Dr. S. Anbarasan (Connected Minds Admin) | `admin@aquavigor.agri` / `9444099999` | Chennai HQ • Full Analytics, 15 Farmers, 30 Batches, 50 Reviews, CSV Export |

*Tip: A persistent **"Switch Demo Persona"** button is located in the top header to seamlessly evaluate both Farmer and Admin experiences with one tap.*

---

## 🚀 Key Features

### 1. 📱 Mobile-First PWA with Offline Synchronization
- Full offline support with LocalStorage queuing and Service Worker (`/sw.js`).
- Farmers in remote pond dikes without 4G/5G can log growth data and submit reviews; records automatically sync when network is restored.
- Test offline mode instantly with the **"Simulate Offline"** button in the header.

### 2. 🗣️ Voice-Enabled Feedback & Multi-Dimensional Rating System (Key Feature)
- **Overall Star Satisfaction**: Interactive 1 to 5 star rating.
- **5 Category Performance Sliders**: Growth Rate, Colouration, Survival Rate, Disease Immunity, and Cost Value.
- **Web Speech API Voice-to-Text**: Low-literacy friendly microphone input supporting both **Tamil (`ta-IN`)** and **English (`en-IN`)**.
- **Impact Verification**: "Did the culture period reduce towards 45 days?" and "Would you recommend to fellow farmers?"
- **Automatic Sentiment Classification**: AI categorizes feedback into *Positive*, *Neutral*, or *Needs Attention*.
- **Milestone Triggers**: Automated in-app prompt & simulated Push/SMS notification at **Day 30** and at **Harvest**.
- **Company Agronomist Response Threads**: Farmers can view company replies and resolution status badges (`Pending Review`, `Reviewed`, `Resolved`).

### 3. 🧪 Feed Science & Functional Formulation Hub
- Transparent ingredient matrix detailing percentages and physiological roles:
  - *20% Fish Meal*: Highly digestible animal marine protein and amino acids.
  - *20% Squid Meal*: Chemo-attractant, natural sterols, and cellular growth catalyst.
  - *10% Jawla Meal*: Natural astaxanthin pigment and prebiotic chitin for shell hardening.
  - *De-oiled Groundnut Cake & Soya Meal*: Clean vegetable protein matrix.
  - *Rice & Extruded Corn Flour*: Gelatinized binders guaranteeing >3.5 hours water stability.
  - *Digestive Enzymes (Protease, Amylase, Lipase)*: Maximizes nutrient assimilation, lowering pond sludge.
  - *Essential Amino Acids & Chelated Micronutrients*: Fortifies hepatopancreas and immune barrier.
- Stage-by-stage feeding schedule (Starter, Grower, Finisher) with body weight ranges, pellet sizes, and feeding frequencies.

### 4. 🧮 Precision Feed & Cost Calculator
- Multi-species support: Vannamei Shrimp, Black Tiger Shrimp, GIFT Tilapia, Catfish, Asian Seabass.
- Dynamic inputs: Stock population, Average Body Weight (g), and Water Temperature (°C).
- Temperature coefficient adjusts feeding rates (e.g. 28-30°C peak vs cold/heat stress).
- Outputs: Daily feed in kg, bag count (25kg), feeding frequency per day, daily cost, and **45-Day Cycle Total Farm Savings**.
- One-click **"Save to Active Batch"** functionality.

### 5. 📈 Batch & Growth Analytics (Recharts)
- Create new batches comparing **AquaVigor (45-day target)** vs **Commercial Feed (60-day baseline)**.
- Weekly logging form: ABW (g), Mortality count, Feed used (kg), Colour score (1-5), Water Temp & Dissolved Oxygen (ppm), with client-side canvas photo compression.
- Interactive charts:
  - Growth Curve (Actual ABW vs 45d Target vs 60d Baseline).
  - Weekly Mortality Trend (Bar Chart).
  - Cumulative Feed Intake Progression (Area Chart).
  - Pigmentation & Colour Index (Step Line Chart).
- Anomaly alerts for mortality spikes and growth delays.

### 6. 👔 Executive Admin Command Center
- **Executive KPIs**: Total Farmers (15), Active Batches (17), Average Customer Rating (4.7 / 5.0), Average Culture Duration (44.2 days), Average Survival Rate (93.8%).
- **Visual Analytics**: Star rating distribution, Category radar/bars, Field trial growth comparison curves, District adoption map.
- **Farmer Sentiment Engine**: Categorization into Positive (76%), Neutral (20%), and Needs Attention (4%) with recurring thematic tags.
- **Filterable Data Management**: Tabbed tables for Feedback, Farmers, Batches, and Orders with instant search, species/sentiment filters, and **One-Click CSV Export**.
- **Interactive Agronomist Reply Modal**: Send replies directly to farmers and toggle resolution status.

---

## 🎬 5-Step Hackathon Demo Flow for Judges

1. **Step 1 — Farmer Onboarding & Day 30 Prompt:**
   - Open the app (logged in as Farmer **Murugan Ramanathan** in Tamil Nadu).
   - Observe the **Day 30 Feed Performance Milestone Banner** for Pond 2 (DOC 33).
   - Click **"Test Push/SMS"** to preview the automated notification sent to the farmer's mobile.

2. **Step 2 — Feed & Cost Calculator:**
   - Navigate to the **Calculator** tab.
   - Adjust the **Average Body Weight** slider (e.g., 22.4g) and observe the real-time daily feed calculation (26.88 kg/day).
   - Review the **45-Day Culture Advantage Card** showing 15 days of aeration electricity and labor saved.
   - Click **"Save to Active Batch"** to update the pond record.

3. **Step 3 — Batch Growth Tracker:**
   - Navigate to the **Batches** tab.
   - Review the **Growth Curve Chart** displaying AquaVigor's accelerated 45-day trajectory outperforming the 60-day baseline.
   - Inspect the **Weekly Mortality Trend** and **Colour Score Index (4.8/5.0)**.

4. **Step 4 — Voice-Enabled Farmer Review:**
   - Navigate to the **Feedback** tab.
   - Tap the 5-star rating and adjust the category sliders (Growth, Colour, Survival, Immunity, Value).
   - Click **"Tap to Speak (Voice-to-Text)"** and speak (or type a review in English/Tamil).
   - Toggle "Did the culture period reduce towards 45 days?" to **Yes**.
   - Submit review and watch the celebratory confetti! Switch to **"My Past Reviews"** to inspect past feedback and company agronomist replies.

5. **Step 5 — Company Admin Command Center:**
   - Tap **"Switch Demo Persona"** in the top header and select **"Dr. S. Anbarasan (Admin Role)"**.
   - Review executive KPIs across 15 farmers and 30 batches.
   - Inspect the **AI Sentiment Analysis** breakdown (Positive 76%, Neutral 20%, Needs Attention 4%).
   - Open the Feedback table, click **"Reply to Farmer"**, type a response, and mark it **Resolved**.
   - Click **"Export CSV"** to generate a comprehensive report.

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18 + TypeScript + Vite 8
- **Styling & Design System**: Tailwind CSS (Tailwind v3 with customized `#14342A`, `#2E7D4F`, `#F2A900`, `#F4F7F2` palette)
- **Data Visualizations**: Recharts (Responsive Line, Bar, and Area Charts)
- **Icons**: Lucide React
- **PWA & Offline**: Web App Manifest (`manifest.webmanifest`), Service Worker (`sw.js`), LocalStorage cache & sync queue
- **Voice Recognition**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) supporting English (`en-IN`) and Tamil (`ta-IN`)
- **Image Compression**: HTML5 Canvas Client-Side Dynamic Compression
- **Celebration Effects**: Canvas Confetti

---

## 📦 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd "fish food"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build production bundle**:
   ```bash
   npm run build
   npm run preview
   ```

---

## 🗄️ Database Architecture
A complete SQL schema with Row-Level Security (RLS) policies is included in [database_schema.sql](file:///c:/Users/Subam/fish%20food/database_schema.sql):
- `users`: Farmers and admin users with role-based policies.
- `ponds`: Individual pond records, surface areas, and water types.
- `batches`: 45-day target culture cycles and baseline feeds.
- `growth_logs`: Weekly ABW, mortality, feed intake, colour index, and water parameters.
- `feedback`: Multi-dimensional 5-star ratings, voice transcripts, and auto-sentiment tags.
- `feedback_replies`: Two-way agronomist reply threads.
- `products`: Formulated feed specifications and feeding guides.
- `orders`: Direct farm orders with 4-stage logistics tracking.

---
*Developed with pride for the Euphoria Hackathon by **Team Connected Minds**.*
