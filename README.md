# 🎨 ProtoWeaver — 从手绘+语音到可运行 Web 原型

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Build](https://github.com/yourname/protoweaver/actions/workflows/ci.yml/badge.svg)](https://github.com/yourname/protoweaver)

> 🖌️ 一个多模态编程助手：输入手绘草图 + 语音描述，输出完整可运行的 React Web 原型。

---

## ✨ 特性
- 📷 **草图解析**：从手绘图中识别按钮、输入框、表格等 UI 组件  
- 🎙️ **语音意图**：语音描述转属性、样式、交互逻辑  
- 🔗 **中间表示 (UI-IR)**：统一的 JSON Schema，支持多模态融合  
- ⚛️ **代码生成**：自动生成 React + Tailwind/Material UI 页面  
- 🔄 **对话式迭代**：自然语言修改 → IR Patch → 代码热更新  
- 🧪 **可运行性保障**：TypeScript、ESLint、AST Patch 确保输出可用  

---

## 🚀 快速开始
```bash
# 克隆项目
git clone https://github.com/yourname/protoweaver.git
cd protoweaver

# 安装依赖
pnpm install

# 启动后端 (FastAPI)
make dev-api

# 启动推理 worker
make dev-worker

# 启动前端 IDE
pnpm -C apps/studio dev
```

然后打开 [http://localhost:3000](http://localhost:3000/) 即可上传草图和语音，生成原型！

------

## 📂 仓库结构

```
protoweaver/
├─ apps/              # 前端 IDE + 预览
│  ├─ studio/         
│  └─ preview/        
├─ services/          # 后端服务
│  ├─ api/            
│  ├─ worker/         
│  └─ codegen/        
├─ models/            # 模型相关
├─ packages/          
│  ├─ ui-ir/          # UI-IR Schema
│  └─ cli/            # 命令行工具
├─ data/              # 示例数据 & 合成工具
├─ docs/              # 技术文档
└─ .github/workflows/ # CI/CD
```

------

## 🛠️ 路线图

-  UI-IR Schema
-  最小 React 渲染器
-  组件检测器 (10 类核心 UI)
-  ASR + 指令解析
-  IR Patch 增量修改
-  在线 Demo

------

## 🤝 如何贡献

我们欢迎各种形式的贡献：

- 新增 UI 组件检测类别
- 改进 NLU 指令解析
- 增强代码生成模板
- 撰写文档 & 教程

------

## 📜 License

Apache-2.0 © 2025 ProtoWeaver Contributors