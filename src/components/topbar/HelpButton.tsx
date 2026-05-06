import { useAppStore } from '@/lib/store/appStore';
import { Button } from '../shared/Button';

export default function HelpButton() {
  const patchUi = useAppStore(s => s.patchUi);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => patchUi({ helpOpen: true })}
      title="Help"
      aria-label="Open help"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4.5" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    </Button>
  );
}
