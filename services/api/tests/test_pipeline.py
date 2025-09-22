import pytest

from app.services import pipeline


def test_parse_sketch_generates_layout():
    layout = pipeline.parse_sketch(b"fake-bytes")
    assert layout.type == "page"
    assert layout.children


def test_fuse_modalities_creates_ui_ir():
    layout = pipeline.parse_sketch(b"fake")
    ui_ir = pipeline.fuse_modalities(layout, {"summary": "test"}, [])
    assert ui_ir.layout_tree.id == "root"
    assert ui_ir.metadata["source"] == "mixed"


@pytest.mark.parametrize("message", ["新增一个按钮", "add button"])
def test_apply_iteration_adds_button(message):
    project = pipeline.create_project(b"sketch", None, "Hero section")
    before = len(project.ui_ir.layout_tree.children[0].children)
    updated = pipeline.apply_iteration(project.project_id, message)
    hero = next(child for child in updated.ui_ir.layout_tree.children if child.id == "hero")
    assert len(hero.children) >= before
