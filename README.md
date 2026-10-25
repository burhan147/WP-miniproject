# Peerly — College Event & Society Discovery Platform (MERN Stack)

Peerly is a modern full-stack web application designed for college campuses to discover student societies, view campus reels and announcements, browse interactive event schedules, submit anonymous club reviews, and manage a campus lost-and-found board.

---

## 🛠️ Architecture & Tech Stack (MERN)

* **M — MongoDB (MongoDB Atlas):** Cloud NoSQL database storing users, committees, events, feed posts, reviews, and notices using Mongoose schemas.
* **E — Express.js:** Fast, RESTful backend API handling authentication, role authorization, and rate limiting.
* **R — React 19:** Single Page Application (SPA) powered by Vite, Tailwind CSS v4, Framer Motion, and Lucide React icons.
* **N — Node.js:** JavaScript runtime powering the server and JWT authentication.

---

## 📁 Project Structure

```text
├── backend/
│   ├── .env                    # Local environment variables (ignored by git)
│   ├── .env.example            # Sample configuration template
│   ├── src/
│   │   ├── lib/
│   │   │   └── db.js           # Mongoose MongoDB Atlas connection
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification & role authorization
│   │   ├── models/             # Mongoose Models (User, Committee, Event, FeedPost, Review, LostFound)
│   │   ├── routes/             # Express API Endpoints
│   │   ├── seed.js             # Demo database seeder script
│   │   └── server.js           # Main Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios instance configuration
│   │   ├── assets/             # Images and SVG icons
│   │   ├── admin.jsx           # Committee & Admin portal component
│   │   ├── App.jsx             # Main Student portal component & tabs
│   │   └── main.jsx            # React root & React Router
│   ├── index.html
│   └── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Inside `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
```

### 3. Seed Initial Demo Data (Optional but Recommended)
Populate your database with sample societies, events, feed posts, and reviews:
```bash
npm run seed
```

### 4. Run the Application

Open two terminal windows:

* **Terminal 1 (Backend Server):**
  ```bash
  npm run dev:backend
  ```
  *API runs on `http://localhost:5000`*

* **Terminal 2 (Frontend Client):**
  ```bash
  npm run dev
  ```
  *App runs on `http://localhost:5173`*

---

## 👥 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Student** | `student@peerly.edu` | `student123` | Full access to feed, events calendar, reviews, profile |
| **Admin** | `admin@peerly.edu` | `admin123` | Publish events, onboarding societies, manage reels & analytics |
