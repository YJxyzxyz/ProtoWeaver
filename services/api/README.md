# ProtoWeaver API

FastAPI 服务，负责接收上传的草图、语音描述，生成 UI-IR 与可运行的 Next.js 代码包。

## 本地启动

```bash
cd services/api
uvicorn app.main:app --reload
```

默认监听 `http://localhost:8000`。

## 关键端点

- `POST /v1/projects`：上传 `sketch` (必填)、`audio` (可选)、`transcript` (可选)，返回 UI-IR 与代码包
- `GET /v1/projects/{id}`：获取项目当前版本
- `POST /v1/projects/{id}/iterate`：输入自然语言指令，返回更新后的 UI-IR 与 diff

## 项目结构

- `app/services/pipeline.py`：多模态解析 + 代码生成主流程
- `app/schemas/project.py`：Pydantic 模型定义
- `app/services/store.py`：内存态存储，方便演示

生产环境可改为外部存储（Redis/Postgres）并调用真实的 CV、ASR、LLM 服务。
