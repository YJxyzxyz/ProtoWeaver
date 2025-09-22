import { describe, expect, it } from 'vitest';
import { sampleUIIR } from '@protoweaver/ui-ir';
import { generateCode, generateNextPage, generateReactComponent } from './index';

describe('codegen', () => {
  it('renders react component', () => {
    const code = generateReactComponent(sampleUIIR);
    expect(code).toContain('GeneratedApp');
    expect(code).toContain('ProtoWeaver');
  });

  it('renders next page', () => {
    const page = generateNextPage(sampleUIIR);
    expect(page).toContain("'use client'");
    expect(page).toContain('GeneratedApp');
  });

  it('generates file map', () => {
    const result = generateCode(sampleUIIR, { framework: 'next' });
    expect(Object.keys(result.files)).toContain('app/page.tsx');
    expect(result.framework).toBe('next');
  });
});
