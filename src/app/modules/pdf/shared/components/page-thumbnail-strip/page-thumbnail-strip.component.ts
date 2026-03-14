import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-thumbnail-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex overflow-x-auto gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
      <div class="text-white/50 text-sm whitespace-nowrap pt-8 px-4" *ngIf="!thumbnails?.length">
         Thumbnails rendering...
      </div>
      @for (thumb of thumbnails; track thumb) {
         <div class="w-24 shrink-0 aspect-[1/1.414] bg-white rounded flex items-center justify-center text-black font-bold">
           {{thumb}}
         </div>
      }
    </div>
  `
})
export class PageThumbnailStripComponent {
  @Input() file: File | null = null;
  @Input() pageCount: number = 0;
  
  // Stubs for now
  get thumbnails(): number[] {
     return Array.from({length: this.pageCount || 1}, (_, i) => i + 1);
  }
}
