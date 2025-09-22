import { sampleUIIR, type UIIR } from '@protoweaver/ui-ir';
import { useState } from 'react';
import { PreviewTree } from './Renderer';

function loadUiIr(): UIIR {
  const stored = window.localStorage.getItem('protoweaver-ui-ir');
  if (stored) {
    try {
      return JSON.parse(stored) as UIIR;
    } catch (error) {
      console.error('Failed to parse stored UI-IR', error);
    }
  }
  return sampleUIIR;
}

export default function App() {
  const [uiIr] = useState<UIIR>(() => loadUiIr());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-8 py-12">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">ProtoWeaver 实时预览</h1>
          <p className="text-slate-400">
            将 UI-IR JSON 写入 localStorage 的 <code>protoweaver-ui-ir</code> 键，即可实时渲染。
          </p>
        </header>
        <PreviewTree root={uiIr.layoutTree} />
      </div>
    </div>
  );
}
