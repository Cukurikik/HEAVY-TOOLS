import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrimmerService {
  buildArgs(inputName: string, startTime: number, endTime: number, outputFormat: string): string[] {
    return ['-ss', String(startTime), '-i', inputName, '-t', String(endTime - startTime), '-c', 'copy', `output.${outputFormat}`];
  }
  validate(start: number, end: number): string | null {
    if (end <= start) return 'End time must be after start time';
    if ((end - start) < 0.1) return 'Clip must be at least 0.1 seconds';
    return null;
  }
  formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = (s % 60).toFixed(1).padStart(4, '0');
    return `${m}:${sec}`;
  }
}
