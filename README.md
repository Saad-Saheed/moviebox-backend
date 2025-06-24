
---

## 📁 `backend/README.md`


# 🎬 MovieBox — Backend API

This is the backend API for the MovieBox web application, developed using **Node.js**, **Express**, and **MongoDB** with **Prisma** as the ORM. It provides authentication, movie reviews, ratings, favorites, watchlist management, and integrates with the TMDB API.

> ✅ Final Capstone Project for the **3MTT x Darey.io** training program.

---

## 🛠 Tech Stack

- Node.js + Express
- MongoDB (via Prisma)
- JWT-based Auth
- RESTful API Design
- CORS, Helmet, dotenv
- Hosted on **Render**

---

## 📦 Installation (Backend)

1. Clone the repo:

```bash
git clone https://github.com/Saad-Saheed/moviebox-backend.git
cd moviebox-backend 
```

2. Install dependencies

```bash
npm install
```

3. Create .env file:

```env
DATABASE_URL=mongodb+srv://<your-mongo-uri>
JWT_SECRET=your-secret-key
TMDB_API_KEY=your-tmdb-api-key
CLIENT_URL=http://localhost:5173
PORT=5000
APP_NAME="MovieBox"
APP_URL=http://localhost:${PORT}
BCRYPT_PASSWORD_SALT=""
JWT_SECRET=""
BCRYPT_SALT_ROUNDS=10
JWT_EXPIRATION="1d"
```
4. Generate Prisma client and Start the server:

```bash
npm run dev
```