'use client';

import { FormEvent, useState } from 'react';
import type { GenerateResponse } from '@/lib/api';

interface ChatPanelProps {
  project?: GenerateResponse;
  loading: boolean;
  onIterate: (message: string) => Promise<GenerateResponse>;
}

export function ChatPanel({ project, loading, onIterate }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    setHistory((prev) => [...prev, `🧑 ${message}`]);
    const result = await onIterate(message);
    const revision = (result.uiIR as any)?.metadata?.revision ?? 'n/a';
    setHistory((prev) => [...prev, `🤖 已根据指令更新原型 (rev:${revision})`]);
    setMessage('');
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">4. 对话式迭代</h2>
          <p className="text-sm text-slate-400">输入自然语言指令，系统会生成 UI-IR Diff 并刷新代码。</p>
        </div>
        <div className="flex max-h-64 flex-col gap-2 overflow-auto rounded border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-200">
          {history.length ? history.map((entry, index) => <div key={index}>{entry}</div>) : <span className="text-slate-500">暂无对话，先生成原型再进行微调吧。</span>}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="例如：把 CTA 按钮改成“立即试用”，并新增一个导航栏"
            className="min-h-[80px] rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="self-end rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            disabled={!project || loading}
          >
            {loading ? '应用中...' : '发送指令'}
          </button>
        </form>
      </div>
    </section>
  );
}
