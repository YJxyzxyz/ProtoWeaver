'use client';

import { UploadPanel } from '@/components/upload-panel';
import { PreviewPane } from '@/components/preview-pane';
import { ChatPanel } from '@/components/chat-panel';
import { usePrototype } from '@/hooks/use-prototype';

export default function StudioPage() {
  const { state, create, iterate } = usePrototype();

  return (
    <div className="flex flex-col gap-8">
      <UploadPanel loading={state.loading} error={state.error} onGenerate={create} />
      <PreviewPane project={state.project} />
      <ChatPanel project={state.project} loading={state.loading} onIterate={iterate} />
    </div>
  );
}
