import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pdf-drop-zone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="border-2 border-dashed border-white/20 hover:border-cyan-500/50 hover:bg-cyan-500/5 bg-white/5 rounded-2xl p-12 text-center transition-all cursor-pointer shadow-lg"
      (dragover)="onDragOver($event)" 
      (dragleave)="onDragLeave($event)" 
      (drop)="onDrop($event)"
      (click)="fileInput.click()" (keydown.enter)="fileInput.click()" tabindex="0"
      [class.border-cyan-500]="isDragging"
      [class.bg-cyan-500]="isDragging"
      [class.bg-opacity-10]="isDragging"
    >
      <input type="file" #fileInput class="hidden" (change)="onFileSelected($event)" [accept]="accept" [multiple]="multiple" />
      <div class="text-4xl mb-4">📄</div>
      <h3 class="text-xl font-bold text-white mb-2">{{ label }}</h3>
      <p class="text-white/50 text-sm">Supported: {{ accept }}</p>
    </div>
  `
})
export class PdfDropZoneComponent {
  @Input() accept = 'application/pdf';
  @Input() label = 'Drop PDF files here or click to browse';
  @Input() multiple = false;
  @Output() filesSelected = new EventEmitter<File[]>();

  isDragging = false;

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragging = true;
  }
  
  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragging = false;
    if (e.dataTransfer?.files?.length) {
      this.handleFiles(Array.from(e.dataTransfer.files));
    }
  }

  onFileSelected(e: Event) {
    if (e.target.files?.length) {
      this.handleFiles(Array.from(e.target.files));
    }
  }

  private handleFiles(files: File[]) {
    const valid = files.filter(f => f.type === 'application/pdf' || this.accept.includes(f.name.split('.').pop() || ''));
    if (valid.length) {
      this.filesSelected.emit(valid);
    }
  }
}
