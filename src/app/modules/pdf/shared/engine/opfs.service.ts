import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OpfsService {
  async saveFile(file: File): Promise<string> { return 'sandbox://' + file.name; }
  async getFile(path: string): Promise<File | null> { return null; }
  async deleteFile(path: string): Promise<void> {}
}
