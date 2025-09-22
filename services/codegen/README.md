# ProtoWeaver Codegen

Node.js 代码生成器：将 UI-IR JSON 映射为 React/Next.js 代码文件。

## 使用示例

```ts
import { sampleUIIR } from '@protoweaver/ui-ir';
import { generateCode } from '@protoweaver/codegen';

const result = generateCode(sampleUIIR);
console.log(Object.keys(result.files));
```

生成的文件可直接写入 Next.js 项目的 `app/` 目录。
