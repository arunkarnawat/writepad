import { useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import { exportTxt, downloadFile } from '@/lib/export/txt';
import { exportMd } from '@/lib/export/md';
import { exportHtml } from '@/lib/export/html';
import { Button } from '../shared/Button';

type ExportType = 'txt' | 'md' | 'html' | 'pdf';

const OPTIONS: { id: ExportType; label: string; hint: string }[] = [
  { id: 'txt', label: 'Plain text', hint: '.txt' },
  { id: 'md', label: 'Markdown', hint: '.md' },
  { id: 'html', label: 'HTML', hint: '.html' },
  { id: 'pdf', label: 'PDF', hint: '.pdf' },
];

export default function DownloadMenu() {
  const [open, setOpen] = useState(false);
  const [pendingPdf, setPendingPdf] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const editorDoc = useAppStore(s => s.editorDoc);
  const documentTitle = useAppStore(s => s.documentTitle);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const onDownload = async (type: ExportType) => {
    const title = documentTitle || 'document';
    try {
      switch (type) {
        case 'txt':
          downloadFile(exportTxt(editorDoc), `${title}.txt`, 'text/plain');
          break;
        case 'md':
          downloadFile(exportMd(editorDoc), `${title}.md`, 'text/markdown');
          break;
        case 'html':
          downloadFile(exportHtml(editorDoc, title), `${title}.html`, 'text/html');
          break;
        case 'pdf': {
          setPendingPdf(true);
          const { exportPdfBlob, downloadPdf } = await import('@/lib/export/pdf');
          const blob = await exportPdfBlob(editorDoc, { title });
          downloadPdf(blob, title);
          break;
        }
      }
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      if (type === 'pdf') setPendingPdf(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        title="Download"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="max-[1100px]:hidden">Download</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-[1000] flex min-w-[200px] flex-col gap-0.5 rounded-md border border-rule bg-bg-elevated p-1.5 shadow-pop animate-[dropdown_120ms_ease-out]"
        >
          {OPTIONS.map(opt => {
            const busy = opt.id === 'pdf' && pendingPdf;
            return (
              <button
                key={opt.id}
                role="menuitem"
                type="button"
                onClick={() => onDownload(opt.id)}
                disabled={busy}
                className="flex w-full items-center justify-between gap-3 rounded-sm border-0 bg-transparent px-3 py-2 text-left font-ui text-[13px] text-fg cursor-pointer hover:bg-bg-subtle disabled:opacity-60 disabled:cursor-progress"
              >
                <span className="flex-1 text-left font-medium">{opt.label}</span>
                <span className="text-fg-faint text-[12px] tabular-nums">
                  {busy ? 'Generating…' : opt.hint}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
