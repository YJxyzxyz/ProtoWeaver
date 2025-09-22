from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api_v1.router import api_router
from .core.config import settings

app = FastAPI(
    title="ProtoWeaver API",
    version="0.1.0",
    description="将手绘草图与语音描述转换为 Web 原型的后端服务",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_prefix)


@app.get("/healthz", tags=["system"])
async def healthz() -> dict[str, str]:
    """Kubernetes 友好的健康检查。"""
    return {"status": "ok"}
