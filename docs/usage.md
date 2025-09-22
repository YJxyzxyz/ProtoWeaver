# 使用指南

## 前端 Studio

```bash
pnpm install
pnpm -C apps/studio dev
```

浏览器访问 `http://localhost:3000`，即可体验上传草图、预览 UI-IR、对话式迭代。

## 后端 API

```bash
cd services/api
uvicorn app.main:app --reload
```

默认监听 `http://localhost:8000`，Studio 会自动调用该 API。

## 预览器

```bash
pnpm -C apps/preview dev
```

将 `ui-ir.json` 内容写入浏览器的 `localStorage.setItem('protoweaver-ui-ir', json)` 后刷新即可查看渲染结果。

## CLI

```bash
pnpm -C packages/cli build
node packages/cli/dist/cli.js sample --out tmp/
```

更多命令参见 `packages/cli`。
