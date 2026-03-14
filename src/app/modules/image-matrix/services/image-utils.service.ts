import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageUtilsService {
  async fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image file.')); };
      img.src = url;
    });
  }

  drawImageToCanvas(img: HTMLImageElement, canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Canvas 2D context not supported');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return ctx;
  }

  async canvasToFile(canvas: HTMLCanvasElement, filename = 'output.png', mimeType = 'image/png', quality = 0.92): Promise<File> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error('Canvas to Blob conversion failed')); return; }
        resolve(new File([blob], filename, { type: mimeType }));
      }, mimeType, quality);
    });
  }
}
