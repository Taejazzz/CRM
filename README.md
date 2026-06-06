# LeadFlow CRM 🚀

LeadFlow CRM is a production-ready, full-stack lead management customer relationship manager built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) styled with Tailwind CSS v4.

The application features 5 distinct views (Dashboard, Pipeline Board, Card Grid, Compact List, and Activity logs) and implements real-time data sync using Socket.IO with optimistic UI updates for an instantaneous user experience.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons, Axios, Recharts
- **Backend**: Node.js, Express.js, Socket.IO
- **Database**: MongoDB Atlas, Mongoose ODM
- **Real-time Synchronization**: WebSockets (Socket.IO client/server)

---

## 📂 Project Directory Structure

```
CRM/
├── backend/                  # Node + Express server
│   ├── config/               # Database connection setup
│   ├── controllers/          # Business logic (CRUD, Aggregations)
│   ├── middleware/           # Global error handler
│   ├── models/               # MongoDB models (Lead, Activity)
│   ├── routes/               # API route maps
│   ├── .env.example          # Sample environment configurations
│   ├── server.js             # Entry point
│   └── package.json          # Server dependencies
│
├── frontend/                 # React + Vite client
│   ├── src/
│   │   ├── components/       # Layout, Dashboard, Kanban, Card, Table, Logs, Modal, Loader
│   │   ├── context/          # React State Context & Socket integration
│   │   ├── utils/            # Axios API config
│   │   ├── App.jsx           # App wrapper
│   │   ├── main.jsx          # Mount wrapper
│   │   └── index.css         # Tailwind v4 directives and variables
│   ├── .env.example          # Sample client environment configurations
│   ├── vite.config.js        # Vite build configuration
│   └── package.json          # Client dependencies
│
└── README.md                 # Main Documentation
```

---

## ⚙️ Running Locally

### Prerequisites
- Node.js installed locally
- MongoDB Atlas cluster URL or local MongoDB instance

### Step 1: Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ld32ugx.mongodb.net/leadflow?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
   *The API will start running on `http://localhost:5000`*

### Step 2: Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The web client will start running on `http://localhost:5173`*

---

## 📡 REST API Documentation

All API responses return JSON data. The base URL is `${BACKEND_URL}/api`.

### 1. Leads Endpoint

#### `GET /api/leads`
Retrieve leads. Supports search, pagination, status/source filters, and sorting.
- **Query Parameters**:
  - `search`: Matches Name, Email, or Company (string)
  - `status`: Filter by `New`, `Contacted`, `Qualified`, `Converted`, `Lost`
  - `source`: Filter by `Website`, `LinkedIn`, `Referral`, `Cold Outreach`, `Partner`, `Other`
  - `sort`: Field to sort (`createdAt`, `name`, `company`, `status`), defaults to `createdAt`
  - `order`: `asc` or `desc`, defaults to `desc`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "leads": [...],
    "pagination": {
      "totalLeads": 15,
      "totalPages": 2,
      "currentPage": 1,
      "limit": 10
    }
  }
  ```

#### `GET /api/leads/stats`
Retrieves aggregated statistics for dashboard visualization.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "stats": {
      "totalLeads": 25,
      "activeLeads": 12,
      "convertedLeads": 8,
      "lostLeads": 5,
      "conversionRate": 32,
      "monthlyGrowthPercentage": 15,
      "pipelineHealth": 68,
      "funnel": [
        { "name": "New", "count": 5 },
        { "name": "Contacted", "count": 4 },
        { "name": "Qualified", "count": 3 },
        { "name": "Converted", "count": 8 }
      ],
      "sourceAnalytics": [
        { "source": "Website", "count": 12 },
        { "source": "LinkedIn", "count": 8 }
      ]
    }
  }
  ```

#### `GET /api/leads/:id`
Fetch details for a single lead by ID.

#### `POST /api/leads`
Create a new lead.
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@mercer.com",
    "phone": "+1 555-0245",
    "company": "Mercer Consulting",
    "status": "New",
    "source": "LinkedIn",
    "notes": "Met at TechEx conference"
  }
  ```
- **Response (201 Created)**: Returns the created lead object and the activity feed log.

#### `PUT /api/leads/:id`
Updates an existing lead.
- **Request Body**: Same schema as POST (all fields optional).
- **Response (200 OK)**: Returns the updated lead object and logs a status change activity if changed.

#### `DELETE /api/leads/:id`
Remove a lead from the CRM database.
- **Response (200 OK)**: Confirms deletion and registers the action in activities.

### 2. Activities Endpoint

#### `GET /api/activities`
Retrieves the last 50 activity logs sorted by timestamp descending.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "activities": [
      {
        "_id": "act_101",
        "action": "Status Change",
        "leadName": "Alex Mercer",
        "details": "Changed status of Alex Mercer from \"New\" to \"Contacted\".",
        "timestamp": "2026-06-06T15:23:10.000Z"
      }
    ]
  }
  ```

---

## ⚡ Real-Time Events (Socket.IO)

The backend emits live websocket broadcasts to all active sockets on modifications:

1. **`lead:created`**: Emitted when a lead is created. Passes `{ lead, activity }`.
2. **`lead:updated`**: Emitted when a lead is modified. Passes `{ lead, activity }`.
3. **`lead:deleted`**: Emitted when a lead is removed. Passes `{ leadId, activity }`.

---

## 🚀 Production Deployment Instructions

### Backend: Render.com
1. Create a new **Web Service** on Render.
2. Link your GitHub repository.
3. Configure the following service parameters:
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   - `MONGODB_URI`: *Your MongoDB Atlas connection URI*
   - `PORT`: `10000`
   - `NODE_ENV`: `production`

### Frontend: Vercel
1. Create a new project on Vercel.
2. Link your repository.
3. In the project config, specify:
   - **Framework Preset**: `Other` or `Vite` (Vercel automatically detects Vite)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under Environment Variables, add:
   - `VITE_BACKEND_URL`: *Your Render backend Web Service URL (e.g. `https://leadflow-api.onrender.com`)*
5. Click **Deploy**.
