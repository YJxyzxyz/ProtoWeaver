# 🎨 ProtoWeaver — 从手绘+语音到可运行 Web 原型

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE.txt)

> 🖌️ 多模态编程助手：输入手绘草图 + 语音描述，输出完整可运行的 React / Next.js 原型，并支持可编辑预览与对话式迭代。

---

## ✨ 核心特性

- 📷 **草图解析**：示例 CV pipeline，将草图转换为布局树与组件集合。
- 🎙️ **语音理解**：内置 ASR/NLU 模拟器，抽取文案、主题、交互意图。
- 🔗 **UI-IR 中间表示**：`packages/ui-ir` 提供 Schema、Patch、示例数据，串联多端。
- ⚛️ **代码生成**：`services/codegen` 映射 UI-IR → Next.js + Tailwind 代码包。
- 🧪 **FastAPI 服务**：`services/api` 集成多模态流程、可运行性检查、对话式迭代。
- 🖥️ **Studio 前端**：`apps/studio` 支持上传、预览 UI-IR、查看代码与自然语言微调。
- 🔄 **预览器**：`apps/preview` 在浏览器中实时渲染 UI-IR。

---

## ⚙️ 环境要求

- Node.js ≥ 18.17（Next.js 14 需要的最低版本）
- pnpm ≥ 8.15（monorepo 依赖管理）
- Python ≥ 3.10（FastAPI 后端）
- 推荐在 macOS / Linux 下使用，Windows 用户可通过 WSL2 体验

## 🚀 快速开始

1. **安装 Node.js 依赖**

   ```bash
   pnpm install
   ```

   该命令会在整个 workspace 中安装/联结前端、CLI、代码生成等包。

2. **准备 Python 虚拟环境并安装依赖**

   ```bash
   cd services/api
   python -m venv .venv
   source .venv/bin/activate  # Windows 使用 .venv\Scripts\activate
   pip install -e .[dev]
   ```

   如需更改上传文件存储目录或跨域设置，可在根目录创建 `.env` 并配置 `PROTOWEAVER_STORAGE_DIR`、`PROTOWEAVER_CORS_ORIGINS` 等变量。

3. **启动 FastAPI 后端**

   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   默认提供 `/healthz` 健康检查以及 `/v1/projects` 系列接口，上传的草图/语音会保存在 `services/api/uploads/`。

4. **启动 Studio 前端工作台**

   ```bash
   pnpm -C apps/studio dev
   ```

   - 默认监听 `http://localhost:3000`，通过 `NEXT_PUBLIC_API_BASE` 环境变量指定后端地址。
   - 界面包含“上传草图与语音 → UI-IR 预览 → 代码预览 → 对话式迭代”四个区域：
     1. 上传 PNG/JPG 草图、可选 WAV/M4A 语音，或直接粘贴语音转写文本跳过 ASR。
     2. 生成后实时显示 UI-IR JSON，便于调试或导出。
     3. 同步展示生成的 Next.js + Tailwind 代码，可在标签页中切换不同文件。
     4. 输入自然语言指令，调用 `/iterate` 接口生成新版本并查看交互历史。

5. **（可选）启动 Preview 预览器**

   ```bash
   pnpm -C apps/preview dev
   ```

   该预览器基于 Vite + React，默认渲染 `@protoweaver/ui-ir` 中的示例数据。若需查看实际生成结果，可在浏览器控制台执行：

   ```js
   localStorage.setItem('protoweaver-ui-ir', JSON.stringify(actualUIIR))
   ```

6. **（可选）运行示例 Worker**

   ```bash
   cd services/worker
   python -m protoweaver_worker.worker
   ```

   Worker 以异步任务形式模拟 CV / ASR / LLM 推理流程，便于日后替换为真实队列服务。

完成以上步骤后，即可在浏览器访问 [http://localhost:3000](http://localhost:3000/) 上传草图与语音并进行对话式迭代。预览器默认读取 `localStorage` 中的 `protoweaver-ui-ir`。

## 🧰 命令行工具

CLI 基于 `@protoweaver/cli`，适合批量处理或集成到 CI/CD。

```bash
# 构建 CLI（第一次使用或修改后执行）
pnpm --filter @protoweaver/cli build

# 生成原型：上传草图与可选语音，输出 UI-IR + 代码
pnpm exec protoweaver generate --sketch path/to/sketch.png --audio path/to/intent.m4a --out out/

# 导出内置 Demo UI-IR
pnpm exec protoweaver sample --out tmp/

# 对既有项目进行自然语言迭代
pnpm exec protoweaver patch --id <projectId> --message "把 CTA 改成立即体验"
```

通过设置 `PROTOWEAVER_API_URL` 可切换后端地址，例如调用远程部署的 API。

---

## 📂 仓库结构

```
protoweaver/
├─ apps/
│  ├─ studio/         # Next.js 工作台
│  └─ preview/        # Vite 预览器
├─ packages/
│  ├─ ui-ir/          # UI-IR Schema + 工具
│  └─ cli/            # 命令行工具
├─ services/
│  ├─ api/            # FastAPI 服务
│  ├─ worker/         # 推理 Worker 示例
│  └─ codegen/        # TypeScript 代码生成库
├─ docs/              # 架构 / 流程文档
├─ data/              # 示例数据占位
└─ scripts/           # 自动化脚本（预留）
```

---

## 🧪 测试

- TypeScript 包：`pnpm -r test`
- Lint / Format：`pnpm -r lint`、`pnpm -r format`
- Python API：`cd services/api && pytest`
- 一键执行：`make test` 会同时运行 JS/TS 测试与 `pytest`

## 📚 数据与示例

- `data/samples/`：草图、语音与 UI-IR 的占位示例，可按需替换为公开数据集以验证流程。
- `services/api/uploads/`：后端运行时的临时上传目录，可通过 `PROTOWEAVER_STORAGE_DIR` 自定义。
- `docs/`：补充的架构与流程说明文档。

---

## 🛣️ 路线图

- [ ] 集成真实的组件检测模型（Segment Anything / DETR）
- [ ] 支持更多组件库（Radix UI, Ant Design, Chakra）
- [ ] 引入 AST 级代码修复与 LLM 智能补全
- [ ] 对话式编辑的语义 Diff 与冲突解决
- [ ] SaaS 部署与团队协同

---

## 🤝 参与贡献

欢迎提交 Issue / PR，或通过 Discussions 交流想法。

---

## 📜 License

Apache-2.0 © 2025 ProtoWeaver Contributors
