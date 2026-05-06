import { useAppStore } from '@/lib/store/appStore';

export default function ModeToggle() {
  const mode = useAppStore(s => s.ui.mode);
  const patchUi = useAppStore(s => s.patchUi);

  const setMode = (next: 'write' | 'view') => {
    if (mode === next) return;
    patchUi({ mode: next, sidebarCollapsed: next === 'view' });
  };

  const segBtn =
    'h-6 rounded-sm border-0 bg-transparent px-3 font-ui text-[12px] font-medium ' +
    'text-fg-soft cursor-pointer transition-[background-color,color,box-shadow] duration-150 ' +
    'hover:text-fg aria-pressed:bg-bg-elevated aria-pressed:text-fg ' +
    'aria-pressed:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_1px_1px_rgba(0,0,0,0.04)]';

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-md border border-rule bg-bg-subtle p-0.5 shrink-0"
      role="group"
      aria-label="Editor mode"
    >
      <button
        type="button"
        className={segBtn}
        onClick={() => setMode('write')}
        aria-pressed={mode === 'write'}
      >
        Edit
      </button>
      <button
        type="button"
        className={segBtn}
        onClick={() => setMode('view')}
        aria-pressed={mode === 'view'}
      >
        View
      </button>
    </div>
  );
}
