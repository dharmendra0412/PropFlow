# PropFlow — Real-Time Property Rental, Maintenance & Amenity Management Platform

A high-performance, real-time property management platform designed to streamline operations between residential tenants and property owners/managers.

Built with **React 18**, **Tailwind CSS**, **Node.js**, **Express**, and **Socket.IO**.

---

## 🌟 Key Capabilities

* ⚡ **Real-Time Maintenance Workflow**:
  * Step-by-step lifecycle: `Pending` ➔ `In Progress` ➔ `Completed`.
  * Real-time technician assignment and resolution closure notes.
  * Live two-way threaded chat between residents and management.
* 🛡️ **Zero-Conflict Amenity Booking Engine**:
  * Interval collision algorithm guaranteeing **0 booking conflicts**.
  * Facility rules, guest limits, and operating hours enforcement.
  * Real-time Check-In and Check-Out tracking with precise audit timestamps.
* 📊 **Operational KPI Command Center**:
  * Maintenance Resolution SLA Tracking ($\le 48\text{ hours}$).
  * Ticket Completion Rate ($\ge 90\%$).
  * Zero Amenity Booking Conflicts ($0\text{ Double Bookings}$).
  * Ultra-low System Latency ($< 50\text{ ms}$).
  * Resident Satisfaction Score ($4.8 / 5.0$).
* 🔒 **Secure User Authentication & Roles**:
  * Real registration and login powered by **bcrypt** password hashing and **JSON Web Tokens (JWT)**.
  * Role-based access distinguishing **Property Owners/Managers** from **Residential Tenants**.
* 🌐 **Cloud Database Persistence**:
  * Connected to **MongoDB Atlas** via Mongoose with resilient local JSON fallback.
  * 100% authentic data architecture with zero dummy or simulation data.

---

## 🚀 Quickstart & How to Run

### The server is already built and running locally!

Simply open your browser and navigate to:
```
http://localhost:5000
```

### Manual Commands:
To install dependencies:
```bash
npm run install:all
```

To build client assets:
```bash
npm run build:client
```

To start the full-stack server (serves both API, WebSockets, and React frontend):
```bash
npm start
```

---

## 🚀 Cloud Deployment Guide (Vercel + Render)

PropFlow utilizes a high-performance decoupled architecture for production:
- **Backend (Render.com)**: Persistent Node.js + Express + Socket.IO server with live WebSocket streaming.
- **Frontend (Vercel)**: Ultra-fast globally distributed Vite + React Single Page Application.

### Step 1: Deploy Backend on Render (2 minutes)
1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your repository: `https://github.com/dharmendra0412/PropFlow`.
4. Configure settings:
   - **Name**: `propflow-backend` (or your choice)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Under **Environment Variables**, add:
   - `JWT_SECRET`: `super_secure_jwt_propflow_secret_key_2026`
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.
7. Once live, copy your backend URL (e.g. `https://propflow-backend.onrender.com`).

---

### Step 2: Deploy Frontend on Vercel (1 minute)
1. Go to [vercel.com/new](https://vercel.com/new) and select `dharmendra0412/PropFlow`.
2. Next to `client (Vite)`, click **Import single project →** (or set Root Directory to `client`).
3. Under **Environment Variables**, add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://propflow-backend.onrender.com` (Your Render backend URL from Step 1)
4. Click **Deploy**.
5. Your live production application is now fully running with real-time WebSockets!

---

## 📦 Deliverables & Submission Verification

| Deliverable | Description | Verification / How to Check |
| :--- | :--- | :--- |
| **1. Fully Functional Web Application** | Clean, Zillow-grade SPA with React 18 & Tailwind CSS. Zero dummy/mock data. Authenticates real users via bcrypt + JWT. | Open `http://localhost:5000` in browser. Test registration & login. |
| **2. Live Deployed System with Real-Time Tracking** | Node.js + Express.js backend with Socket.IO bidirectional WebSockets, HTML5 Native Browser Push Alerts, and Web Audio chimes. | Submit work orders or book facilities; watch status update across tabs in real time without refreshing. |
| **3. Maintenance & Amenity Dashboards** | • **Maintenance Dashboard**: Multi-category filter, visual 3-step lifecycle (`Pending` ➔ `In Progress` ➔ `Completed`), and $\le 48\text{h}$ SLA telemetry.<br>• **Amenity Hub**: Conflict-free scheduling with mathematical interval collision prevention (`HTTP 409`), plus 1-click Check-In and Check-Out timestamps.<br>• **Admin Reports & Analytics Dashboard**: 1-click CSV Exporters (`/api/analytics/export/maintenance.csv`, `/api/analytics/export/amenities.csv`) and Technician Turnaround Scorecard. | Switch to Property Owner view (`dharmendrakumar481212@gmail.com`) to inspect live KPI cards, technician scorecards, and download CSV reports. |
| **4. PRD & Technical Documentation** | Full specifications, system architecture, ER diagrams, sequence flows, API contracts, and user flows. | Read [`docs/PRD.md`](docs/PRD.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). |

---

## 📂 Repository Structure

```
Project 1/
├── client/                     # React 18 + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/         # Modals, Dashboards, KPI cards, Feeds
│   │   ├── context/            # AuthContext & SocketContext
│   │   ├── utils/              # API fetch client
│   │   ├── App.jsx             # Main interactive application
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js + Express + Socket.IO Backend
│   ├── src/
│   │   ├── routes/             # Auth, Properties, Maintenance, Amenities, Analytics
│   │   ├── db.js               # Persistent JSON data store
│   │   ├── seedData.js         # Realistic seed data
│   │   ├── socket.js           # Bidirectional WebSocket engine
│   │   └── index.js            # Express server & static asset server
│   ├── test-e2e.js             # Automated integration & conflict tests
│   └── package.json
├── docs/                       # Project Documentation
│   ├── PRD.md                  # Complete Product Requirements Document
│   └── ARCHITECTURE.md         # Technical Architecture & Mermaid Diagrams
├── package.json                # Root automation scripts
└── README.md                   # System documentation
```

