export interface ExtractResult {
  text: string;
  pages: number;
}

export async function extractText(file: File): Promise<ExtractResult> {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const pdfjs = await import("pdfjs-dist");
    const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const buf = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += `\n\n[Page ${i}]\n`;
      text += content.items
        .map((item) => ("str" in item ? (item as { str: string }).str : ""))
        .join(" ");
    }
    return { text: text.trim(), pages: pdf.numPages };
  }

  const text = await file.text();
  return { text: text.trim(), pages: Math.max(1, Math.round(text.length / 2500)) };
}
