from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Awaitable, Callable, Dict

from tenacity import retry, stop_after_attempt, wait_fixed

logger = logging.getLogger(__name__)


@dataclass
class MockTask:
    """描述一个需要异步执行的推理任务。"""

    id: str
    payload: Dict[str, Any]
    callback: Callable[[Dict[str, Any]], Awaitable[None]]


class InferenceWorker:
    """极简事件循环 worker，模拟调度多模态推理。"""

    def __init__(self) -> None:
        self.queue: "asyncio.Queue[MockTask]" = asyncio.Queue()
        self._running = False

    async def submit(self, task: MockTask) -> None:
        logger.info("收到新任务 %s", task.id)
        await self.queue.put(task)

    async def _process(self, task: MockTask) -> None:
        logger.debug("开始处理任务 %s", task.id)
        await asyncio.sleep(0.2)
        result = {
            "taskId": task.id,
            "finishedAt": datetime.utcnow().isoformat(),
            "uiIR": {
                "id": task.payload.get("project_id", "mock"),
                "status": "processed",
            },
        }
        await task.callback(result)

    @retry(stop=stop_after_attempt(3), wait=wait_fixed(1))
    async def _safe_process(self, task: MockTask) -> None:
        await self._process(task)

    async def run(self) -> None:
        self._running = True
        logger.info("Inference worker started")
        while self._running:
            task = await self.queue.get()
            try:
                await self._safe_process(task)
            except Exception as exc:  # pragma: no cover - logging branch
                logger.exception("任务 %s 失败: %s", task.id, exc)
            finally:
                self.queue.task_done()

    async def shutdown(self) -> None:
        self._running = False
        logger.info("Inference worker shutting down")


async def main() -> None:  # pragma: no cover - demo entrypoint
    logging.basicConfig(level=logging.INFO)
    worker = InferenceWorker()

    async def print_callback(result: Dict[str, Any]) -> None:
        logger.info("任务完成: %s", json.dumps(result, ensure_ascii=False))

    async def produce() -> None:
        for index in range(3):
            await worker.submit(
                MockTask(id=f"demo-{index}", payload={"project_id": f"demo-{index}"}, callback=print_callback)
            )
        await worker.queue.join()
        await worker.shutdown()

    await asyncio.gather(worker.run(), produce())


if __name__ == "__main__":  # pragma: no cover
    asyncio.run(main())
