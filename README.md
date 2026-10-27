# Aura Sky (aura_sky)

A modern, responsive, real-time weather forecast and atmospheric intelligence dashboard built with React 19, TypeScript, Vite, and Tailwind CSS.

---

## 1. Project Name
**Aura Sky** (`aura_sky`)

---

## 2. Project Description
**Aura Sky** is a comprehensive, elegant weather dashboard designed to provide users with accurate meteorological insights in real time. Featuring a clean Material-inspired sky-blue visual aesthetic, the application offers:

- **Current Weather Conditions**: Instant overview of temperature, weather code, apparent ("feels like") temperature, humidity, wind speed, wind direction, UV index, dew point, cloud cover, visibility, and atmospheric pressure.
- **Hourly & Temperature Trends**: Interactive visual graphs showing 24-hour temperature and atmospheric changes.
- **Precipitation Records & Probability**: Detailed analysis of rain/snow accumulation, probability percentages, and historical records.
- **7-Day Extended Forecast**: Daily high/low temperature forecasts, weather status icons, and condition summaries.
- **Interactive Weather & Radar Map**: Embedded interactive map powered by Windy showing surface wind patterns, ECMWF weather data, radar, and temperature overlays.
- **Geolocation & Global Search**: Automatic location detection using the browser Geolocation API with reverse geocoding, plus forward-geocoding search autocomplete for cities worldwide.
- **Secure Backend API Proxy & In-Memory Caching**: Seamless client request caching to minimize API consumption, along with a Vite server proxy middleware to keep private API keys secure from the client browser.

---

## What Kind of Real Problems Are Solved by This Project?

1. **Eliminating Cluttered, Ad-Heavy Weather Tools**:
   - Most commercial weather sites and apps are congested with clickbait, trackers, and intrusive ads that slow down performance. Aura Sky provides a lightweight, clean, fast, and distraction-free dashboard focused purely on essential atmospheric intelligence.

2. **Actionable Decision-Making for Outdoor Activities & Travel**:
   - Simple daily forecasts (e.g. "Sunny, 24°C") often fail to capture sudden rain showers, extreme UV spikes, or dramatic evening temperature drops. Aura Sky solves this by visualizing continuous 24-hour temperature curves, hourly precipitation probabilities, and UV severity levels, enabling users to plan commutes, flights, outdoor exercise, and events with precision.

3. **Zero-Friction Localized Weather Retrieval**:
   - Users frequently have to manually search for zip codes or city names. Aura Sky uses browser GPS geolocation paired with automatic reverse-geocoding to immediately detect and display weather for the user's exact current location upon opening the app, while providing graceful fallbacks.

4. **Visualizing Complex Weather Systems in Real Time**:
   - Plain tabular numbers cannot easily convey approaching storm fronts or wind shifts. The integration of an interactive live radar and ECMWF wind layer map allows users to visually track atmospheric movements and prepare for changing conditions before they arrive.

5. **Mitigating API Quota Depletion & Inefficient Network Requests**:
   - Frequent weather polling quickly exhausts API rate limits and incurs costs. Aura Sky addresses this technically using coordinate rounding (preventing micro GPS jitter from triggering repeated fetches), a client-side TTL memory cache, and an upstream backend proxy that safeguards developer credentials while minimizing redundant network traffic.

---

## 3. Technology, Packages, and Libraries Used

### **Core Framework & Build Tools**
- **[React 19](https://react.dev/)** (`^19.3.1`): Modern component architecture using hooks and React Context API.
- **[TypeScript 6](https://www.typescriptlang.org/)** (`~6.0.0`): Type-safe JavaScript development with strict module syntax.
- **[Vite 8](https://vite.dev/)** (`^8.3.4`): Next-generation frontend build tool and local development server.
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** (`^6.1.2`): Fast Refresh and JSX transformation for React in Vite.

### **Styling & Design System**
- **[Tailwind CSS v4](https://tailwindcss.com/)** (`^4.3.3` with `@tailwindcss/vite`): Utility-first CSS engine configured with custom design tokens for typography, elevation, and Material color schemes.
- **Google Fonts**: Inter & Plus Jakarta Sans typography.
- **Google Material Symbols Outlined**: Modern iconography for weather conditions and UI elements.

### **Data Visualization & Mapping**
- **[Recharts](https://recharts.org/)** (`^3.10.1`): Composable charting library used for temperature trends and precipitation history charts.
- **Hand-authored SVG & Windy Embed API**: High-performance inline vector graphics and live embedded weather radar.

### **Geolocation & Utilities**
- **[react-geolocated](https://github.com/no23reason/react-geolocated)** (`^4.5.1`): React hook integration with the HTML5 Geolocation API.
- **Custom In-Memory TTL Cache (`requestCache.ts`)**: Prevents redundant network requests by caching API responses.

### **Code Quality & Linting**
- **[ESLint 10](https://eslint.org/)** (`^10.13.0`): Code analysis and best practices enforcement.
- **`typescript-eslint`** (`^8.71.2`), **`eslint-plugin-react-hooks`** (`^7.1.1`), and **`eslint-plugin-react-refresh`** (`^0.5.7`).

---

## 4. Where We Get the APIs

This project integrates three dedicated API services to retrieve weather and location data:

1. **[Tomorrow.io Weather API](https://www.tomorrow.io/)**
   - **Purpose**: Powers real-time conditions, 24-hour hourly history, and 7-day weather forecasts (`temperature`, `humidity`, `precipitationProbability`, `windSpeed`, `uvIndex`, etc.).
   - **Where to obtain**: Sign up at [Tomorrow.io](https://www.tomorrow.io/) and generate an API key from the developer dashboard.
   - **Environment Variable**: `WEATHER_API`

2. **[BigDataCloud Reverse Geocoding API](https://www.bigdatacloud.com/)**
   - **Purpose**: Reverse geocodes the user's GPS latitude and longitude coordinates into human-readable city, region, and country names.
   - **Where to obtain**: Create a free account at [BigDataCloud](https://www.bigdatacloud.com/) and obtain a Reverse Geocoding API key.
   - **Environment Variable**: `GEO_API_KEY`

3. **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)**
   - **Purpose**: Provides forward-geocoding autocomplete when users search for city and region names worldwide.
   - **Where to obtain**: Open-source, free, and keyless (no API key required).

4. **[Windy Embed Map Service](https://www.windy.com/)**
   - **Purpose**: Provides interactive wind, radar, rain, and temperature overlay maps embedded via iframe.

> **Note on Security:** Private keys (`WEATHER_API` and `GEO_API_KEY`) are kept server-side in the `.env` file locally and forwarded via serverless handlers (`server/apiHandler.ts` and `api/*`). When deploying to **Vercel**, add `WEATHER_API` and `GEO_API_KEY` under **Project Settings &rarr; Environment Variables**. They are never exposed directly to client-side browser bundles.

---

## 5. How to Setup This Project Locally

Follow these steps to run the application on your local machine:

### **1. Prerequisites**
Ensure you have the following installed on your computer:
- **Node.js**: Version `^20.19 || >=22.12`
- **npm**: Comes bundled with Node.js

### **2. Clone or Navigate to the Repository**
```bash
cd "e:\web project\Project\aura_sky"
```

### **3. Install Dependencies**
Install all required npm packages:
```bash
npm install
```

### **4. Configure Environment Variables**
Create a `.env` file in the root directory (if not already present):
```env
# Server-only API keys (proxied through server/apiProxy.ts)
WEATHER_API=your_tomorrow_io_api_key_here
GEO_API_KEY=your_bigdatacloud_api_key_here
```

### **5. Run the Local Development Server**
Start the Vite development server:
```bash
npm run dev
```
Once started, open your web browser and navigate to:
```
http://localhost:5173
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Typechecks using TypeScript and builds production-ready static assets to `dist/`. |
| `npm run preview` | Runs a local server to preview the production build output. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |
| `npx tsc -b` | Runs the TypeScript compiler check across project references without building. |

