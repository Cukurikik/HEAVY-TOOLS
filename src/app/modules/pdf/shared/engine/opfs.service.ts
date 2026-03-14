import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OpfsService {
  async saveFile(file: File): Promise<string> { return 'sandbox://' + file.name; }
  async getFile(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    path: string
  ): Promise<File | null> { return null; }
  async deleteFile(): Promise<void> { /* not implemented */ }
}
