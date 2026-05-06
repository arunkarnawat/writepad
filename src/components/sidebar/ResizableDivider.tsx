import { useCallback, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store/appStore';

const MIN_PCT = 20;
const MAX_PCT = 60;
const DEFAULT_PCT = 25;

export default function ResizableDivider() {
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);
  const sidebarCollapsed = useAppStore(s => s.ui.sidebarCollapsed);
  const sidebarWidth = useAppStore(s => s.ui.sidebarWidth);
  const patchUi = useAppStore(s => s.patchUi);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingRef.current = true;
    setIsDragging(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      const pct = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
      const clamped = Math.max(MIN_PCT, Math.min(MAX_PCT, pct));
      const rounded = Math.round(clamped * 10) / 10;
      if (rounded !== sidebarWidth) {
        patchUi({ sidebarWidth: rounded });
      }
    },
    [patchUi, sidebarWidth],
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    draggingRef.current = false;
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const onDoubleClick = useCallback(() => {
    patchUi({ sidebarWidth: DEFAULT_PCT });
  }, [patchUi]);

  if (sidebarCollapsed) return null;

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      className={[
        'relative w-1.5 z-10 shrink-0 self-stretch transition-colors duration-150 cursor-col-resize',
        'after:content-[""] after:absolute after:-left-[5px] after:-right-[5px] after:top-0 after:bottom-0',
        'hover:bg-primary-soft max-[900px]:hidden',
        isDragging ? 'bg-primary-soft' : 'bg-transparent',
      ].join(' ')}
    />
  );
}
