# 🚔 Police Station Grievance Portal

> A full-stack web application for online police complaint registration and management.
> Built with **React.js**, **Node.js**, **Express**, and **MongoDB**.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Login Credentials](#login-credentials)
- [Screenshots](#screenshots)

---

## 🎯 Project Overview

The Police Station Grievance Portal enables citizens to register complaints online, upload evidence, and track their complaint status in real time. Police officers and admins get a powerful dashboard to manage, prioritize, and resolve complaints efficiently.

**Key Innovation:** AI/Keyword-based priority detection automatically classifies every complaint as **High**, **Medium**, or **Low** priority based on crime category and description keywords.

---

## 🛠 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React.js, Tailwind CSS, Framer Motion |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB with Mongoose               |
| Auth       | JWT (JSON Web Tokens) + bcryptjs    |
| Charts     | Recharts                            |
| Icons      | Lucide React                        |
| File Upload| Multer                              |
| Toasts     | React Hot Toast                     |

---

## ✨ Features

### 👨‍💼 Citizen Side
- ✅ User registration and secure login
- ✅ Submit complaint with form validation
- ✅ Upload evidence (images, PDFs, videos — up to 5 files)
- ✅ Auto-generated unique Complaint ID (e.g., `GRV-2024-000001`)
- ✅ Category selection with preview of auto-assigned priority
- ✅ Track complaint by ID (public, no login needed)
- ✅ Dashboard with stats and all complaints
- ✅ Filter by status and priority
- ✅ View full complaint details with status timeline
- ✅ Responsive for mobile and desktop

### 🛡️ Police / Admin Side
- ✅ Secure login with role-based access
- ✅ Dashboard with analytics cards and charts
- ✅ View all complaints with advanced filters
- ✅ Filter by priority, status, category
- ✅ Update complaint status (Pending → In Progress → Resolved)
- ✅ Add official remarks
- ✅ Delete fake/spam complaints (admin only)
- ✅ View uploaded evidence
- ✅ User management with activate/deactivate (admin only)
- ✅ High-priority alert banner
- ✅ Analytics page with 5+ chart types

### 🤖 AI Priority Detection
```
High Priority:   murder, kidnapping, assault, terrorism, robbery, domestic violence
Medium Priority: harassment, fraud, cybercrime, theft, vandalism
Low Priority:    noise complaint, traffic issue, minor dispute
```
Keyword scanning also upgrades lower-category complaints if high-priority terms appear in text.

### 🎨 UI/UX
- ✅ Professional government-style design
- ✅ Dark / Light mode toggle
- ✅ Glassmorphism cards
- ✅ Smooth Framer Motion animations
- ✅ Fully responsive
- ✅ Toast notifications for all actions
- ✅ Pagination throughout
- ✅ Search and filter bars

---

## 📁 Project Structure

```
police-grievance-portal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register, login, profile
│   │   ├── complaintController.js # Submit, list, track complaints
│   │   ├── adminController.js     # Admin complaint management
│   │   └── statsController.js     # Analytics and charts data
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT protect + role authorization
│   │   └── uploadMiddleware.js    # Multer file upload config
│   ├── models/
│   │   ├── User.js                # User schema (citizen/police/admin)
│   │   └── Complaint.js           # Complaint schema with status history
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── adminRoutes.js
│   │   └── statsRoutes.js
│   ├── utils/
│   │   ├── priorityDetector.js    # AI/keyword-based priority logic
│   │   └── generateId.js          # Complaint ID generator
│   ├── uploads/                   # Uploaded evidence files (auto-created)
│   ├── seed.js                    # Database seeder with demo data
│   ├── server.js                  # Express server entry point
│   ├── .env.example               # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── index.jsx          # StatCard, PriorityBadge, etc.
    │   │   │   └── ProtectedRoute.jsx # Route guards
    │   │   └── layout/
    │   │       ├── Navbar.jsx
    │   │       ├── Footer.jsx
    │   │       └── AdminSidebar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx        # Global auth state
    │   │   └── ThemeContext.jsx       # Dark/light mode
    │   ├── pages/
    │   │   ├── public/
    │   │   │   ├── LandingPage.jsx    # Hero, services, testimonials
    │   │   │   ├── LoginPage.jsx
    │   │   │   ├── RegisterPage.jsx
    │   │   │   ├── TrackComplaint.jsx # Public complaint tracker
    │   │   │   └── StaticPages.jsx    # About, Services, FAQ, Contact
    │   │   ├── citizen/
    │   │   │   ├── CitizenDashboard.jsx
    │   │   │   ├── SubmitComplaint.jsx
    │   │   │   └── ComplaintDetail.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminComplaints.jsx
    │   │       ├── AdminComplaintDetail.jsx
    │   │       ├── AdminAnalytics.jsx
    │   │       └── AdminUsers.jsx
    │   ├── services/
    │   │   └── api.js               # Axios instance with interceptors
    │   ├── utils/
    │   │   └── helpers.js           # Date formatting, labels, etc.
    │   ├── App.jsx                  # Root component with all routes
    │   ├── main.jsx
    │   └── index.css                # Tailwind + custom CSS
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18+ — [Download](https://nodejs.org)
- **MongoDB** — [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git**
- **npm** (comes with Node.js)

---

### Step 1: Clone the repository

```bash
git clone <your-repo-url>
cd police-grievance-portal
```

---

### Step 2: Set up the Backend

```bash
cd backend
npm install
```

Create the `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/police_grievance_portal
JWT_SECRET=your_super_secret_key_change_this_now_2024
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@police.gov.in
ADMIN_PASSWORD=Admin@123456
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/police_grievance_portal`

---

### Step 3: Seed the Database (Create Demo Users)

```bash
# Still inside the backend folder
node seed.js
```

This creates:
- **Admin:** `admin@police.gov.in` / `Admin@123456`
- **Officer:** `officer@police.gov.in` / `Officer@123`
- **Citizen:** `citizen@example.com` / `Citizen@123`
- 3 sample complaints

---

### Step 4: Start the Backend Server

```bash
# Development (with auto-reload)
npm run dev

# OR Production
npm start
```

Backend runs at: **http://localhost:5000**

---

### Step 5: Set up the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
```

---

### Step 6: Start the Frontend

```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

### ✅ You're ready!

Open your browser and visit: **http://localhost:3000**

---

## 🔑 Login Credentials

| Role      | Email                       | Password      |
|-----------|-----------------------------|---------------|
| Admin     | admin@police.gov.in         | Admin@123456  |
| Officer   | officer@police.gov.in       | Officer@123   |
| Citizen   | citizen@example.com         | Citizen@123   |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint                      | Access  | Description              |
|--------|-------------------------------|---------|--------------------------|
| POST   | `/api/auth/register`          | Public  | Register citizen          |
| POST   | `/api/auth/login`             | Public  | Login all users           |
| GET    | `/api/auth/me`                | Private | Get current user profile  |
| PUT    | `/api/auth/profile`           | Private | Update profile            |
| POST   | `/api/auth/register-officer`  | Admin   | Create police/admin user  |

### Complaints
| Method | Endpoint                           | Access  | Description               |
|--------|------------------------------------|---------|---------------------------|
| POST   | `/api/complaints`                  | Citizen | Submit new complaint       |
| GET    | `/api/complaints/my`               | Citizen | Get own complaints         |
| GET    | `/api/complaints/:id`              | Private | Get complaint by ID        |
| GET    | `/api/complaints/track/:id`        | Public  | Track by complaint ID      |

### Admin
| Method | Endpoint                              | Access  | Description              |
|--------|---------------------------------------|---------|--------------------------|
| GET    | `/api/admin/complaints`               | Police  | Get all complaints        |
| PUT    | `/api/admin/complaints/:id/status`    | Police  | Update complaint status   |
| DELETE | `/api/admin/complaints/:id`           | Admin   | Delete complaint          |
| GET    | `/api/admin/users`                    | Admin   | Get all users             |
| PUT    | `/api/admin/users/:id/toggle`         | Admin   | Toggle user active status |

### Statistics
| Method | Endpoint                 | Access  | Description              |
|--------|--------------------------|---------|--------------------------|
| GET    | `/api/stats/dashboard`   | Police  | Admin dashboard stats    |
| GET    | `/api/stats/citizen`     | Citizen | Citizen personal stats   |

---

## 🛠 Troubleshooting

**MongoDB not connecting?**
- Make sure MongoDB is running: `mongod --dbpath /your/data/dir`
- Or use MongoDB Atlas and update `MONGO_URI`

**Port 5000 already in use?**
- Change `PORT=5001` in `.env` and update `vite.config.js` proxy target

**File uploads not working?**
- The `uploads/` folder is auto-created. Ensure `backend/` is writable.

**CORS error?**
- Frontend must run on port 3000 or 5173. Both are whitelisted in `server.js`.

---

## 👨‍💻 Developer Notes

- All passwords are hashed using **bcrypt** with salt rounds of 12
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRE`)
- Complaint IDs are sequential per year: `GRV-YYYY-XXXXXX`
- Priority detection runs server-side in `utils/priorityDetector.js`
- The frontend uses **Vite** proxy to avoid CORS during development
- All admin routes use both `protect` (auth) + `authorize` (role) middleware

---

## 📄 License

This project is built for **educational/college submission purposes**.

---

*Built with ❤️ using React, Node.js, and MongoDB*
