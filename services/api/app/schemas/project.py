from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class Bounds(BaseModel):
    x: Optional[float] = None
    y: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None


class LayoutNode(BaseModel):
    id: str
    type: str
    name: Optional[str] = None
    text: Optional[str] = None
    role: Optional[str] = None
    placeholder: Optional[str] = None
    layout: Dict[str, Any] = Field(default_factory=dict)
    style: Dict[str, Any] = Field(default_factory=dict)
    bindings: Dict[str, str] = Field(default_factory=dict)
    constraints: Dict[str, Any] = Field(default_factory=dict)
    events: List[Dict[str, Any]] = Field(default_factory=list)
    children: List['LayoutNode'] = Field(default_factory=list)

    class Config:
        orm_mode = True


LayoutNode.update_forward_refs()


class Asset(BaseModel):
    id: str
    kind: str
    uri: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class DataSource(BaseModel):
    id: str
    name: str
    type: str
    config: Dict[str, Any] = Field(default_factory=dict)
    sample: Any | None = None


class Theme(BaseModel):
    id: str = "default"
    name: str = "ProtoWeaver Theme"
    tokens: Dict[str, Any] = Field(default_factory=dict)


class UIIRPayload(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    version: str = "0.1.0"
    locale: str = "zh-CN"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    layout_tree: LayoutNode
    assets: List[Asset] = Field(default_factory=list)
    data_sources: List[DataSource] = Field(default_factory=list)
    theme: Theme = Field(default_factory=Theme)


class CodeBundle(BaseModel):
    framework: str = "nextjs"
    entry: str = "app/page.tsx"
    files: Dict[str, str] = Field(default_factory=dict)


class ProjectCreateResponse(BaseModel):
    project_id: str
    ui_ir: UIIRPayload
    code_bundle: CodeBundle


class ProjectRetrieveResponse(ProjectCreateResponse):
    pass


class IterationRequest(BaseModel):
    message: str


class IterationResponse(BaseModel):
    project_id: str
    ui_ir: UIIRPayload
    diff: Dict[str, Any]
    code_bundle: CodeBundle
