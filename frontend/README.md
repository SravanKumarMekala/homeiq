# HomeIQ

A full-stack home automation application with React frontend and FastAPI backend.

## Deployment on Render

This project is configured for deployment on Render using the `render.yaml` file.

### Steps to Deploy:

1. Push this code to a GitHub repository.

2. Go to [Render Dashboard](https://dashboard.render.com) and connect your GitHub repo.

3. Render will detect the `render.yaml` and set up the services:
   - PostgreSQL database
   - Backend web service (Python/FastAPI)
   - Frontend static site (React/Vite)

4. After deployment, update the `VITE_API_URL` environment variable in the frontend service to match the backend's URL (e.g., `https://homeiq-backend.onrender.com`).

5. The frontend will be accessible at the static site URL, and the API at the web service URL.

### Local Development

- Backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
- Frontend: `cd frontend && npm install && npm run dev`

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (provided by Render)
- `VITE_API_URL`: Backend API URL for the frontend
