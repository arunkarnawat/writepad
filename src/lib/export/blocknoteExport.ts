import type { Block } from '@blocknote/core';
import { BlockNoteEditor } from '@blocknote/core';

function withHeadlessEditor<T>(doc: Block[], fn: (ed: BlockNoteEditor) => T): T {
  const ed = BlockNoteEditor.create({ initialContent: doc });
  try {
    return fn(ed);
  } finally {
    ed.unmount();
  }
}

export function exportMarkdown(doc: Block[]): string {
  if (!doc.length) return '';
  return withHeadlessEditor(doc, e => e.blocksToMarkdownLossy());
}

export function exportPlainText(doc: Block[]): string {
  if (!doc.length) return '';
  return withHeadlessEditor(doc, e => {
    const html = e.blocksToHTMLLossy();
    if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, '\n').trim();
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent?.trim() || '';
  });
}

export function exportHtmlFragment(doc: Block[]): string {
  if (!doc.length) return '<p></p>';
  return withHeadlessEditor(doc, e => e.blocksToHTMLLossy());
}
