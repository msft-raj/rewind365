"""
Rewind365 FastAPI Backend
Serves both API endpoints and React static files
"""
import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.config import get_settings
from app.routers import teams, outlook, preferences, digest

# Load environment variables
load_dotenv()

# Get configuration
settings = get_settings()

# Create FastAPI app
app = FastAPI(
    title="Rewind365 API",
    description="AI-powered daily digest for Teams and Outlook",
    version="1.0.0",
    docs_url="/api/docs" if settings.debug else None,
    redoc_url="/api/redoc" if settings.debug else None,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(teams.router, prefix="/api/teams", tags=["teams"])
app.include_router(outlook.router, prefix="/api/outlook", tags=["outlook"]) 
app.include_router(preferences.router, prefix="/api/preferences", tags=["preferences"])
app.include_router(digest.router, prefix="/api/digest", tags=["digest"])

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "rewind365-api",
        "version": "1.0.0",
        "environment": settings.environment
    }

# Static files directory
STATIC_DIR = Path(__file__).parent / "static"

# Mount static files for React app assets (JS, CSS, images)
if STATIC_DIR.exists():
    # Mount React's static assets (JS, CSS)
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR / "static")), name="static")
    
    # Serve React app for all non-API routes
    @app.get("/{full_path:path}")
    async def serve_react_app(request: Request, full_path: str):
        """
        Serve React app for all non-API routes
        This handles client-side routing for React Router
        """
        # Skip API routes
        if full_path.startswith("api/"):
            return {"error": "API endpoint not found"}
        
        # If requesting a specific file that exists, serve it
        file_path = STATIC_DIR / full_path
        if file_path.is_file() and file_path.exists():
            return FileResponse(file_path)
        
        # For all other routes (React Router paths), serve index.html
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        
        return {"message": "React app not found. Run deployment script first."}

else:
    @app.get("/")
    async def root():
        """Root endpoint when static files are not available"""
        return {
            "message": "Rewind365 API Server",
            "docs": "/api/docs",
            "static_files": "Not found. Run 'npm run build' in frontend directory and copy build/ to backend/static/"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=settings.debug
    )