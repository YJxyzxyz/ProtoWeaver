import { z } from 'zod';

const componentTypes = [
  'page',
  'section',
  'stack',
  'grid',
  'text',
  'button',
  'input',
  'image',
  'card',
  'table',
  'list',
  'listItem',
  'form',
  'badge',
  'nav',
  'modal',
  'hero',
  'chart',
] as const;

const constraintSchema = z.object({
  minWidth: z.number().nonnegative().optional(),
  maxWidth: z.number().positive().optional(),
  minHeight: z.number().nonnegative().optional(),
  maxHeight: z.number().positive().optional(),
  horizontalAlign: z.enum(['start', 'center', 'end', 'stretch']).optional(),
  verticalAlign: z.enum(['start', 'center', 'end', 'stretch']).optional(),
  grow: z.number().min(0).max(1).optional(),
  shrink: z.number().min(0).max(1).optional(),
  order: z.number().optional(),
});

const eventSchema = z.object({
  id: z.string(),
  trigger: z.enum(['onClick', 'onSubmit', 'onChange', 'onMount', 'onHover']),
  action: z.object({
    type: z.enum(['navigate', 'emit', 'mutateState', 'openModal', 'closeModal']),
    payload: z.record(z.unknown()).optional(),
  }),
  description: z.string().optional(),
});

const componentBaseSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  type: z.enum(componentTypes),
  role: z.string().optional(),
  text: z.string().optional(),
  placeholder: z.string().optional(),
  media: z
    .object({
      url: z.string(),
      description: z.string().optional(),
    })
    .optional(),
  bindings: z.record(z.string(), z.string()).optional(),
  constraints: constraintSchema.optional(),
  layout: z
    .object({
      position: z.enum(['relative', 'absolute']).optional(),
      x: z.number().optional(),
      y: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
      padding: z.array(z.number()).length(4).optional(),
      margin: z.array(z.number()).length(4).optional(),
      gap: z.number().optional(),
      columns: z.number().positive().optional(),
      rows: z.number().positive().optional(),
      direction: z.enum(['row', 'column']).optional(),
      wrap: z.boolean().optional(),
    })
    .default({}),
  style: z
    .object({
      variant: z.string().optional(),
      emphasis: z.enum(['default', 'primary', 'secondary', 'danger', 'ghost']).optional(),
      tone: z.enum(['neutral', 'success', 'warning', 'error', 'info']).optional(),
      background: z.string().optional(),
      foreground: z.string().optional(),
      border: z
        .object({
          color: z.string().optional(),
          radius: z.number().optional(),
          width: z.number().optional(),
          style: z.enum(['solid', 'dashed', 'none']).optional(),
        })
        .optional(),
      shadow: z.string().optional(),
      typography: z
        .object({
          fontFamily: z.string().optional(),
          fontSize: z.number().optional(),
          fontWeight: z.string().optional(),
          letterSpacing: z.number().optional(),
          lineHeight: z.number().optional(),
          textAlign: z.enum(['left', 'center', 'right']).optional(),
        })
        .optional(),
    })
    .default({}),
  state: z
    .object({
      name: z.string().optional(),
      initialValue: z.unknown().optional(),
      bindings: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  events: z.array(eventSchema).default([]),
  children: z.lazy(() => z.array(componentBaseSchema)).default([]),
});

export const layoutNodeSchema = componentBaseSchema;
export type LayoutNode = z.infer<typeof layoutNodeSchema>;

export const assetSchema = z.object({
  id: z.string(),
  kind: z.enum(['image', 'audio', 'transcript', 'sketch']),
  uri: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const dataSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['static', 'rest', 'graphql', 'supabase', 'airtable', 'custom']),
  config: z.record(z.string(), z.unknown()),
  sample: z.unknown().optional(),
});

export const themeSchema = z.object({
  id: z.string().default('default'),
  name: z.string().default('ProtoWeaver Theme'),
  tokens: z
    .object({
      colors: z.record(z.string()).default({}),
      radii: z.record(z.number()).default({}),
      spacing: z.record(z.number()).default({}),
      typography: z
        .object({
          fontFamilies: z.record(z.string()).default({}),
          fontSizes: z.record(z.number()).default({}),
        })
        .default({}),
    })
    .default({}),
});

export const uiIRSchema = z.object({
  id: z.string(),
  version: z.string().default('0.1.0'),
  createdAt: z.string().or(z.date()).transform((value) => new Date(value)).default(new Date()),
  locale: z.string().default('zh-CN'),
  title: z.string().default('Generated Prototype'),
  description: z.string().optional(),
  layoutTree: layoutNodeSchema,
  assets: z.array(assetSchema).default([]),
  dataSources: z.array(dataSourceSchema).default([]),
  theme: themeSchema.default({ id: 'default', name: 'ProtoWeaver Theme' }),
  metadata: z
    .object({
      source: z.enum(['sketch', 'voice', 'mixed']).default('mixed'),
      author: z.string().optional(),
      tags: z.array(z.string()).default([]),
      revision: z.number().default(1),
    })
    .default({ source: 'mixed', revision: 1, tags: [] }),
});

export type UIIR = z.infer<typeof uiIRSchema>;

export type UIDiff = {
  targetId: string;
  op: 'replace' | 'remove' | 'insert' | 'update';
  payload?: Partial<LayoutNode>;
  position?: number;
};

export const diffSchema = z.object({
  targetId: z.string(),
  op: z.enum(['replace', 'remove', 'insert', 'update']),
  payload: layoutNodeSchema.partial().optional(),
  position: z.number().optional(),
});

export type UIIRPatch = z.infer<typeof diffSchema>;

export function applyPatch(tree: LayoutNode, patch: UIIRPatch): LayoutNode {
  if (tree.id === patch.targetId) {
    switch (patch.op) {
      case 'remove':
        throw new Error('Cannot remove the root node');
      case 'replace':
        return { ...tree, ...patch.payload } as LayoutNode;
      case 'update':
        return { ...tree, ...patch.payload } as LayoutNode;
      case 'insert':
        if (!patch.payload) {
          throw new Error('Insert patch requires payload');
        }
        return {
          ...tree,
          children: [patch.payload as LayoutNode, ...tree.children],
        };
      default:
        return tree;
    }
  }

  const nextChildren = tree.children.map((child) => applyPatch(child, patch));
  return { ...tree, children: nextChildren };
}

export function applyPatches(tree: LayoutNode, patches: UIIRPatch[]): LayoutNode {
  return patches.reduce((current, patch) => applyPatch(current, patch), tree);
}

export const sampleLayout: LayoutNode = {
  id: 'root',
  type: 'page',
  name: 'LandingPage',
  layout: {
    direction: 'column',
    gap: 24,
    padding: [32, 32, 32, 32],
  },
  children: [
    {
      id: 'hero',
      type: 'hero',
      text: 'ProtoWeaver — 从草图到可运行原型',
      style: {
        typography: {
          fontSize: 36,
          fontWeight: '700',
          textAlign: 'center',
        },
      },
      children: [
        {
          id: 'cta',
          type: 'button',
          text: '开始生成',
          style: {
            emphasis: 'primary',
          },
          events: [
            {
              id: 'cta-click',
              trigger: 'onClick',
              action: {
                type: 'navigate',
                payload: { href: '/app' },
              },
            },
          ],
        },
      ],
    },
    {
      id: 'features',
      type: 'section',
      layout: {
        direction: 'row',
        gap: 16,
      },
      children: Array.from({ length: 3 }).map((_, index) => ({
        id: `feature-${index + 1}`,
        type: 'card',
        text: '自动解析 UI 组件并生成代码',
        style: {
          background: 'white',
          shadow: 'md',
        },
      })),
    },
  ],
  events: [],
  style: {},
};

export const sampleUIIR: UIIR = {
  id: 'demo-project',
  title: 'ProtoWeaver Demo',
  description: '从草图和语音描述生成的演示页面',
  layoutTree: sampleLayout,
  assets: [
    {
      id: 'asset-sketch-1',
      kind: 'sketch',
      uri: 'https://example.com/sketch.png',
    },
    {
      id: 'asset-transcript-1',
      kind: 'transcript',
      uri: 'https://example.com/transcript.txt',
      metadata: {
        text: 'Hero 标题写 ProtoWeaver，添加一个 CTA 按钮以及三个特性卡片',
      },
    },
  ],
  dataSources: [
    {
      id: 'static-content',
      name: 'Static content',
      type: 'static',
      config: {},
      sample: {
        features: [
          {
            title: '草图解析',
            description: '自动检测按钮、输入框、表格等组件',
          },
          {
            title: '语音理解',
            description: '从语音描述中抽取主题与交互需求',
          },
        ],
      },
    },
  ],
  theme: {
    id: 'default',
    name: 'ProtoWeaver Theme',
    tokens: {
      colors: {
        primary: '#3b82f6',
        secondary: '#1e293b',
        accent: '#f97316',
      },
      radii: {
        sm: 4,
        md: 8,
        lg: 16,
      },
      spacing: {
        sm: 8,
        md: 16,
        lg: 24,
      },
      typography: {
        fontFamilies: {
          body: 'Inter, sans-serif',
          heading: 'DM Sans, sans-serif',
        },
        fontSizes: {
          sm: 14,
          md: 16,
          lg: 20,
          xl: 32,
        },
      },
    },
  },
  metadata: {
    source: 'mixed',
    revision: 1,
    tags: ['demo', 'landing'],
  },
  version: '0.1.0',
  createdAt: new Date(),
  locale: 'zh-CN',
};

export function flattenLayout(tree: LayoutNode): LayoutNode[] {
  return [tree, ...tree.children.flatMap((child) => flattenLayout(child))];
}

export function findNode(tree: LayoutNode, id: string): LayoutNode | null {
  if (tree.id === id) {
    return tree;
  }

  for (const child of tree.children) {
    const result = findNode(child, id);
    if (result) {
      return result;
    }
  }

  return null;
}

export function toJSON(ui: UIIR): string {
  return JSON.stringify(ui, (_key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }, 2);
}

export function fromJSON(json: string): UIIR {
  const parsed = JSON.parse(json);
  return uiIRSchema.parse(parsed);
}

export default uiIRSchema;
