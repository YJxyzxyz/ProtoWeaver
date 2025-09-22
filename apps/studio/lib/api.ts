import type { UIIR } from '@protoweaver/ui-ir';

export interface GenerateResponse {
  projectId: string;
  uiIR: UIIR;
  codeBundle: {
    framework: string;
    entry: string;
    files: Record<string, string>;
  };
}

interface ApiResponse {
  project_id: string;
  ui_ir: UIIR;
  code_bundle: {
    framework: string;
    entry: string;
    files: Record<string, string>;
  };
}

function mapResponse(data: ApiResponse): GenerateResponse {
  return {
    projectId: data.project_id,
    uiIR: data.ui_ir,
    codeBundle: data.code_bundle,
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8000';

export async function generatePrototype(payload: FormData): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE}/v1/projects`, {
    method: 'POST',
    body: payload,
  });
  if (!response.ok) {
    throw new Error(`生成失败: ${response.status}`);
  }
  return mapResponse((await response.json()) as ApiResponse);
}

export async function iterateProject(projectId: string, message: string): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE}/v1/projects/${projectId}/iterate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new Error(`迭代失败: ${response.status}`);
  }
  return mapResponse((await response.json()) as ApiResponse);
}
