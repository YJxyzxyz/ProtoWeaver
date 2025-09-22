#!/usr/bin/env node
import { Command } from 'commander';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Blob, FormData, fetch } from 'undici';
import { sampleUIIR, toJSON, UIIR } from '@protoweaver/ui-ir';

async function callApi<T>(
  endpoint: string,
  options: { method?: 'GET' | 'POST'; body?: Record<string, unknown> | FormData } = {},
): Promise<T> {
  const baseUrl = process.env.PROTOWEAVER_API_URL ?? 'http://localhost:8000';
  const url = `${baseUrl}${endpoint}`;
  const isFormData = options.body instanceof FormData;
  const response = await fetch(url, {
    method: options.method ?? 'POST',
    headers: isFormData
      ? undefined
      : {
          'Content-Type': 'application/json',
        },
    body: isFormData
      ? (options.body as FormData)
      : options.body
      ? JSON.stringify(options.body)
      : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${url} responded with ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

async function ensureDir(filePath: string) {
  await mkdir(path.dirname(filePath), { recursive: true });
}

async function generatePrototype(options: {
  sketch: string;
  audio?: string;
  transcript?: string;
  out: string;
}) {
  const form = new FormData();
  form.append('sketch', new Blob([await readFile(options.sketch)]), path.basename(options.sketch));

  if (options.audio) {
    form.append('audio', new Blob([await readFile(options.audio)]), path.basename(options.audio));
  }

  if (options.transcript) {
    form.append('transcript', options.transcript);
  }

  const result = await callApi<{ project_id: string; ui_ir: UIIR; code_bundle: { framework: string; entry: string; files: Record<string, string> } }>(
    '/v1/projects',
    {
      body: form,
    },
  );

  const outputDir = options.out;
  await ensureDir(path.join(outputDir, 'ui-ir.json'));
  await writeFile(path.join(outputDir, 'ui-ir.json'), toJSON(result.ui_ir), 'utf-8');

  for (const [filePath, content] of Object.entries(result.code_bundle.files)) {
    const target = path.join(outputDir, filePath);
    await ensureDir(target);
    await writeFile(target, content, 'utf-8');
  }

  return result;
}

async function exportSample(out: string) {
  const target = path.join(out, 'sample-ui-ir.json');
  await ensureDir(target);
  await writeFile(target, toJSON(sampleUIIR), 'utf-8');
}

const program = new Command();
program
  .name('protoweaver')
  .description('CLI 工具：从草图 + 语音生成 React 原型，或对项目进行迭代')
  .version('0.1.0');

program
  .command('generate')
  .description('上传草图与语音到 ProtoWeaver 服务，生成新的原型')
  .requiredOption('-s, --sketch <path>', '草图图片路径 (.png/.jpg)')
  .option('-a, --audio <path>', '语音描述路径 (.wav/.m4a)')
  .option('-t, --transcript <text>', '语音文本（可选，用于跳过 ASR）')
  .option('-o, --out <dir>', '输出目录', '.')
  .action(async (cmdOptions) => {
    try {
      const result = await generatePrototype(cmdOptions);
      console.log(`✅ 生成完成 Project ID: ${result.project_id}`);
      console.log(`📁 已写入目录: ${cmdOptions.out}`);
    } catch (error) {
      console.error('❌ 生成失败', error);
      process.exitCode = 1;
    }
  });

program
  .command('sample')
  .description('导出内置 Demo UI-IR JSON，方便调试渲染器')
  .option('-o, --out <dir>', '输出目录', '.')
  .action(async (cmdOptions) => {
    await exportSample(cmdOptions.out);
    console.log(`已导出 sample-ui-ir.json 到 ${cmdOptions.out}`);
  });

program
  .command('patch')
  .description('向后端发送自然语言修改请求，生成 UI-IR Diff 并更新代码')
  .requiredOption('-i, --id <projectId>', '要迭代的项目 ID')
  .requiredOption('-m, --message <text>', '自然语言修改指令')
  .action(async (cmdOptions) => {
    try {
      const result = await callApi<{ project_id: string; ui_ir: UIIR; diff: unknown; code_bundle: { files: Record<string, string> } }>(
        `/v1/projects/${cmdOptions.id}/iterate`,
        {
          method: 'POST',
          body: {
            message: cmdOptions.message,
          },
        },
      );
      console.log(`✅ 已生成新的版本: ${result.project_id}`);
      console.log(`🔁 Diff: ${JSON.stringify(result.diff, null, 2)}`);
    } catch (error) {
      console.error('❌ Patch 请求失败', error);
      process.exitCode = 1;
    }
  });

program
  .command('preview')
  .description('调用前端预览服务，打开热加载的 iframe 预览')
  .option('--port <port>', '预览服务端口', '3001')
  .action(async (cmdOptions) => {
    const previewUrl = `http://localhost:${cmdOptions.port}`;
    console.log(`请在浏览器打开 ${previewUrl} 查看实时预览`);
  });

program.parseAsync(process.argv);
