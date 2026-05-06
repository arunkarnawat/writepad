import { useAppStore } from '@/lib/store/appStore';

export default function EditorFooter() {
  const words = useAppStore(s => s.wordCount.words);
  const chars = useAppStore(s => s.wordCount.chars);

  return (
    <footer className="editor-footer flex flex-row items-center justify-between px-5 py-1 border-t border-rule text-[0.80rem] text-fg-soft shrink-0">
      <div>{words} words · {chars} characters</div>
    </footer>
  );
}
