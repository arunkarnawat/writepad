import type { Block } from '@blocknote/core';
import { BlockNoteEditor } from '@blocknote/core';
import { PDFExporter, pdfDefaultSchemaMappings } from '@blocknote/xl-pdf-exporter';
import { pdf, Text } from '@react-pdf/renderer';
import { createElement } from 'react';

export interface ExportPdfOptions {
  /** Shown on every page (BlockNote `toReactPDFDocument` header option). */
  title?: string;
}

/**
 * Client-side PDF via BlockNote’s exporter + react-pdf
 * @see https://www.blocknotejs.org/docs/features/export/pdf
 */
export async function exportPdfBlob(doc: Block[], options?: ExportPdfOptions): Promise<Blob> {
  const initial = doc.length ? doc : [{ type: 'paragraph' as const, content: '' }];
  const ed = BlockNoteEditor.create({ initialContent: initial });
  try {
    const exporter = new PDFExporter(ed.schema, pdfDefaultSchemaMappings);
    const header = options?.title?.trim()
      ? createElement(Text, { style: { fontSize: 10, marginBottom: 8 } }, options.title.trim())
      : undefined;
    const pdfDocument = await exporter.toReactPDFDocument(ed.document, header ? { header } : undefined);
    return pdf(pdfDocument).toBlob();
  } finally {
    ed.unmount();
  }
}

export function downloadPdf(blob: Blob, filename: string) {
  const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = safeName;
  a.click();
  URL.revokeObjectURL(url);
}
