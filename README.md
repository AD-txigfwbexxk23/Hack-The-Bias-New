# HackTheBias Platform

This is a fullstack web app built for managing hackathon information, registration, team formation, and sponsor details.  
It uses **Vite.js (React)** for the frontend and **FastAPI (Python)** for the backend.

---

## 🧱 Project Structure

---

## 🖥️ Frontend Setup (Vite.js)

### 🔧 Prerequisites

- Node.js (v18+ recommended)
- npm

### ▶️ Configure and Run frontend

Create a folder called .env.local in frontend/hack-the-bias. Add the following line:

```bash
Vite_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

To run the server

```bash
cd frontend
npm install
npm run dev
```

### 1. Create and activate environment (if not already done)

In the backend folder, create a file called env, add the following line:

```bash
export ALLOWED_ORIGINS=http://localhost:3000
```

Ensure you have anaconda/miniconda installed:

- <https://www.anaconda.com/download>

```bash
cd backend
conda init
conda activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the FastAPI backend

```bash
cd backend
uvicorn main:app --reload
```

FastAPI will be live at <http://localhost:8000>

## Migrations

Make sure alembic is set up (init once with alembic init alembic if not already).

### 🔄 To apply migrations

```bash
cd backend
alembic upgrade head
```

### ✍️ To create a migration after changing models:

```bash
alembic revision --autogenerate -m "your message here"
```