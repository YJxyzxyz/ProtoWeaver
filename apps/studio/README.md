# ProtoWeaver Studio

Next.js 工作台，集成上传、UI-IR 预览、代码查看与对话式迭代。

## 本地启动

```bash
pnpm install
pnpm -C apps/studio dev
```

需要本地运行 FastAPI 后端：

```bash
uvicorn services.api.app.main:app --reload
```

可以通过 `NEXT_PUBLIC_API_BASE` 环境变量切换后端地址。
