"""ProtoWeaver background worker.

该 worker 负责模拟模型推理（CV、ASR、LLM 等），并提供简单的事件总线示例。
"""

from .worker import InferenceWorker, MockTask

__all__ = ["InferenceWorker", "MockTask"]
