import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface DashScopeGenerateResponse {
  output: { task_id: string; task_status: string; results?: Array<{ url: string }> };
  request_id: string;
}

@Injectable({ providedIn: 'root' })
export class DashScopeService {
  private readonly API_KEY = 'sk-e391a1e39ed048e1ac26d158b379b857';
  private readonly BASE_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

  constructor(private http: HttpClient) {}

  generateImage(prompt: string, size = '1024*1024'): Observable<DashScopeGenerateResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable'
    });
    const body = {
      model: 'wanx-v1',
      input: { prompt },
      parameters: { size, n: 1 }
    };
    return this.http.post<DashScopeGenerateResponse>(this.BASE_URL, body, { headers });
  }

  enhanceImage(file: File): Observable<{ url: string }> {
    return new Observable(subscriber => {
      const reader = new FileReader();
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width * 2;
          canvas.height = img.height * 2;
          const ctx = canvas.getContext('2d')!;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (blob) {
              subscriber.next({ url: URL.createObjectURL(blob) });
            }
            subscriber.complete();
          }, 'image/png');
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  restorePhoto(file: File): Observable<{ url: string }> {
    return this.enhanceImage(file);
  }
}
