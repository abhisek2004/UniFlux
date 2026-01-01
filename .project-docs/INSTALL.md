# 📦 INSTALL.md – Setup Guide for UniFlux

Welcome to **UniFlux – AI-Powered Smart University Management & Timetable Optimization Platform** 🎓🚀  
This guide explains how to **clone**, **configure**, and **run UniFlux locally** with a **modern frontend + backend architecture**, built under  
🏆 **Elite Coders Winter of Code (ECWOC 2026)**.

Please follow the steps carefully to avoid configuration issues.

---

## ✅ Prerequisites

Ensure the following tools are installed on your system:

| Tool          | Recommended Version | Download                            |
| ------------- | ------------------- | ----------------------------------- |
| Node.js       | ≥ 18.x              | https://nodejs.org                  |
| Git           | ≥ 2.x               | https://git-scm.com                 |
| VS Code       | Latest              | https://code.visualstudio.com       |
| MongoDB Atlas | Cloud DB            | https://www.mongodb.com/cloud/atlas |

---

## 🔁 Clone the Repository

```bash
git clone https://github.com/<your-org-or-username>/UniFlux.git
cd UniFlux
```

````

---

## 📁 Project Structure Overview

UniFlux follows a **clear frontend–backend separation** for scalability and open-source contribution.

```
UniFlux/
│
├── .github/                 → GitHub workflows & templates
│
├── frontend/                → Frontend application (TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/      → Reusable UI components
│   │   ├── layouts/         → Navbar, Sidebar, Page layouts
│   │   ├── pages/           → Role-based pages (Admin, Faculty, Dept)
│   │   ├── routes/          → Protected & public routes
│   │   ├── services/        → API service handlers
│   │   ├── utils/           → Helpers & validators
│   │   ├── App.tsx          → Root app component
│   │   └── main.tsx         → App bootstrap
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                 → Backend services & APIs
│   ├── src/
│   │   ├── controllers/     → Request handlers
│   │   ├── routes/          → API routes
│   │   ├── models/          → Database schemas
│   │   ├── services/        → Business logic
│   │   ├── middleware/      → Auth, validation, error handling
│   │   └── server.ts        → Backend entry point
│   ├── package.json
│   └── .env.example
│
├── docs/                    → Documentation (ROADMAP, FAQ, etc.)
├── README.md                → Project overview
├── CONTRIBUTING.md          → Contribution guidelines
├── CODE_OF_CONDUCT.md       → Community standards
├── ROADMAP.md               → ECWOC 2026 roadmap
└── LICENSE
```

---

## 🌿 Environment Configuration

### 📌 Frontend `.env`

📁 `frontend/.env`

```env
VITE_APP_NAME=UniFlux
VITE_API_BASE_URL=http://localhost:5000/api
VITE_AUTH_TOKEN_KEY=uniflux_auth_token
```

---

### 🔐 Backend `.env`

📁 `backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/uniflux
JWT_SECRET=your_secure_jwt_secret
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

⚠️ Never commit `.env` files. Use `.env.example` for reference.

---

## 📦 Install Dependencies

### 🖥️ Frontend

```bash
cd frontend
npm install
```

### ⚙️ Backend

```bash
cd ../backend
npm install
```

---

## 🚀 Run the Project Locally

### ▶️ Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

### ▶️ Start Frontend App

```bash
cd ../frontend
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🧪 Development Notes

- 🔧 Some features may use **mock or temporary data** during early ECWOC phases
- 🔐 Authentication & database integration will be expanded incrementally
- 📅 Timetable optimization logic will evolve phase-by-phase
- 📊 Dashboards will initially show sample analytics

---

## 🧠 Useful NPM Scripts

### Frontend

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Backend

```json
"scripts": {
  "dev": "nodemon src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 🧪 Testing (Planned)

- Manual testing during early development
- Automated testing (unit + integration) planned in later ECWOC phases

---

## 📥 Need Help?

Feel free to reach out:

- 💬 [GitHub Discussions](https://github.com/abhisek2004/Uniflux/discussions)
- 📧 [officialdevelevate@gmail.com](mailto:officialdevelevate@gmail.com)
- 🧑‍💻 Project Maintainer: Abhisek Panda

---

## ✅ Next Steps After Setup

1. Explore the project structure
2. Read `README.md` and `CONTRIBUTING.md`
3. Pick an issue suitable to your skill level
4. Create a branch and start contributing
5. Submit a Pull Request 🚀

---

Thank you for setting up **UniFlux** locally 💙
Let’s build **smarter, scalable, and open university systems together** 🎓⚡
````
