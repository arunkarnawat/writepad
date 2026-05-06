import { create } from 'zustand';
import type { Block } from '@blocknote/core';
import type { AppState, ThemeState, Todo, UIState } from '@/lib/schema/types';
import { createMockDocument, DEFAULT_UI } from '@/lib/schema/defaults';
import { firstHeadingTitle, wordStatsFromDoc } from '@/lib/blocknote/docMeta';

const mock = createMockDocument();

export interface AppStoreState {
  /** Incremented on full `replaceAppState` so the editor remounts with new URL content */
  bootId: number;
  editorDoc: Block[];
  todos: Todo[];
  theme: ThemeState;
  ui: UIState;
  /** Bumped every 30s for relative todo times */
  nowTick: number;
  documentTitle: string;
  wordCount: { words: number; chars: number };
  setEditorDoc: (doc: Block[]) => void;
  setTodos: (todos: Todo[] | ((prev: Todo[]) => Todo[])) => void;
  setTheme: (theme: ThemeState) => void;
  patchUi: (patch: Partial<UIState>) => void;
  replaceAppState: (state: AppState) => void;
}

function computeMeta(doc: Block[]) {
  return {
    documentTitle: firstHeadingTitle(doc),
    wordCount: wordStatsFromDoc(doc),
  };
}

const initialMeta = computeMeta(mock.doc);

export const useAppStore = create<AppStoreState>(set => ({
  bootId: 0,
  editorDoc: mock.doc,
  todos: mock.todos,
  theme: mock.theme,
  ui: DEFAULT_UI,
  nowTick: Date.now(),
  documentTitle: initialMeta.documentTitle,
  wordCount: initialMeta.wordCount,

  setEditorDoc: doc =>
    set(() => ({
      editorDoc: doc,
      ...computeMeta(doc),
    })),

  setTodos: next =>
    set(s => ({
      todos: typeof next === 'function' ? (next as (p: Todo[]) => Todo[])(s.todos) : next,
    })),

  setTheme: theme => set({ theme }),

  patchUi: patch =>
    set(s => ({
      ui: { ...s.ui, ...patch },
    })),

  replaceAppState: state =>
    set(s => ({
      editorDoc: state.doc,
      todos: state.todos,
      theme: state.theme,
      bootId: s.bootId + 1,
      ...computeMeta(state.doc),
    })),
}));

export function getAppStateSnapshot(): AppState {
  const s = useAppStore.getState();
  return { v: 2, doc: s.editorDoc, todos: s.todos, theme: s.theme };
}

export function tickRelativeTime() {
  useAppStore.setState({ nowTick: Date.now() });
}
