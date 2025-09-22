'use client';

import { useRef, useState } from 'react';
import type { GenerateResponse } from '@/lib/api';

interface UploadPanelProps {
  loading: boolean;
  error?: string;
  onGenerate: (formData: FormData) => Promise<GenerateResponse>;
}

export function UploadPanel({ loading, error, onGenerate }: UploadPanelProps) {
  const [transcript, setTranscript] = useState('');
  const sketchRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData();
    const sketchFile = sketchRef.current?.files?.[0];
    if (!sketchFile) {
      alert('请先上传草图');
      return;
    }
    form.append('sketch', sketchFile);
    const audioFile = audioRef.current?.files?.[0];
    if (audioFile) {
      form.append('audio', audioFile);
    }
    if (transcript) {
      form.append('transcript', transcript);
    }

    await onGenerate(form);
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-50">1. 上传草图 & 语音</h2>
        <p className="text-sm text-slate-400">系统会自动完成去噪、组件检测、ASR 与代码生成。</p>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">草图 (.png/.jpg)</span>
          <input ref={sketchRef} type="file" accept="image/png,image/jpeg" className="rounded border border-slate-700 bg-slate-800 px-3 py-2" required />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">语音描述 (.wav/.m4a)</span>
          <input ref={audioRef} type="file" accept="audio/wav,audio/m4a" className="rounded border border-slate-700 bg-slate-800 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">可选：语音转写文本（直接跳过 ASR）</span>
          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="例如：英雄区标题写 ProtoWeaver，加一个开始体验按钮，下面放三个特性卡片"
            className="min-h-[80px] rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
          disabled={loading}
        >
          {loading ? '生成中...' : '生成原型'}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
    </section>
  );
}
