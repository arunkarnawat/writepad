import type { Block } from '@blocknote/core';
import { exportMarkdown as exportMdContent } from './blocknoteExport';

/**
 * Export editor document to Markdown.
 *
 * Uses BlockNote's `blocksToMarkdownLossy()` which converts blocks to
 * standard Markdown.  This is inherently lossy — some block-level features
 * (nesting, background colors) cannot be represented in Markdown.
 *
 * The document title is already present in the BlockNote blocks as an H1
 * heading, so we don't prepend it separately.
 *
 * @see https://www.blocknotejs.org/docs/features/export/markdown
 */
export function exportMd(doc: Block[]): string {
  return exportMdContent(doc);
}
