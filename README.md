# MentorAI Platform

MentorAI is an AI-powered mentorship platform bridging the gap between students seeking career guidance and parents supporting them. It features dedicated portals for students and parents, multilingual AI chat for career discovery, and interactive profile mapping.

## Tech Stack
- **Database:** PostgreSQL (Schema provided)
- **Backend:** FastAPI (Python), PostgreSQL async via generic PG drivers/Supabase
- **Frontend:** Next.js 14, React 18, TailwindCSS 4
- **AI Integration:** OpenAI / Generic LLM via service abstraction

## Project Structure
- `/database`: Contains `schema.sql` for setting up the PostgreSQL database.
- `/backend`: The FastAPI application for handling auth, profiles, and AI requests.
- `/frontend`: The Next.js web application.

## Setup Instructions

### 1. Database
1. Execute the SQL commands in `database/schema.sql` against your PostgreSQL instance to create the necessary tables. You can use Supabase, CockroachDB, or a local PostgreSQL installation.

### 2. Backend (FastAPI)
1. Navigate to the `backend` directory: `cd backend`
2. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in your database credentials and API keys:
   ```env
   DATABASE_URL=postgresql+asyncpg://user:pass@localhost/mentor_ai
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```
5. Run the development server:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend (Next.js)
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies (make sure you have Node.js installed):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000` to access the application.

## Features
- **Student Dashboard:** View recommended career paths, track progress, and build profiles via chat.
- **Parent Dashboard:** Monitor linked children and set budget/expectation constraints.
- **AI Career Counselor:** Interactive guidance in English and Hindi.
- **Role-Based Access Control:** Differentiated views and functions for Parents and Students.
