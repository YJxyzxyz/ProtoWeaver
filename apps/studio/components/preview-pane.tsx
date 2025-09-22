'use client';

import { useMemo, useState } from 'react';
import { sampleUIIR, type UIIR } from '@protoweaver/ui-ir';
import type { GenerateResponse } from '@/lib/api';

interface PreviewPaneProps {
  project?: GenerateResponse;
}

function CodeFileTabs({ files }: { files: Record<string, string> }) {
  const entries = Object.entries(files);
  const [active, setActive] = useState(entries[0]?.[0] ?? '');
  const content = active ? files[active] : '';
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/60">
      <div className="flex gap-2 border-b border-slate-800 p-2 text-xs text-slate-400">
        {entries.map(([path]) => (
          <button
            key={path}
            onClick={() => setActive(path)}
            className={`rounded px-3 py-1 transition ${active === path ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            {path}
          </button>
        ))}
      </div>
      <pre className="flex-1 overflow-auto whitespace-pre-wrap bg-slate-950/80 p-4 text-xs text-slate-300">{content}</pre>
    </div>
  );
}

export function PreviewPane({ project }: PreviewPaneProps) {
  const ui: UIIR | undefined = useMemo(() => {
    if (!project) return undefined;
    return project.uiIR as UIIR;
  }, [project]);

  const files = project?.codeBundle.files ?? {};

  return (
    <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">2. UI-IR 预览</h2>
          <p className="text-sm text-slate-400">系统生成的中间表示（组件、层级、约束、主题）。</p>
        </div>
        <pre className="max-h-[320px] overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
          {JSON.stringify(ui ?? sampleUIIR, null, 2)}
        </pre>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-50">3. 代码预览</h2>
          <p className="text-sm text-slate-400">Tailwind + Next.js 代码，可直接下载部署。</p>
        </div>
        {Object.keys(files).length ? <CodeFileTabs files={files} /> : <EmptyCodeState />}
      </div>
    </section>
  );
}

function EmptyCodeState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-700 p-8 text-sm text-slate-400">
      <span>生成后将在这里显示代码文件。</span>
    </div>
  );
}
