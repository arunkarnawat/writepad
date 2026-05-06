import type { Block } from '@blocknote/core';

// ── Todo (sidebar) ───────────────────────────────────────────────────────────
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  createdAt: number;
}

// ── Theme ──────────────────────────────────────────────────────────────────
export type ThemePreset = 'paper' | 'midnight' | 'ghibli' | 'forest' | 'sunset';

export interface CustomOverrides {
  '--color-bg'?: string;
  '--color-fg'?: string;
  '--color-primary'?: string;
  '--font-body'?: string;
}

export interface ThemeState {
  preset: ThemePreset;
  overrides: CustomOverrides;
}

// ── UI ─────────────────────────────────────────────────────────────────────
export interface UIState {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  mode: 'write' | 'view';
  helpOpen: boolean;
}

// ── Root document state (BlockNote) ─────────────────────────────────────────
export interface AppState {
  v: 2;
  /** BlockNote top-level blocks (JSON-serializable snapshot) */
  doc: Block[];
  todos: Todo[];
  theme: ThemeState;
}
