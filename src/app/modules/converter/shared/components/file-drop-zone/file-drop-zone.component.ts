import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-drop-zone',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group"
      [class.border-cyan-500]="isDragOver" 
      [class.bg-cyan-500/5]="isDragOver"
      [class.border-white/20]="!isDragOver" 
      [class.hover:border-white/40]="!isDragOver"
      (click)="fileInput.click()" 
      (keydown.enter)="fileInput.click()" 
      tabindex="0" 
      (drop)="onDrop($event)" 
      (dragover)="onDragOver($event)" 
      (dragleave)="isDragOver = false"
    >
      <input 
        #fileInput 
        type="file" 
        class="hidden" 
        [accept]="accept" 
        [multiple]="multiple"
        (change)="onFileSelect($event)"
      >
      <div class="space-y-3">
        <div class="w-16 h-16 mx-auto rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <span class="text-3xl">{{ icon }}</span>
        </div>
        <p class="text-white/70 text-sm">
          {{ label }} <span class="text-cyan-400 underline">browse</span>
        </p>
        <p class="text-white/30 text-xs">
          {{ supportedFormatsText }} — Max {{ maxSizeMB }}MB
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class FileDropZoneComponent {
  @Input() accept = '*/*';
  @Input() multiple = false;
  @Input() label = 'Drop files here or click to browse';
  @Input() icon = '📁';
  @Input() maxSizeMB = 500;
  @Input() supportedFormats: string[] = [];
  @Output() filesSelected = new EventEmitter<File[]>();

  isDragOver = false;

  get supportedFormatsText(): string {
    return this.supportedFormats.length > 0 
      ? this.supportedFormats.join(', ').toUpperCase()
      : 'All formats supported';
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  private handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    this.filesSelected.emit(files);
  }
}