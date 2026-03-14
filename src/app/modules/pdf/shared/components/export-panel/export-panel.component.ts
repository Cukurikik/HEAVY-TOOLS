import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-export-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-green-500/10 border border-green-500/30 rounded-2xl space-y-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
      <div class="flex items-center gap-3 text-green-400">
        <div class="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">✅</div>
        <h3 class="font-bold">Processing Complete</h3>
      </div>
      
      <div class="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg border border-white/5">
        <span class="text-white/50">Output Size</span>
        <span class="font-bold text-white">{{ outputSizeMB | number:'1.2-2' }} MB</span>
      </div>
      
      <a *ngIf="outputBlob" [href]="downloadUrl" [download]="defaultFilename" class="block w-full text-center py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-all hover:scale-[1.02]">
        ⬇️ Download Output
      </a>
    </div>
  `
})
export class ExportPanelComponent {
  @Input() outputBlob: Blob | null = null;
  @Input() outputSizeMB: number | null = null;
  @Input() defaultFilename = 'output.pdf';

  get downloadUrl() {
    return this.outputBlob ? URL.createObjectURL(this.outputBlob) : '';
  }
}
