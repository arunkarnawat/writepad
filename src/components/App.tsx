import { useEffect, useState } from 'react';
import type { PartialBlock } from '@blocknote/core';
import { useAppStore, tickRelativeTime } from '@/lib/store/appStore';
import { startPersistSubscription, stopPersistSubscription } from '@/lib/store/persistSubscription';
import { decode } from '@/lib/persistence/urlHash';
import { STORAGE_KEY_PREFIX } from '@/lib/config';
import type { AppState } from '@/lib/schema/types';
import TopBar from './topbar/TopBar';
import MainLayout from './MainLayout';
import HelpModal from './topbar/HelpModal';

const NOW_TICK_INTERVAL_MS = 30_000;

const FRESH_DOC = [
  { type: 'heading', props: { level: 1 }, content: [] },
] as PartialBlock[] as AppState['doc'];

export default function App() {
  const [ready, setReady] = useState(false);
  const theme = useAppStore(s => s.theme);
  const ui = useAppStore(s => s.ui);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const rawTheme = localStorage.getItem(STORAGE_KEY_PREFIX + 'theme');
      if (rawTheme) {
        try {
          useAppStore.getState().setTheme(JSON.parse(rawTheme));
        } catch {
          /* ignore */
        }
      }

      const rawMode = localStorage.getItem(STORAGE_KEY_PREFIX + 'mode');
      if (rawMode) {
        useAppStore.getState().patchUi({ mode: rawMode as 'write' | 'view' });
      }

      const rawWidth = localStorage.getItem(STORAGE_KEY_PREFIX + 'sidebarWidth');
      if (rawWidth) {
        const parsed = parseFloat(rawWidth);
        if (!Number.isNaN(parsed)) {
          useAppStore.getState().patchUi({ sidebarWidth: Math.max(20, Math.min(60, parsed)) });
        }
      }

      const rawCollapsed = localStorage.getItem(STORAGE_KEY_PREFIX + 'sidebarCollapsed');
      if (rawCollapsed === '1') {
        useAppStore.getState().patchUi({ sidebarCollapsed: true });
      }

      const rawHash = window.location.hash.startsWith('#')
        ? window.location.hash.slice(1)
        : window.location.hash;
      const isNew = rawHash === 'new';

      let doc: AppState | null = null;
      if (isNew) {
        doc = {
          v: 2,
          doc: FRESH_DOC,
          todos: [],
          theme: useAppStore.getState().theme,
        };
      } else {
        doc = await decode(window.location.hash);
        if (!doc) {
          const backup = localStorage.getItem(STORAGE_KEY_PREFIX + 'lastDoc');
          if (backup) {
            doc = await decode(backup);
          }
        }
      }

      if (doc) {
        useAppStore.getState().replaceAppState(doc);
      }

      if (!cancelled) {
        startPersistSubscription();
        setReady(true);
      }
    }

    void hydrate();
    return () => {
      cancelled = true;
      stopPersistSubscription();
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.preset);
    document.documentElement.setAttribute('data-mode', ui.mode);
  }, [theme.preset, ui.mode]);

  useEffect(() => {
    const id = window.setInterval(tickRelativeTime, NOW_TICK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  if (!ready) return null;

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <TopBar />
      <MainLayout />
      {ui.helpOpen && <HelpModal />}
    </div>
  );
}
