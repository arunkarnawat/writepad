import { encode } from '@/lib/persistence/urlHash';
import { STORAGE_KEY_PREFIX } from '@/lib/config';
import { getAppStateSnapshot, useAppStore } from './appStore';

let persistTimeout: ReturnType<typeof setTimeout> | undefined;
let unsubscribe: (() => void) | undefined;

export function startPersistSubscription() {
  stopPersistSubscription();
  unsubscribe = useAppStore.subscribe((state, prev) => {
    if (prev) {
      if (state.theme !== prev.theme) {
        localStorage.setItem(STORAGE_KEY_PREFIX + 'theme', JSON.stringify(state.theme));
      }
      if (state.ui !== prev.ui) {
        localStorage.setItem(STORAGE_KEY_PREFIX + 'sidebarWidth', state.ui.sidebarWidth.toString());
        localStorage.setItem(STORAGE_KEY_PREFIX + 'sidebarCollapsed', state.ui.sidebarCollapsed ? '1' : '0');
      }
    }

    const docChanged = !prev || state.editorDoc !== prev.editorDoc;
    const todosChanged = !prev || state.todos !== prev.todos;
    const themeChanged = !prev || state.theme !== prev.theme;
    if (!docChanged && !todosChanged && !themeChanged) return;

    clearTimeout(persistTimeout);
    persistTimeout = setTimeout(async () => {
      const hash = await encode(getAppStateSnapshot());
      if (hash) {
        history.replaceState(null, '', '#' + hash);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'lastDoc', hash);
        localStorage.setItem(STORAGE_KEY_PREFIX + 'lastDocAt', new Date().toISOString());
      }
    }, 500);
  });
}

export function stopPersistSubscription() {
  clearTimeout(persistTimeout);
  unsubscribe?.();
  unsubscribe = undefined;
}
