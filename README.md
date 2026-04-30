# HomeIQ

## Deployment Ready Setup

This repository is now configured for deployment with Docker and Docker Compose.

### Backend
- The backend is a FastAPI application in `backend/`
- Python dependencies are listed in `backend/requirements.txt`
- Use `backend/Dockerfile` to build the backend container
- Environment variables are loaded from `backend/.env`

### Frontend
- The frontend is a Vite-based React app in `frontend/`
- Use `frontend/Dockerfile` to build the frontend container
- The frontend uses `VITE_API_BASE_URL` from `frontend/.env`

### Local Docker deployment

From the repository root:

```bash
docker compose up --build
```

Then:
- Backend API: `http://localhost:8000`
- Frontend app: `http://localhost:4173`

### Environment files
- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`
- Do not commit `.env` files to Git

### Notes
- Use production values for `DATABASE_URL` and `VITE_API_BASE_URL` in deployment
- Configure CORS in `backend/main.py` for production origins
- Use a secure `SECRET_KEY` in production
