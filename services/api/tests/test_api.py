import io

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_healthz():
    response = client.get('/healthz')
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'


def test_create_project_and_iterate():
    sketch = io.BytesIO(b'fake-image-bytes')
    response = client.post('/v1/projects', files={'sketch': ('sketch.png', sketch, 'image/png')})
    assert response.status_code == 200
    data = response.json()
    project_id = data['project_id']

    iterate = client.post(f'/v1/projects/{project_id}/iterate', json={'message': '新增一个按钮'})
    assert iterate.status_code == 200
    body = iterate.json()
    assert body['ui_ir']['metadata']['revision'] >= 1
