# 多模态生成流程细节

1. **Sketch 解析**（`parse_sketch`）
   - 接入视觉模型，输出布局树、组件类型、约束。
2. **ASR + 意图理解**（`transcribe_audio`, `interpret_intent`）
   - 语音降噪 → 文本 → 提取交互需求、主题色、文案。
3. **跨模态融合**（`fuse_modalities`）
   - 合并布局树与意图，写入 UI-IR 的 `metadata`、`theme`、`events`。
4. **代码生成**（`generate_code` + `@protoweaver/codegen`）
   - 将 UI-IR 映射到组件库（默认 Tailwind + Next.js）。
   - 自动生成 `package.json`、`app/page.tsx`、全局样式。
5. **校验**（待扩展）
   - 集成 ESLint、TS Check、Playwright 预览快照。
6. **对话式迭代**（`apply_iteration`）
   - 根据自然语言指令生成 UI-IR Diff，重新渲染代码。

> 示例实现为简化版本，便于快速原型搭建。实际项目可替换为真实模型与更严谨的代码生成策略。
