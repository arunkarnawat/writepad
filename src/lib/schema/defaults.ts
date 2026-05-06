import type { AppState, UIState, ThemeState, Todo } from './types';
import type { PartialBlock } from '@blocknote/core';

export const DEFAULT_THEME: ThemeState = {
  preset: 'paper',
  overrides: {},
};

export const DEFAULT_UI: UIState = {
  sidebarWidth: 25,
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  mode: 'write',
  helpOpen: false,
};

export function createMockDocument(): AppState {
  const now = Date.now();
  const todos: Todo[] = [
    { id: 't1', text: '📝 Create your first note', completed: false, order: 0, createdAt: now },
    { id: 't2', text: '✨ Add a title and a few lines', completed: false, order: 1, createdAt: now },
  ];

  const doc: PartialBlock[] = [
    { type: 'heading', props: { level: 1 }, content: [{ type: 'text', text: 'Welcome to Writepad 👋', styles: {} }] },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'A private, URL-first editor for modern note-taking. Everything lives in your browser — no account, no server.', styles: {} }],
    },
    {
      type: 'paragraph',
      content: [{ type: 'text', text: 'This is your space to write ideas, plans, and notes — fast and beautifully.', styles: {} }],
    },

    { type: 'heading', props: { level: 2 }, content: [{ type: 'text', text: '🚀 Getting started', styles: {} }] },
    {
      type: 'numberedListItem',
      content: [
        { type: 'text', text: 'Click the title above and rename it — every great note starts with a clear heading.', styles: {} },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        { type: 'text', text: 'Type ', styles: {} },
        { type: 'text', text: '/', styles: { bold: true } },
        { type: 'text', text: ' anywhere to open the slash menu and insert headings, lists, quotes, images, and more.', styles: {} },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        { type: 'text', text: 'Select any text to bring up the formatting toolbar — make it ', styles: {} },
        { type: 'text', text: 'bold', styles: { bold: true } },
        { type: 'text', text: ', ', styles: {} },
        { type: 'text', text: 'italic', styles: { italic: true } },
        { type: 'text', text: ', add a link, change the color, and more.', styles: {} },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        { type: 'text', text: 'Use the Todo list on the right to capture what you want to do next ✅', styles: {} },
      ],
    },

    { type: 'heading', props: { level: 2 }, content: [{ type: 'text', text: '✨ Features', styles: {} }] },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [{ type: 'text', text: '🔗 Shareable URLs — your whole document fits inside the link', styles: {} }],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [{ type: 'text', text: '📤 Export to PDF, HTML, Markdown, or plain text in one click', styles: {} }],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [{ type: 'text', text: '🎨 Five beautiful themes — Paper, Midnight, Ghibli, Forest, Sunset', styles: {} }],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [{ type: 'text', text: '🔒 Fully private — your notes never leave your device', styles: {} }],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [{ type: 'text', text: '✅ Built-in Todo sidebar to keep your tasks beside your writing', styles: {} }],
    },

    { type: 'paragraph', content: [] },
    {
      type: 'quote',
      content: [{ type: 'text', text: 'Click the ? button in the top bar for the full list of shortcuts and features.', styles: {} }],
    },
  ];

  return {
    v: 2,
    doc: doc as AppState['doc'],
    todos,
    theme: DEFAULT_THEME,
  };
}
