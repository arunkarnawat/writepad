import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store/appStore';
import { Button } from '../shared/Button';

const MOBILE_QUERY = '(max-width: 900px)';

export default function MobileSidebarToggle() {
  const ui = useAppStore(s => s.ui);
  const patchUi = useAppStore(s => s.patchUi);

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const isOpen = isMobile ? ui.mobileSidebarOpen : !ui.sidebarCollapsed;

  const toggle = () => {
    if (isMobile) {
      patchUi({ mobileSidebarOpen: !ui.mobileSidebarOpen });
    } else {
      patchUi({ sidebarCollapsed: !ui.sidebarCollapsed });
    }
  };

  return (
    <Button
      variant="default"
      size="icon"
      onClick={toggle}
      title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      aria-label={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      aria-pressed={isOpen}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="15" y1="4" x2="15" y2="20" />
      </svg>
    </Button>
  );
}
