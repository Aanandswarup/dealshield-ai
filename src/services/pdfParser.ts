import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker to use the local file in public/
if (typeof window !== 'undefined') {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${cleanBase}pdf.worker.min.mjs`;
}

export interface PdfExtractResult {
  text: string;
  pageCount: number;
}

export async function extractTextFromPdf(file: File): Promise<PdfExtractResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const pageCount = pdf.numPages;
  const fullTextPieces: string[] = [];

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((str: string) => str.trim().length > 0);
    
    fullTextPieces.push(`--- Page ${pageNum} ---\n` + pageStrings.join(' '));
  }

  return {
    text: fullTextPieces.join('\n\n').trim(),
    pageCount
  };
}
