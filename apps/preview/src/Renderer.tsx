import { LayoutNode } from '@protoweaver/ui-ir';
import { Fragment } from 'react';

interface RendererProps {
  node: LayoutNode;
}

const componentClassMap: Record<string, string> = {
  page: 'flex min-h-screen flex-col gap-12 bg-slate-100 p-12 text-slate-900',
  hero: 'flex flex-col items-center gap-6 rounded-3xl bg-white/80 p-12 shadow-lg backdrop-blur',
  section: 'grid gap-6 md:grid-cols-3',
  card: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
  button: 'inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg',
};

function renderChildren(node: LayoutNode) {
  return node.children.map((child) => <Renderer key={child.id} node={child} />);
}

export function Renderer({ node }: RendererProps) {
  if (node.type === 'text') {
    return <p>{node.text}</p>;
  }

  if (node.type === 'button') {
    return <button className={componentClassMap.button}>{node.text ?? '按钮'}</button>;
  }

  const className = componentClassMap[node.type] ?? 'rounded-xl border border-dashed border-slate-300 p-4';

  return (
    <div className={className}>
      {node.text && <h3 className="text-lg font-semibold text-slate-900">{node.text}</h3>}
      {renderChildren(node)}
    </div>
  );
}

export function PreviewTree({ root }: { root: LayoutNode }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      {root.children.map((child) => (
        <Fragment key={child.id}>
          <Renderer node={child} />
        </Fragment>
      ))}
    </div>
  );
}
