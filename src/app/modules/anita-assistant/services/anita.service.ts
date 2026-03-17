import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnitaService {
  private http = inject(HttpClient);
  private apiUrl = '/api/anita';

  sendMessage(message: string): Observable<{ response: string; error?: string }> {
    return this.http.post<{ response: string; error?: string }>(`${this.apiUrl}/chat`, { message });
  }
}
