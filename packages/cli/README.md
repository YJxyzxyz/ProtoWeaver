# ProtoWeaver CLI

命令行工具用于调用后端服务、导出示例 UI-IR、触发对话式迭代。

## 安装

```bash
pnpm -C packages/cli install
pnpm -C packages/cli build
```

## 常用命令

- `protoweaver generate --sketch sketch.png --audio intent.m4a --out out/`
- `protoweaver sample --out tmp/`
- `protoweaver patch --id <projectId> --message "把 CTA 改成立即体验"`

通过设置 `PROTOWEAVER_API_URL` 可以指定后端地址。
