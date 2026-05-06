import { useEffect, type ReactNode } from 'react';

interface Props {
  onClose: () => void;
  title?: string;
  wide?: boolean;
  children: ReactNode;
}

export default function Modal({ onClose, title, wide, children }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[4px] animate-[fade-in_200ms_ease]"
      onClick={onClose}
    >
      <div
        className={[
          'flex flex-col w-[90%] min-h-[300px] max-h-[80vh] overflow-hidden',
          'rounded-lg bg-bg-elevated shadow-pop animate-[slide-up_200ms_ease]',
          wide ? 'max-w-[640px]' : 'max-w-[500px]',
        ].join(' ')}
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-rule shrink-0">
          <h2 className="font-ui text-base font-semibold text-fg">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center bg-transparent border-0 text-fg-soft cursor-pointer p-1.5 rounded-sm transition-[background-color,color] duration-150 hover:bg-bg-subtle hover:text-fg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
