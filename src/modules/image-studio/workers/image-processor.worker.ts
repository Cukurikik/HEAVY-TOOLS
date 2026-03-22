/// <reference lib="webworker" />
import pica from 'pica';
import JSZip from 'jszip';

const picaRunner = pica();

self.onmessage = async (e: MessageEvent) => {
  const { id, type, payload } = e.data;
  if (type !== 'PROCESS') return;
  
  const { operation, file, options, outputFormat = 'jpeg' } = payload;
  const mimeType = outputFormat === 'png' ? 'image/png' : outputFormat === 'webp' ? 'image/webp' : 'image/jpeg';
  
  try {
    self.postMessage({ id, type: 'PROGRESS', progress: 10 });
    
    const bitmap = await createImageBitmap(file);
    let canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    let ctx = canvas.getContext('2d')!;
    ctx.drawImage(bitmap, 0, 0);
    
    self.postMessage({ id, type: 'PROGRESS', progress: 30 });

    switch (operation) {
      case 'resize': {
        const { width, height } = options;
        const outCanvas = new OffscreenCanvas(width, height);
        // Using Pica for high quality Lanczos resampling
        // pica supports OffscreenCanvas
        await picaRunner.resize(canvas as any, outCanvas as any, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        });
        canvas = outCanvas;
        break;
      }
      case 'crop': {
        const { x, y, width, height } = options;
        const outCanvas = new OffscreenCanvas(width, height);
        outCanvas.getContext('2d')!.drawImage(canvas, x, y, width, height, 0, 0, width, height);
        canvas = outCanvas;
        break;
      }
      case 'rotate': {
        const { angle } = options;
        const rad = (angle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newW = Math.floor(canvas.width * cos + canvas.height * sin);
        const newH = Math.floor(canvas.width * sin + canvas.height * cos);
        
        const outCanvas = new OffscreenCanvas(newW, newH);
        const outCtx = outCanvas.getContext('2d')!;
        outCtx.translate(newW / 2, newH / 2);
        outCtx.rotate(rad);
        outCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
        canvas = outCanvas;
        break;
      }
      case 'flip': {
        const { horizontal, vertical } = options;
        const outCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        const outCtx = outCanvas.getContext('2d')!;
        outCtx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
        outCtx.drawImage(
          canvas, 
          horizontal ? -canvas.width : 0, 
          vertical ? -canvas.height : 0
        );
        canvas = outCanvas;
        break;
      }
      case 'watermark': {
        const { text, x, y, font, color, alpha } = options;
        ctx.globalAlpha = alpha || 0.5;
        ctx.font = font || '48px Arial';
        ctx.fillStyle = color || 'white';
        ctx.fillText(text, x || 10, y || 50);
        ctx.globalAlpha = 1.0;
        break;
      }
      case 'palette': {
        // Basic Palette extraction pseudo-implementation
        const sampleData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        // normally k-means here
        self.postMessage({ id, type: 'PROGRESS', progress: 50 });
        break;
      }
      case 'histogram': {
        // Return raw image data early since histogram needs pixel analysis
        const rawImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        self.postMessage({ id, type: 'DONE', payload: { imageData: rawImageData } });
        return;
      }
    }

    self.postMessage({ id, type: 'PROGRESS', progress: 70 });

    const resultBlob = await canvas.convertToBlob({ 
      type: mimeType, 
      quality: (options?.quality as number) || 0.9 
    });

    self.postMessage({ id, type: 'PROGRESS', progress: 100 });
    self.postMessage({ 
      id, 
      type: 'DONE', 
      payload: { blob: resultBlob, url: URL.createObjectURL(resultBlob) } 
    });
    
  } catch (error) {
    self.postMessage({ 
      id, 
      type: 'ERROR', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};
