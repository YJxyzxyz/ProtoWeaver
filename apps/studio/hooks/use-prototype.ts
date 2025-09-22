import { useCallback, useState } from 'react';
import type { GenerateResponse } from '@/lib/api';
import { generatePrototype, iterateProject } from '@/lib/api';

export interface PrototypeState {
  loading: boolean;
  project?: GenerateResponse;
  error?: string;
}

export function usePrototype() {
  const [state, setState] = useState<PrototypeState>({ loading: false });

  const create = useCallback(async (formData: FormData): Promise<GenerateResponse> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      const result = await generatePrototype(formData);
      setState({ loading: false, project: result });
      return result;
    } catch (error) {
      const message = (error as Error).message;
      setState((prev) => ({ ...prev, loading: false, error: message }));
      throw error;
    }
  }, []);

  const iterate = useCallback(
    async (message: string): Promise<GenerateResponse> => {
      if (!state.project) {
        throw new Error('尚未生成项目');
      }
      setState((prev) => ({ ...prev, loading: true, error: undefined }));
      try {
        const result = await iterateProject(state.project.projectId, message);
        setState({ loading: false, project: result });
        return result;
      } catch (error) {
        const message = (error as Error).message;
        setState((prev) => ({ ...prev, loading: false, error: message }));
        throw error;
      }
    },
    [state.project],
  );

  return { state, create, iterate };
}
