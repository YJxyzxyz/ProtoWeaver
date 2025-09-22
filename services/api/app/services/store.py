from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Optional

from ..schemas.project import CodeBundle, UIIRPayload


@dataclass
class ProjectState:
    project_id: str
    ui_ir: UIIRPayload
    code_bundle: CodeBundle
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def touch(self) -> None:
        self.updated_at = datetime.utcnow()


class InMemoryProjectStore:
    def __init__(self) -> None:
        self._items: Dict[str, ProjectState] = {}

    def save(self, project: ProjectState) -> ProjectState:
        self._items[project.project_id] = project
        return project

    def get(self, project_id: str) -> Optional[ProjectState]:
        return self._items.get(project_id)

    def list(self) -> Dict[str, ProjectState]:
        return dict(self._items)


store = InMemoryProjectStore()
