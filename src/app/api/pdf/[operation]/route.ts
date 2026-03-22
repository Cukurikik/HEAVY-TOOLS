import { NextResponse } from 'next/server';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import JSZip from 'jszip';

export async function POST(
  request: Request,
  { params }: { params: { operation: string } }
) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const operation = params.operation;

    if (!files || files.length === 0) {
      return new NextResponse('No files provided', { status: 400 });
    }

    let resultBuffer: Uint8Array | null = null;
    let contentType = 'application/pdf';
    let outputFilename = `${operation}-result.pdf`;

    switch (operation) {
      case 'merger': {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const pdfA = await PDFDocument.load(await file.arrayBuffer());
          const copiedPages = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        resultBuffer = await mergedPdf.save();
        break;
      }

      case 'rotate-pages': {
        const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer());
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          page.setRotation(degrees(page.getRotation().angle + 90));
        });
        resultBuffer = await pdfDoc.save();
        break;
      }

      case 'watermark': {
        const textToDraw = (formData.get('text') as string) || 'HEAVY-TOOLS';
        const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer());
        const pages = pdfDoc.getPages();
        pages.forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(textToDraw, {
            x: width / 4,
            y: height / 2,
            size: 50,
            color: rgb(0.95, 0.1, 0.1),
            rotate: degrees(45),
            opacity: 0.5,
          });
        });
        resultBuffer = await pdfDoc.save();
        break;
      }

      case 'splitter': {
        const pdfDoc = await PDFDocument.load(await files[0].arrayBuffer());
        const zip = new JSZip();
        for (let i = 0; i < pdfDoc.getPageCount(); i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          zip.file(`page-${i+1}.pdf`, await newPdf.save());
        }
        resultBuffer = await zip.generateAsync({ type: 'uint8array' });
        contentType = 'application/zip';
        outputFilename = 'split-pages.zip';
        break;
      }

      default: {
        const file = files[0];
        resultBuffer = new Uint8Array(await file.arrayBuffer());
        contentType = file.type || 'application/pdf';
      }
    }

    if (!resultBuffer) {
      throw new Error('Failed to generate output buffer');
    }

    return new NextResponse(new Blob([resultBuffer as any], { type: contentType }), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
      },
    });
  } catch (error) {
    console.error(`Error in PDF operation ${params.operation}:`, error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Unknown error occurred during PDF processing',
      { status: 500 }
    );
  }
}
