# Technical Architecture & System Design
## Real-Time Property Rental, Maintenance & Amenity Management Platform

### 1. High-Level Architecture

The platform uses a decoupled client-server architecture with bidirectional real-time event distribution:

```mermaid
flowchart TD
    subgraph Frontend["React 18 + Tailwind CSS (Client)"]
        UI["Web Interface (Desktop & Mobile)"]
        AuthCtx["Auth Context (Role Switcher)"]
        SocketCtx["Socket Context (WebSockets)"]
        MaintMod["Maintenance Dashboard & Stepper"]
        AmenMod["Amenity Reservation & Check-In"]
        KPIMod["Real-Time KPI Gauges"]
        ReportMod["Admin Reports & CSV Exporter"]
        NativePush["HTML5 Push Notifications & Audio Chime"]
    end

    subgraph Backend["Node.js + Express.js (Server)"]
        Router["Express REST Router"]
        SocketServer["Socket.IO WebSocket Engine"]
        ConflictEngine["Collision Detection Engine"]
        KPIService["Analytics & SLA Calculator"]
        DataStore["MongoDB Atlas / Persistent Store"]
    end

    UI <--> Router
    UI <--> SocketServer
    Router --> ConflictEngine
    Router --> KPIService
    ConflictEngine --> DataStore
    Router --> DataStore
    SocketServer --> UI
```

---

### 2. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    PROPERTY ||--o{ USER : houses
    PROPERTY ||--o{ AMENITY : contains
    PROPERTY ||--o{ MAINTENANCE_REQUEST : logs
    USER ||--o{ MAINTENANCE_REQUEST : files
    USER ||--o{ AMENITY_BOOKING : reserves
    AMENITY ||--o{ AMENITY_BOOKING : schedules
    MAINTENANCE_REQUEST ||--o{ TICKET_COMMENT : contains

    PROPERTY {
        string id PK
        string name
        string address
        int totalUnits
        int occupiedUnits
        string managerId
    }

    USER {
        string id PK
        string name
        string email
        string role "tenant | owner | manager"
        string propertyId FK
        string unitNumber
        string phone
    }

    MAINTENANCE_REQUEST {
        string id PK "REQ-XXXX"
        string propertyId FK
        string unitNumber
        string tenantId FK
        string title
        string category "Plumbing | HVAC | Electrical | Appliance | Structural | General"
        string priority "Low | Medium | High | Emergency"
        string status "Pending | In Progress | Completed | Cancelled"
        string assignedTo
        datetime createdAt
        datetime updatedAt
        datetime resolvedAt
        string resolutionNotes
    }

    AMENITY {
        string id PK "AMEN-XXXX"
        string propertyId FK
        string name
        string category
        int capacity
        string openTime "HH:mm"
        string closeTime "HH:mm"
        int slotDuration
        list rules
    }

    AMENITY_BOOKING {
        string id PK "BOOK-XXXX"
        string amenityId FK
        string propertyId FK
        string tenantId FK
        string date "YYYY-MM-DD"
        string startTime "HH:mm"
        string endTime "HH:mm"
        int guestCount
        string status "Confirmed | Checked In | Checked Out | Cancelled"
        datetime checkInTime
        datetime checkOutTime
    }

    TICKET_COMMENT {
        string id PK
        string ticketId FK
        string senderId FK
        string senderName
        string senderRole
        string message
        datetime timestamp
    }
```

---

### 3. Real-Time Workflows

#### 3.1 Maintenance Dispatch & Real-Time Resolution SLA
```mermaid
sequenceDiagram
    autonumber
    actor Tenant as Resident (Sarah)
    participant Client as React Client
    participant Server as Express & Socket.IO
    actor Owner as Manager (Alex)

    Tenant->>Client: Fills ticket form (Balcony Light Sparks)
    Client->>Server: POST /api/maintenance
    Server->>Server: Generate REQ-1005, Status: Pending, Timestamp
    Server-->>Client: 201 Created (REQ-1005)
    Server-)Owner: Broadcast 'maintenance_created' via WebSocket
    Owner->>Client: Open ticket modal, Assigns Electrician
    Client->>Server: PATCH /api/maintenance/REQ-1005/status (In Progress)
    Server-)Tenant: Broadcast 'maintenance_updated' (Status: In Progress)
    Owner->>Client: Inputs resolution notes & marks Completed
    Client->>Server: PATCH /api/maintenance/REQ-1005/status (Completed)
    Server->>Server: Sets resolvedAt, Computes SLA turnaround hours
    Server-)Tenant: Broadcast 'maintenance_updated' (Status: Completed)
    Server-)Owner: Broadcast updated KPI metrics (SLA met)
```

#### 3.2 Amenity Conflict Prevention Engine
```mermaid
sequenceDiagram
    autonumber
    actor Tenant1 as Resident A
    participant Server as Conflict Engine
    actor Tenant2 as Resident B

    Tenant1->>Server: POST /api/amenities/bookings (Date: Nov 5, 15:00-17:00)
    Server->>Server: Check existing active bookings: None overlap
    Server-->>Tenant1: 201 Created (BOOK-2004 Confirmed)
    Server-)Tenant2: WebSocket Broadcast 'amenity_booked'

    Tenant2->>Server: POST /api/amenities/bookings (Date: Nov 5, 16:00-18:00)
    Server->>Server: Query bookings for Nov 5 -> Collision detected with BOOK-2004
    Server-->>Tenant2: 409 Conflict ("Already reserved by Resident A from 15:00 to 17:00")
```

---

### 4. Conflict Detection Algorithm

Given two reservations $R_1$ with interval $[S_1, E_1)$ and $R_2$ with interval $[S_2, E_2)$ on date $D$ for amenity $A$:

$$\text{Overlap}(R_1, R_2) \iff \max(S_1, S_2) < \min(E_1, E_2)$$

If any existing active booking satisfies this condition, the transaction is rejected with status code `409 Conflict`. This guarantees an invariant of **zero amenity scheduling conflicts**.

---

### 5. WebSocket Event Dictionary

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `maintenance_created` | Server ➔ All | `MaintenanceRequest` object | Notifies managers of incoming ticket |
| `maintenance_updated` | Server ➔ All | `MaintenanceRequest` object | Broadcasts status change (`In Progress`, `Completed`) |
| `maintenance_comment_added` | Server ➔ Room | `{ ticketId, comment }` | Thread discussion message |
| `amenity_booked` | Server ➔ All | `AmenityBooking` object | Live update to facility schedules |
| `amenity_status_changed` | Server ➔ All | `{ booking, action }` | Check-in / check-out / cancel alerts |
| `activity_logged` | Server ➔ All | `ActivityLog` object | Audit trail event |

---

### 6. Deliverables, API Contracts & Reporting Telemetry

#### 6.1 Deliverables Mapping

| Required Deliverable | Technical Component | Architectural Proof |
| :--- | :--- | :--- |
| **Fully functional web application** | React 18 SPA + Vite (`client/dist`) + Tailwind CSS | Component architecture in `client/src/components/`, stateful React Contexts (`AuthContext`, `SocketContext`), full responsive layout. |
| **Live deployed system with real-time tracking** | Production Live: [Vercel SPA](https://prop-flow-pi.vercel.app) + [Render Backend](https://propflow-w670.onrender.com) | Sub-second WebSocket broadcasts, HTML5 Native Desktop Push Notifications, and synthesized Web Audio chime alerts. |
| **Maintenance & amenity dashboards** | `MaintenanceDashboard.jsx`, `AmenityDashboard.jsx`, `AdminReportsDashboard.jsx` | Dynamic 3-stage status stepper, interval collision prevention algorithm (`HTTP 409`), 1-click arrival check-in / departure check-out, and 1-click CSV export engine. |
| **PRD & technical documentation** | `docs/PRD.md`, `docs/ARCHITECTURE.md`, `README.md` | Formal requirements document, architecture specification, entity relationship diagram (ERD), sequence flows, and quickstart documentation. |

#### 6.2 Key Analytics & Reporting Endpoints

| Method | Endpoint | Description | Output |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/kpis` | Real-time SLA benchmarks, resolution times, completion rates | JSON telemetry payload |
| `GET` | `/api/analytics/technicians` | Technician turnaround scorecard and SLA compliance | JSON array of staff performance tiers |
| `GET` | `/api/analytics/export/maintenance.csv` | Full maintenance SLA audit export | Downloadable CSV file (`propflow-maintenance-sla-report.csv`) |
| `GET` | `/api/analytics/export/amenities.csv` | Full facility utilization & check-in log | Downloadable CSV file (`propflow-amenity-utilization-report.csv`) |
| `GET` | `/api/analytics/activity` | Immutable event audit trail | JSON array of recent system events |


