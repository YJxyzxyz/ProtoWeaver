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

## 🚀 快速开始

```bash
# 安装依赖
pnpm install

# 启动后端 (FastAPI)
uvicorn services.api.app.main:app --reload

# 启动前端工作台
pnpm -C apps/studio dev

# 可选：启动预览器 (Vite)
pnpm -C apps/preview dev
```

访问 [http://localhost:3000](http://localhost:3000/) 上传草图与语音。预览器默认读取 `localStorage` 中的 `protoweaver-ui-ir`。

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
- Python API：`pytest`（位于 `services/api`）

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
