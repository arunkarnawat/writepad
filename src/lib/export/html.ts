import type { Block } from '@blocknote/core';
import { exportHtmlFragment } from './blocknoteExport';

/**
 * Export editor document to a simple, clean HTML file.
 *
 * Uses `blocksToHTMLLossy()` for a clean, interoperable HTML structure.
 * No theming — just a simple readable document, similar to PDF output.
 *
 * @see https://www.blocknotejs.org/docs/features/export/html
 */
export function exportHtml(doc: Block[], docTitle: string): string {
  const body = exportHtmlFragment(doc);
  const escapedTitle = escapeHtml(docTitle);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapedTitle}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      color: #1a1a1a;
      background: #fff;
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 24px 60px;
      line-height: 1.7;
    }

    h1 { font-size: 1.8em; font-weight: 700; margin: 1em 0 0.4em; }
    h2 { font-size: 1.4em; font-weight: 700; margin: 1.2em 0 0.3em; }
    h3 { font-size: 1.15em; font-weight: 600; margin: 1em 0 0.2em; }
    p  { margin-bottom: 0.5em; }

    a { color: #0066cc; }
    strong { font-weight: 600; }
    ul, ol { padding-left: 1.5em; margin-bottom: 0.5em; }
    li { margin-bottom: 0.2em; }

    blockquote {
      border-left: 3px solid #ddd;
      padding-left: 1em;
      color: #555;
      font-style: italic;
      margin: 0.6em 0;
    }

    code {
      font-family: ui-monospace, 'SFMono-Regular', monospace;
      font-size: 0.88em;
      background: #f5f5f5;
      padding: 0.1em 0.3em;
      border-radius: 3px;
    }

    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 6px;
      overflow-x: auto;
      margin: 0.6em 0;
    }

    pre code { background: none; padding: 0; font-size: 0.85em; }

    hr { border: none; border-top: 1px solid #e5e5e5; margin: 1.2em 0; }

    table { border-collapse: collapse; width: 100%; margin: 0.6em 0; }
    th, td { border: 1px solid #e5e5e5; padding: 0.4em 0.6em; text-align: left; }
    th { font-weight: 600; background: #fafafa; }

    img { max-width: 100%; height: auto; border-radius: 4px; }

    input[type="checkbox"] { margin-right: 0.4em; }

    @media print {
      body { max-width: none; padding: 0; }
      pre { white-space: pre-wrap; }
    }
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

/** Minimal HTML entity escaping for title injection. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
