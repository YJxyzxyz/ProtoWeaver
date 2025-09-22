from fastapi import APIRouter, HTTPException

from ...schemas.project import IterationRequest, IterationResponse
from ...services.pipeline import apply_iteration

router = APIRouter()


@router.post("/{project_id}/iterate", response_model=IterationResponse)
async def iterate_project(project_id: str, payload: IterationRequest) -> IterationResponse:
    try:
        project = apply_iteration(project_id, payload.message)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    diff = {"message": payload.message, "revision": project.ui_ir.metadata.get("revision")}

    return IterationResponse(
        project_id=project.project_id,
        ui_ir=project.ui_ir,
        diff=diff,
        code_bundle=project.code_bundle,
    )
