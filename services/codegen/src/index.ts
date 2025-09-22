import { LayoutNode, UIIR } from '@protoweaver/ui-ir';

export interface GeneratedFileMap {
  [path: string]: string;
}

export interface GenerateOptions {
  framework?: 'next' | 'react';
  language?: 'ts' | 'js';
}

export interface CodegenResult {
  files: GeneratedFileMap;
  entry: string;
  framework: 'next' | 'react';
}

const INDENT = '  ';

const defaultRenderers: Record<string, (node: LayoutNode, renderChildren: () => string) => string> = {
  page: (node, renderChildren) => `\n${INDENT}<main className="min-h-screen bg-slate-50 text-slate-900">${renderChildren()}\n${INDENT}</main>`,
  hero: (node, renderChildren) => `\n${INDENT.repeat(2)}<section className="flex flex-col items-center gap-6 py-16">\n${INDENT.repeat(3)}<h1 className="text-4xl font-bold text-slate-900">${node.text ?? '欢迎使用 ProtoWeaver'}</h1>${renderChildren()}\n${INDENT.repeat(2)}</section>`,
  button: (node) => `\n${INDENT.repeat(3)}<button className="px-6 py-3 rounded-lg bg-blue-600 text-white">${node.text ?? '按钮'}</button>`,
  section: (node, renderChildren) => `\n${INDENT.repeat(2)}<section className="grid gap-6 md:grid-cols-3">${renderChildren()}\n${INDENT.repeat(2)}</section>`,
  card: (node) => `\n${INDENT.repeat(3)}<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">${node.text ?? ''}</div>`,
  default: (node, renderChildren) => `\n${INDENT.repeat(3)}<div data-node-type="${node.type}">${node.text ?? ''}${renderChildren()}\n${INDENT.repeat(3)}</div>`,
};

function renderNode(node: LayoutNode, depth = 0): string {
  const renderer = defaultRenderers[node.type] ?? defaultRenderers.default;
  const renderChildren = () => node.children.map((child) => renderNode(child, depth + 1)).join('');
  return renderer(node, renderChildren);
}

export function generateReactComponent(ui: UIIR): string {
  const tree = renderNode(ui.layoutTree);
  return `import React from 'react';\n\nexport const GeneratedApp: React.FC = () => {\n${INDENT}return (${tree}\n${INDENT});\n};\n`;
}

export function generateNextPage(ui: UIIR): string {
  const component = generateReactComponent(ui);
  return `'use client';\n\n${component}\nexport default function Page() {\n${INDENT}return <GeneratedApp />;\n}\n`;
}

export function generateCode(ui: UIIR, options: GenerateOptions = {}): CodegenResult {
  const framework = options.framework ?? 'next';
  const files: GeneratedFileMap = {};
  if (framework === 'next') {
    files['app/page.tsx'] = generateNextPage(ui);
    files['app/layout.tsx'] = `import './globals.css';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n${INDENT}return (<html lang="zh-CN"><body>{children}</body></html>);\n}\n`;
    files['globals.css'] = `:root { --accent: ${ui.metadata?.accent ?? '#3b82f6'}; }\nbody { font-family: 'Inter', sans-serif; background: #f8fafc; }\n`;
  } else {
    files['src/App.tsx'] = generateReactComponent(ui);
    files['src/main.tsx'] = `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport { GeneratedApp } from './App';\n\nReactDOM.createRoot(document.getElementById('root')!).render(<GeneratedApp />);\n`;
    files['index.html'] = `<div id="root"></div>`;
  }
  return {
    files,
    entry: framework === 'next' ? 'app/page.tsx' : 'src/main.tsx',
    framework,
  };
}

export default generateCode;
