from fastapi import APIRouter, HTTPException

from ...schemas.project import ProjectRetrieveResponse
from ...services.store import store

router = APIRouter()


@router.get("/{project_id}", response_model=ProjectRetrieveResponse)
async def get_project(project_id: str) -> ProjectRetrieveResponse:
    project = store.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectRetrieveResponse(project_id=project.project_id, ui_ir=project.ui_ir, code_bundle=project.code_bundle)
