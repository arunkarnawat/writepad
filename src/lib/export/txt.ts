import type { Block } from '@blocknote/core';
import { exportMarkdown, exportPlainText as extractPlainText } from './blocknoteExport';

/**
 * Export editor document to clean plain text.
 *
 * Strategy: convert to Markdown first (which preserves structural whitespace
 * like list indentation and heading lines) then strip Markdown formatting
 * characters.  This produces much more readable plain text than the
 * HTML → textContent approach which collapses everything into a wall of text.
 *
 * Falls back to the HTML-based extraction if Markdown conversion fails.
 */
export function exportTxt(doc: Block[]): string {
  try {
    const md = exportMarkdown(doc);
    return stripMarkdown(md);
  } catch {
    // Fallback: HTML → textContent
    return extractPlainText(doc);
  }
}

/**
 * Strip common Markdown formatting while preserving structure.
 * Keeps blank lines, indentation, and list markers as plain-text structure.
 */
function stripMarkdown(md: string): string {
  return md
    // Remove images: ![alt](url) → alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove links: [text](url) → text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Remove bold/italic markers
    .replace(/(\*{1,3}|_{1,3})([^*_]+?)\1/g, '$2')
    // Remove inline code backticks
    .replace(/`([^`]+)`/g, '$1')
    // Remove heading markers but keep text (### Foo → Foo)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '---')
    // Remove blockquote markers
    .replace(/^>\s?/gm, '')
    // Clean up excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function downloadFile(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
