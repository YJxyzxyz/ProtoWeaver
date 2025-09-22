import { describe, expect, it } from 'vitest';
import { applyPatch, applyPatches, findNode, flattenLayout, sampleUIIR, uiIRSchema } from './index';

describe('ui-ir schema', () => {
  it('parses sample ui ir', () => {
    const result = uiIRSchema.parse(sampleUIIR);
    expect(result.layoutTree.id).toBe('root');
  });

  it('flattens layout tree', () => {
    const flat = flattenLayout(sampleUIIR.layoutTree);
    expect(flat.length).toBeGreaterThan(1);
  });

  it('finds node', () => {
    const node = findNode(sampleUIIR.layoutTree, 'cta');
    expect(node?.type).toBe('button');
  });

  it('applies patches immutably', () => {
    const patched = applyPatch(sampleUIIR.layoutTree, {
      targetId: 'cta',
      op: 'update',
      payload: { text: '立即体验' },
    });
    expect(findNode(patched, 'cta')?.text).toBe('立即体验');
  });

  it('applies multiple patches', () => {
    const patched = applyPatches(sampleUIIR.layoutTree, [
      { targetId: 'cta', op: 'update', payload: { text: '立即体验' } },
      { targetId: 'hero', op: 'update', payload: { text: '欢迎使用 ProtoWeaver' } },
    ]);
    expect(findNode(patched, 'cta')?.text).toBe('立即体验');
    expect(findNode(patched, 'hero')?.text).toBe('欢迎使用 ProtoWeaver');
  });
});
