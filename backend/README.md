# Rewind365 Backend

## Overview
FastAPI backend that serves both API endpoints and React static files.

## Architecture
- **FastAPI** serves API at `/api/*`
- **Static Files** serves React build at `/` 
- **Single Deployment** to Azure App Service
- **Microsoft Graph** integration for Teams/Outlook
- **OpenAI** for AI summarization

## Structure
```
/backend
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies  
├── .env.example           # Environment variables template
├── static/                # React build files (copied from frontend/build)
├── app/
│   ├── __init__.py
│   ├── config.py          # App configuration
│   ├── auth.py            # Microsoft Graph authentication
│   └── routers/
│       ├── __init__.py
│       ├── teams.py       # Teams endpoints
│       ├── outlook.py     # Outlook endpoints
│       ├── preferences.py # User preferences
│       └── digest.py      # Daily digest
├── services/
│   ├── __init__.py
│   ├── graph_service.py   # Microsoft Graph client
│   ├── ai_service.py      # OpenAI integration
│   └── storage_service.py # Data persistence
└── startup.sh             # Azure deployment startup script
```

## API Endpoints
- `GET /api/health` - Health check
- `GET /api/teams/channels` - Get Teams channels
- `GET /api/outlook/folders` - Get Outlook folders
- `GET /api/preferences` - Get user preferences  
- `POST /api/preferences` - Save user preferences
- `GET /api/digest` - Get daily AI digest

## Static Files
- `GET /` - React app (index.html)
- `GET /config` - React config page
- `GET /home` - React home page
- `GET /about` - React about page
- `GET /static/*` - React assets (JS, CSS, images)