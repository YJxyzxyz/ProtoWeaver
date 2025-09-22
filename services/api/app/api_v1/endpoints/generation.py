from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ...schemas.project import ProjectCreateResponse
from ...services.pipeline import create_project

router = APIRouter()


@router.post("", response_model=ProjectCreateResponse)
async def create_project_endpoint(
    sketch: UploadFile = File(...),
    audio: UploadFile | None = File(None),
    transcript: str | None = Form(None),
) -> ProjectCreateResponse:
    try:
        sketch_bytes = await sketch.read()
        audio_bytes = await audio.read() if audio else None
        project = create_project(sketch_bytes, audio_bytes, transcript)
        return project
    except Exception as exc:  # pragma: no cover - fallback error mapping
        raise HTTPException(status_code=500, detail=str(exc)) from exc
