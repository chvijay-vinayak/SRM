# CorpDesk - Full-Stack Corporate Help Desk System

A modern, responsive, full-stack corporate help desk ticketing system built with the MERN stack and TypeScript (MongoDB, Express, React, Node.js).

## Features
- **Authentication**: Secure JWT-based login and registration. Role-based access control (Employee, Agent, Admin).
- **Ticket Management**: Create, view, update, and close tickets with priority and status tracking.
- **Comments**: Add updates and communicate within a ticket.
- **Admin Tools**: Re-assign tickets to agents and change status/priority.
- **Premium Corporate UI**: Modern, clean design using Vanilla CSS tokens, fully responsive layout, and intuitive sidebar navigation.

## Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local instance running on `mongodb://127.0.0.1:27017` or change the `MONGO_URI` in `backend/.env`)

## Folder Structure
```text
/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # API route logic
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # Mongoose DB schemas (User, Ticket, Comment)
│   ├── routes/          # Express API routes
│   ├── .env             # Environment variables
│   ├── seed.js          # DB seed script
│   └── server.js        # Main entry point
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance and interceptor
    │   ├── components/  # Reusable UI parts (Sidebar, TicketCard)
    │   ├── context/     # React Context for global auth state
    │   ├── pages/       # Login, Dashboard, TicketDetail, CreateTicket
    │   ├── App.jsx      # Router configuration
    │   └── index.css    # Global CSS and modern tokens
    └── package.json
```

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. *(Optional)* Seed the database with sample users and tickets:
   ```bash
   node seed.js
   ```
   > **Note:** Seed credentials are `admin@corp.com`, `agent@corp.com`, and `john@corp.com` (Password for all is `password123`).

4. Start the backend server (runs on `http://localhost:5000`):
   ```bash
   npm run start
   # or with nodemon
   npx nodemon server.js
   ```

### 2. Frontend Setup
1. Open a *new* terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the provided local URL (usually `http://localhost:5173`) in your browser.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, React Router, Axios, Lucide React (Icons), Vanilla CSS
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT, bcryptjs
- **Database**: MongoDB
# SRM
# srm-1
# srm-1
