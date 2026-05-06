import BlockNoteEditor from './editor/BlockNoteEditor';
import TodoSidebar from './sidebar/TodoSidebar';
import ResizableDivider from './sidebar/ResizableDivider';
import { useAppStore } from '@/lib/store/appStore';

export default function MainLayout() {
  const bootId = useAppStore(s => s.bootId);
  const initialDoc = useAppStore(s => s.editorDoc);

  return (
    <div className="flex flex-row flex-1 min-h-0 items-stretch w-full">
      <BlockNoteEditor key={bootId} initialDoc={initialDoc} />
      <ResizableDivider />
      <TodoSidebar />
    </div>
  );
}
