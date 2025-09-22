import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'ProtoWeaver Studio',
  description: '多模态 UI 原型生成工作台',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-8 py-10">
          <header className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">ProtoWeaver Studio</h1>
            <p className="text-slate-400">
              上传手绘草图与语音描述，自动生成 React 原型，并通过对话式指令持续迭代。
            </p>
          </header>
          <main className="flex flex-1 flex-col gap-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
