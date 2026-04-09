from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import engine, Base
from config import settings

# Import all models so Base knows about them
import models  # noqa

from routes import auth, profile, invite, chat, recommendations, progress


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables (use Alembic in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: dispose engine
    await engine.dispose()


app = FastAPI(
    title="MentorAI API",
    description="AI-powered career mentorship platform for Indian students",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "https://mentor-ai.vercel.app",
        "https://mentor-ai-raj9661s-projects.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── ROUTERS ─────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(invite.router)
app.include_router(chat.router)
app.include_router(recommendations.router)
app.include_router(progress.router)


@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "app": "MentorAI API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
