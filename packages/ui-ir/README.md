# UI-IR Schema

TypeScript 定义的 UI 中间表示（UI-IR），用于描述组件树、样式、约束、事件、主题信息。

- `layoutNodeSchema`：单个节点结构
- `uiIRSchema`：完整原型结构
- `applyPatch / applyPatches`：用于对 UI-IR 进行增量更新
- `sampleUIIR`：演示数据，可直接用于预览

## 用法

```ts
import { uiIRSchema, sampleUIIR } from '@protoweaver/ui-ir';

const parsed = uiIRSchema.parse(sampleUIIR);
console.log(parsed.layoutTree.children.length);
```
