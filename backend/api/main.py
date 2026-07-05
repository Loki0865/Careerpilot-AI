from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import sys
import uvicorn

# Add backend directory to sys.path to allow internal imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.db import init_db
from api.endpoints import router as api_router

app = FastAPI(
    title="CareerPilot AI API",
    description="REST backend powering the CareerPilot AI multi-agent platform.",
    version="1.0.0"
)

# Enable CORS for Vite local dev server connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix="/api")

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

# Resolve the frontend static files build path (frontend/dist/)
frontend_dist = os.path.abspath(os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
    "frontend", 
    "dist"
))

# Serve the static UI files if they are compiled, otherwise fallback to API docs homepage
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
    print(f"Serving static web UI assets from: {frontend_dist}")
else:
    @app.get("/")
    def read_root():
        return {
            "status": "online",
            "message": "FastAPI Server is running. To serve the visual UI, build the frontend code (npm run build).",
            "api_docs_url": "/docs"
        }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
