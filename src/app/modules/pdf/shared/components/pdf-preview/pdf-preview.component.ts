import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pdf-preview',
  standalone: true,
  template: `
    <div class="bg-black/40 rounded-xl border border-white/10 flex items-center justify-center min-h-[300px]">
      <div class="text-white/50">📄 Preview Placeholder</div>
    </div>
  `
})
export class PdfPreviewComponent {
  @Input() file: File | null = null;
}
