from routes.auth import router as auth_router
from routes.profile import router as profile_router
from routes.invite import router as invite_router
from routes.chat import router as chat_router
from routes.recommendations import router as recommendations_router
from routes.progress import router as progress_router

__all__ = [
    "auth_router", "profile_router", "invite_router",
    "chat_router", "recommendations_router", "progress_router",
]
