from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from ..core.config import settings
from ..schemas.project import Asset, CodeBundle, LayoutNode, ProjectCreateResponse, UIIRPayload
from .store import ProjectState, store

SAMPLE_COMPONENTS: List[Dict[str, object]] = [
    {
        "id": "hero",
        "type": "hero",
        "text": "ProtoWeaver — 从草图到原型",
        "children": [
            {
                "id": "cta-button",
                "type": "button",
                "text": "立即体验",
                "events": [
                    {
                        "id": "cta-click",
                        "trigger": "onClick",
                        "action": {"type": "navigate", "payload": {"href": "/app"}},
                    }
                ],
            }
        ],
    },
    {
        "id": "feature-section",
        "type": "section",
        "layout": {"direction": "row", "gap": 16},
        "children": [
            {"id": "feature-detection", "type": "card", "text": "自动检测 UI 组件"},
            {"id": "feature-voice", "type": "card", "text": "语音描述转交互"},
            {"id": "feature-code", "type": "card", "text": "生成 React/Next.js 代码"},
        ],
    },
]


def _storage_path() -> Path:
    path = Path(settings.storage_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def _save_upload(content: bytes, suffix: str) -> str:
    file_path = _storage_path() / f"{uuid.uuid4()}.{suffix}"
    file_path.write_bytes(content)
    return str(file_path)


def parse_sketch(sketch_bytes: bytes) -> LayoutNode:
    root = LayoutNode(
        id="root",
        type="page",
        name="GeneratedPage",
        layout={"direction": "column", "gap": 24, "padding": [40, 40, 40, 40]},
        children=[LayoutNode(**component) for component in SAMPLE_COMPONENTS],
    )
    return root


def transcribe_audio(audio_bytes: Optional[bytes]) -> Optional[str]:
    if audio_bytes is None:
        return None
    return "在 Hero 区域显示标题 ProtoWeaver，加一个立即体验按钮，下方放三个特性卡片"


def interpret_intent(transcript: Optional[str]) -> Dict[str, str]:
    if not transcript:
        return {}
    return {
        "summary": transcript,
        "tone": "modern",
        "accent_color": "#3b82f6",
    }


def fuse_modalities(layout: LayoutNode, intent: Dict[str, str], assets: List[Asset]) -> UIIRPayload:
    metadata = {
        "source": "mixed" if intent else "sketch",
        "tone": intent.get("tone", "neutral"),
        "accent": intent.get("accent_color", "#2563eb"),
        "revision": 1,
    }

    return UIIRPayload(
        id=str(uuid.uuid4()),
        title="ProtoWeaver Prototype",
        description=intent.get("summary"),
        metadata=metadata,
        layout_tree=layout,
        assets=assets,
    )


def generate_code(ui_ir: UIIRPayload) -> CodeBundle:
    files: Dict[str, str] = {}
    files["package.json"] = json.dumps(
        {
            "name": "proto-preview",
            "private": True,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
            },
            "dependencies": {
                "next": "^14.1.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "tailwindcss": "^3.4.1",
            },
        },
        indent=2,
        ensure_ascii=False,
    )

    files["app/page.tsx"] = _render_next_page(ui_ir)
    files["app/layout.tsx"] = _render_layout()
    files["tailwind.config.js"] = _render_tailwind()
    files["postcss.config.js"] = _render_postcss()
    files["globals.css"] = _render_globals(ui_ir)

    return CodeBundle(framework="nextjs", entry="app/page.tsx", files=files)


def _render_next_page(ui_ir: UIIRPayload) -> str:
    from textwrap import dedent

    data_json = json.dumps(ui_ir.dict(), ensure_ascii=False, indent=2)
    template = dedent("""
    'use client';

    import React from 'react';
    import Link from 'next/link';

    const data = __DATA__;

    function renderNode(node) {
      const common = { key: node.id };
      switch (node.type) {
        case 'hero':
          return (
            <section {...common} className="flex flex-col items-center gap-6 py-16">
              <h1 className="text-4xl font-bold text-slate-900">{node.text ?? '欢迎使用 ProtoWeaver'}</h1>
              <div className="flex gap-4">
                {node.children?.map(renderNode)}
              </div>
            </section>
          );
        case 'button':
          return (
            <Link href={node?.events?.[0]?.action?.payload?.href ?? '#'} {...common} className="px-6 py-3 rounded-lg bg-blue-600 text-white">
              {node.text ?? '点击'}
            </Link>
          );
        case 'section':
          return (
            <section {...common} className="grid md:grid-cols-3 gap-6">
              {node.children?.map(renderNode)}
            </section>
          );
        case 'card':
          return (
            <div {...common} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">{node.text ?? '功能描述'}</h3>
            </div>
          );
        default:
          return (
            <div {...common} className="p-4 border border-dashed border-slate-300">
              <span className="text-xs uppercase tracking-wide text-slate-500">{node.type}</span>
              {node.children?.map(renderNode)}
            </div>
          );
      }
    }

    export default function Page() {
      const tree = data.layout_tree;
      return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
          <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
            {renderNode(tree)}
          </div>
        </main>
      );
    }
    """)

    return template.replace('__DATA__', data_json)


def _render_layout() -> str:
    return """import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ProtoWeaver Preview',
  description: 'Generated by ProtoWeaver',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
"""


def _render_tailwind() -> str:
    return """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './components/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
"""


def _render_postcss() -> str:
    return """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
"""


def _render_globals(ui_ir: UIIRPayload) -> str:
    accent = ui_ir.metadata.get("accent", "#3b82f6") if ui_ir.metadata else "#3b82f6"
    return f"""@tailwind base;
@tailwind components;
@tailwind utilities;

:root {{
  --accent: {accent};
}}

body {{
  font-family: 'Inter', sans-serif;
}}
"""


def create_project(sketch_bytes: bytes, audio_bytes: Optional[bytes], transcript: Optional[str]) -> ProjectCreateResponse:
    sketch_path = _save_upload(sketch_bytes, "png")
    audio_path = _save_upload(audio_bytes, "wav") if audio_bytes else None

    layout_tree = parse_sketch(sketch_bytes)
    transcript_text = transcript or transcribe_audio(audio_bytes)
    intent = interpret_intent(transcript_text)

    assets: List[Asset] = [
        Asset(id=f"sketch-{uuid.uuid4().hex[:6]}", kind="sketch", uri=sketch_path),
    ]
    if audio_path:
        assets.append(Asset(id=f"audio-{uuid.uuid4().hex[:6]}", kind="audio", uri=audio_path))
    if transcript_text:
        assets.append(
            Asset(
                id=f"transcript-{uuid.uuid4().hex[:6]}",
                kind="transcript",
                uri=f"memory://transcript/{uuid.uuid4().hex}",
                metadata={"text": transcript_text},
            )
        )

    ui_ir = fuse_modalities(layout_tree, intent, assets)
    code_bundle = generate_code(ui_ir)
    project_state = ProjectState(project_id=ui_ir.id, ui_ir=ui_ir, code_bundle=code_bundle)
    store.save(project_state)

    return ProjectCreateResponse(project_id=ui_ir.id, ui_ir=ui_ir, code_bundle=code_bundle)


def apply_iteration(project_id: str, message: str) -> ProjectState:
    project = store.get(project_id)
    if not project:
        raise ValueError("Project not found")

    if "按钮" in message or "button" in message.lower():
        hero = next((child for child in project.ui_ir.layout_tree.children if child.id == "hero"), None)
        if hero:
            new_button = LayoutNode(
                id=f"cta-{uuid.uuid4().hex[:6]}",
                type="button",
                text="新增按钮",
                events=[
                    {
                        "id": f"evt-{uuid.uuid4().hex[:6]}",
                        "trigger": "onClick",
                        "action": {"type": "emit", "payload": {"event": "custom"}},
                    }
                ],
            )
            hero.children.append(new_button)

    project.ui_ir.metadata["revision"] = project.ui_ir.metadata.get("revision", 1) + 1
    project.code_bundle = generate_code(project.ui_ir)
    project.updated_at = datetime.utcnow()
    store.save(project)
    return project
