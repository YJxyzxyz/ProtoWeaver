# ProtoWeaver Worker

异步推理 Worker，模拟 CV / ASR / LLM 推理任务队列。采用 `asyncio` 实现最小可运行示例。

## 启动

```bash
cd services/worker
python -m protoweaver_worker.worker
```

运行后会自动生成 demo 任务并输出结果。
