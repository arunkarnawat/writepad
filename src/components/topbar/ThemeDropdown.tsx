import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import type { ThemePreset } from '@/lib/schema/types';
import { Button } from '../shared/Button';

interface PresetEntry {
  id: ThemePreset;
  label: string;
  bg: string;
  fg: string;
}

const PRESETS: PresetEntry[] = [
  { id: 'paper', label: 'Paper', bg: '#faf8f5', fg: '#1a1714' },
  { id: 'midnight', label: 'Midnight', bg: '#0f1117', fg: '#e8eaf0' },
  { id: 'ghibli', label: 'Ghibli', bg: '#f0ebe0', fg: '#2d2416' },
  { id: 'forest', label: 'Forest', bg: '#1a2218', fg: '#d4e0ce' },
  { id: 'sunset', label: 'Sunset', bg: '#fdf5ee', fg: '#1a0e08' },
];

export default function ThemeDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const theme = useAppStore(s => s.theme);
  const setTheme = useAppStore(s => s.setTheme);

  useEffect(() => {
    if (!open) return;
    const onClickOut = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOut);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOut);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const select = (id: ThemePreset) => {
    setTheme({ ...theme, preset: id });
    setOpen(false);
  };

  const current = PRESETS.find(p => p.id === theme.preset) ?? PRESETS[0];

  return (
    <div className="relative" ref={wrapRef}>
      <Button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Theme"
      >
        <span
          className="inline-block w-3.5 h-3.5 rounded shrink-0 border-[1.5px]"
          style={{ backgroundColor: current.bg, borderColor: current.fg }}
          aria-hidden="true"
        />
        {/* <span className="font-medium max-[1100px]:hidden">{current.label}</span> */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-[1000] flex min-w-[180px] flex-col gap-0.5 rounded-md border border-rule bg-bg-elevated p-1.5 shadow-pop animate-[dropdown_120ms_ease-out]"
        >
          {PRESETS.map(p => {
            const isActive = p.id === theme.preset;
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => select(p.id)}
                className={[
                  'flex w-full items-center gap-2.5 rounded-sm border-0 bg-transparent px-2.5 py-2 text-left font-ui text-[13px] text-fg cursor-pointer hover:bg-bg-subtle',
                  isActive ? 'bg-bg-subtle' : '',
                ].join(' ')}
              >
                <span
                  className="inline-block w-3.5 h-3.5 rounded shrink-0 border-[1.5px]"
                  style={{ backgroundColor: p.bg, borderColor: p.fg }}
                  aria-hidden="true"
                />
                <span className="flex-1 font-medium">{p.label}</span>
                {isActive && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-primary shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
