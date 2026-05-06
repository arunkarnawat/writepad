import { useEffect, useRef } from 'react';
import type { Block } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { useAppStore } from '@/lib/store/appStore';
import EditorFooter from './EditorFooter';

interface Props {
  initialDoc: Block[];
}

export default function BlockNoteEditor({ initialDoc }: Props) {
  const mode = useAppStore(s => s.ui.mode);
  const setEditorDoc = useAppStore(s => s.setEditorDoc);

  const editor = useCreateBlockNote({
    initialContent: initialDoc.length
      ? initialDoc
      : [{ type: 'heading', props: { level: 1 }, content: [] }],
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = editor.onChange(() => {
      const blocks = editor.document;
      if (blocks.length === 1) {
        const only = blocks[0];
        const isEmpty = Array.isArray(only.content) && only.content.length === 0;
        if (isEmpty && only.type === 'paragraph') {
          editor.updateBlock(only, { type: 'heading', props: { level: 1 } });
          return;
        }
      }
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setEditorDoc(editor.document as Block[]);
      }, 200);
    });
    return () => {
      unsubscribe?.();
      clearTimeout(debounceRef.current);
    };
  }, [editor, setEditorDoc]);

  return (
    <main
      className="flex flex-col flex-1 min-w-0 min-h-0 h-full bg-bg relative overflow-hidden"
      data-mode={mode}
    >
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-[1280px] mx-auto pt-12 pb-[120px] px-[clamp(40px,6vw,120px)]">
          <div className="bn-shadcn min-h-[40vh] font-body">
            <BlockNoteView editor={editor} editable={mode === 'write'} />
          </div>
        </div>
      </div>
      <EditorFooter />
    </main>
  );
}
