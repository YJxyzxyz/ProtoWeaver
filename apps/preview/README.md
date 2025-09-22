# ProtoWeaver Preview

轻量级 Vite + React 预览器，用于在浏览器中渲染 UI-IR。

```bash
pnpm -C apps/preview dev
```

默认会渲染 `sampleUIIR`。若要查看真实数据，可在浏览器控制台执行：

```js
localStorage.setItem('protoweaver-ui-ir', JSON.stringify(actualUIIR))
```

刷新页面即可看到更新。
