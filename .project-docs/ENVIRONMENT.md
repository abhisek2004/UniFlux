````md
# 🌿 Environment Setup – UniFlux

This document explains the **environment variables** required to run  
**UniFlux – AI-Powered Smart University Management & Timetable Optimization Platform**  
developed under **🏆 Elite Coders Winter of Code (ECWOC 2026)**.

---

## ⚠️ Important Notes

- ❌ **Never commit `.env` files to GitHub**
- ✅ Always use `.env.example` for reference
- 🔐 Environment variables store **sensitive configuration** such as keys, URLs, and secrets
- 🧩 UniFlux follows a **Frontend + Backend separation**

---

## 🖥️ Frontend Environment Variables

📁 File: `frontend/.env`

```env
# Application
VITE_APP_NAME=UniFlux
VITE_APP_ENV=development

# Backend API
VITE_API_BASE_URL=http://localhost:5000/api

# Authentication
VITE_AUTH_TOKEN_KEY=uniflux_auth_token

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```
````

### 🔍 Explanation

- `VITE_API_BASE_URL` → Connects frontend to backend APIs
- `VITE_AUTH_TOKEN_KEY` → Key used to store auth token securely
- Feature flags help enable/disable features without code changes

---

## 🔐 Backend Environment Variables

📁 File: `backend/.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/uniflux

# Authentication & Security
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Optimization & System Config
MAX_CLASSES_PER_DAY=6
MAX_FACULTY_LOAD_PER_WEEK=20

# Logging & Monitoring
ENABLE_LOGGING=true
```

### 🔍 Explanation

- `MONGODB_URI` → Stores all academic data (users, subjects, timetables, results)
- `JWT_SECRET` → Used to sign and verify authentication tokens
- `CORS_ALLOWED_ORIGINS` → Prevents unauthorized frontend access
- System config variables allow **dynamic academic rule control**

---

## 📁 `.env.example` (Required for Open Source)

Each environment must include a **safe example file**:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
VITE_API_BASE_URL=
```

This helps contributors configure UniFlux **without exposing secrets**.

---

## 🛡️ Security Best Practices

- 🔒 Use strong secrets (minimum 32 characters)
- 🔄 Rotate secrets periodically
- 🧪 Never hardcode values inside source code
- 📦 Use different `.env` files for:

  - development
  - staging
  - production

---

## 🚀 Getting Started

1️⃣ Copy `.env.example` → `.env`
2️⃣ Fill required values
3️⃣ Start backend server
4️⃣ Start frontend app
5️⃣ UniFlux is ready to run 🎓⚡

---

## 💙 ECWOC 2026 Note

All contributors must:

- Follow environment setup rules
- Avoid committing sensitive data
- Report misconfigurations via issues

Let’s keep **UniFlux secure, scalable, and production-ready** 🚀
