import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface GhostUploadResponse {
  message: string;
  id: string;
  expiresAt: string;
  downloadUrl: string;
}

export interface GhostFileInfo {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  expiresAt: string;
  createdAt: string;
  remainingMinutes: number;
}

@Injectable({
  providedIn: 'root'
})
export class CloudSyncService {
  private http = inject(HttpClient);
  // Default URL for the Ghost Server
  private baseUrl = 'http://localhost:3000/api';

  /**
   * Pushes a Blob/File to the Ghost Server.
   * Tracks upload progress and returns the final file metadata when complete.
   */
  uploadToGhostCloud(file: File | Blob, originalName = 'output.file'): Observable<number | GhostUploadResponse> {
    const formData = new FormData();
    formData.append('file', file, originalName);

    return this.http.post<GhostUploadResponse>(`${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          return Math.round(100 * (event.loaded / (event.total || 1)));
        }
        if (event.type === HttpEventType.Response) {
          return event.body as GhostUploadResponse;
        }
        return 0; // Default pending state
      }),
      filter(val => val !== 0) // Only emit actual progress or completion
    );
  }

  /**
   * Retrieves metadata and time remaining for a tracked file on the Ghost Server.
   */
  getGhostFileInfo(id: string): Observable<GhostFileInfo> {
    return this.http.get<GhostFileInfo>(`${this.baseUrl}/info/${id}`);
  }

  /**
   * Returns the direct download URL for the tracked file.
   */
  getDownloadUrl(id: string): string {
    return `${this.baseUrl}/download/${id}`;
  }
}
