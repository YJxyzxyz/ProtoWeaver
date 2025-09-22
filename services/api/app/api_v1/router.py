from fastapi import APIRouter

from .endpoints import generation, iterations, projects

api_router = APIRouter()
api_router.include_router(generation.router, prefix="/projects", tags=["generation"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(iterations.router, prefix="/projects", tags=["iterations"])
