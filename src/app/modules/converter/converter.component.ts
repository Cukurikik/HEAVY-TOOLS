import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ToolCardComponent, Tool } from '../../shared/components/tool-card/tool-card.component';

export const CONVERTER_TOOLS: Tool[] = [
  { id: 'magic-byte', label: 'Magic Byte Forensics', icon: 'search', category: 'advanced', status: 'stable' },
  { id: 'universal',  label: 'Universal Router', icon: 'route', category: 'core', status: 'stable' },
  { id: 'archive',    label: 'Archive Forge', icon: 'folder_zip', category: 'basic', status: 'stable' },
];

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [CommonModule, MatIconModule, ToolCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-8 space-y-8 max-w-7xl mx-auto">
      <header class="flex items-center justify-between mb-12">
        <div>
          <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-lg tracking-tight" class="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-status-warning to-accent-pink mb-2">
            Universal Converter
          </h1>
          <p class="text-text-secondary">Data transmutation and archive extraction.</p>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        @for (tool of converterTools; track tool.id) {
          <app-tool-card [tool]="tool" />
        }
      </section>
    </div>
  `
})
export class ConverterComponent {
  converterTools = CONVERTER_TOOLS;
}
