// ============================================================
// FILE DROP ZONE COMPONENT — Shared drag-and-drop file input
// File: src/app/modules/converter/shared/components/file-drop-zone/file-drop-zone.component.ts
// ============================================================

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-converter-file-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
             hover:border-cyan-400/60 hover:bg-cyan-400/5 group"
      [class.border-cyan-400]="isDragging"
      [class.bg-cyan-400/10]="isDragging"
      [class.border-white/20]="!isDragging"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
      (click)="fileInput.click()">

      <input
        #fileInput
        type="file"
        class="hidden"
        [accept]="accept"
        [multiple]="multiple"
        (change)="onFileChange($event)" />

      <div class="space-y-3">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center
                    group-hover:bg-cyan-400/10 transition-colors duration-300">
          <span class="text-3xl">📁</span>
        </div>
        <p class="text-white/70 text-sm font-medium">{{ label }}</p>
        <p class="text-white/30 text-xs">Max {{ maxSizeMB }} MB per file</p>
      </div>
    </div>
  `,
})
export class ConverterFileDropZoneComponent {
  @Input() accept = '*/*';
  @Input() multiple = false;
  @Input() maxSizeMB = 500;
  @Input() label = 'Drop files here or click to browse';

  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() validationError = new EventEmitter<string>();

  isDragging = false;

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(Array.from(files));
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(Array.from(input.files));
      input.value = '';
    }
  }

  private processFiles(files: File[]): void {
    const maxBytes = this.maxSizeMB * 1024 * 1024;
    const valid: File[] = [];
    for (const file of files) {
      if (file.size > maxBytes) {
        this.validationError.emit(`File "${file.name}" exceeds ${this.maxSizeMB} MB limit`);
        continue;
      }
      valid.push(file);
    }
    if (valid.length > 0) {
      this.filesSelected.emit(valid);
    }
  }
}
