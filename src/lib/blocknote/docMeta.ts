import type { Block } from '@blocknote/core';
import { countWords, countChars } from '@/lib/utils/wordCount';

function inlineText(content: unknown): string {
  if (!Array.isArray(content)) return '';
  let s = '';
  for (const node of content as { type?: string; text?: string }[]) {
    if (node?.type === 'text' && node.text) s += node.text;
  }
  return s;
}

function walkDepthFirst(blocks: Block[] | unknown[], visit: (b: Record<string, unknown>) => void) {
  for (const raw of blocks) {
    const b = raw as Record<string, unknown>;
    visit(b);
    if (Array.isArray(b.children)) walkDepthFirst(b.children as Block[], visit);
  }
}

function blockNoteDocPlainText(doc: Block[]): string {
  const parts: string[] = [];
  walkDepthFirst(doc, b => {
    if (b.type === 'divider') return;
    if (typeof b.content !== 'undefined') parts.push(inlineText(b.content));
  });
  return parts.join('\n');
}

export function firstHeadingTitle(doc: Block[]): string {
  for (const raw of doc) {
    const b = raw as { type?: string; props?: { level?: number }; content?: unknown };
    if (b.type === 'heading' && b.props?.level === 1) {
      const t = inlineText(b.content).trim();
      return t || 'Untitled';
    }
  }
  return 'Untitled';
}

export function wordStatsFromDoc(doc: Block[]): { words: number; chars: number } {
  const text = blockNoteDocPlainText(doc);
  return { words: countWords(text), chars: countChars(text) };
}
