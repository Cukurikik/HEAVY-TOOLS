import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnitaAiService } from './services/anita-ai.service';
import { AnitaMessage } from './types/anita.types';

@Component({
  selector: 'app-anita-ai',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)] bg-bg-dark text-text-primary overflow-hidden" #container>
      <!-- Header -->
      <header class="p-4 border-b border-white/10 flex items-center justify-between bg-bg-dark/80 backdrop-blur-md z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center text-accent-cyan animate-pulse">
            <mat-icon>psychology</mat-icon>
          </div>
          <div>
            <h1 class="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
              ANITA AI
            </h1>
            <p class="text-xs text-text-muted uppercase tracking-widest">Artificial Neural Intelligence & Technology Assistant</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button mat-icon-button class="text-text-muted hover:text-accent-cyan transition-colors" (click)="clearHistory()">
            <mat-icon>delete_sweep</mat-icon>
          </button>
          <button mat-icon-button class="text-text-muted hover:text-accent-purple transition-colors">
            <mat-icon>settings</mat-icon>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex overflow-hidden">
        <!-- Chat Area -->
        <div class="flex-1 flex flex-col border-r border-white/10 bg-black/20">
          <div class="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin" #scrollContainer>
            @if (messages().length === 0) {
              <div class="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-50">
                <mat-icon class="text-6xl text-accent-cyan">terminal</mat-icon>
                <div class="max-w-md">
                  <h2 class="text-2xl font-bold mb-2">System Ready, Captain.</h2>
                  <p class="text-sm">I am ANITA. I can help you write, debug, and optimize code in 50+ languages. How can I assist you today?</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                  <button class="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-all group" (click)="userInput.set('Buat REST API Python dengan FastAPI')">
                    <div class="text-accent-cyan text-xs mb-1 uppercase font-bold">Example</div>
                    <div class="text-sm group-hover:text-accent-cyan">FastAPI REST API</div>
                  </button>
                  <button class="glass-panel p-4 rounded-xl text-left hover:bg-white/5 transition-all group" (click)="userInput.set('Tulis program sorting di C++')">
                    <div class="text-accent-purple text-xs mb-1 uppercase font-bold">Example</div>
                    <div class="text-sm group-hover:text-accent-purple">C++ Sorting Algorithms</div>
                  </button>
                </div>
              </div>
            }

            @for (msg of messages(); track msg.id) {
              <div class="flex gap-4" [class.flex-row-reverse]="msg.role === 'user'">
                <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" 
                     [class.bg-accent-cyan]="msg.role === 'assistant'"
                     [class.bg-accent-purple]="msg.role === 'user'">
                  <mat-icon class="text-sm">{{ msg.role === 'assistant' ? 'psychology' : 'person' }}</mat-icon>
                </div>
                <div class="max-w-[85%] space-y-2">
                  <div class="glass-panel p-4 rounded-2xl" 
                       [class.rounded-tr-none]="msg.role === 'user'"
                       [class.rounded-tl-none]="msg.role === 'assistant'">
                    <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.content }}</p>
                  </div>
                  <div class="text-[10px] text-text-muted uppercase tracking-tighter px-2">
                    {{ msg.timestamp | date:'HH:mm:ss' }}
                  </div>
                </div>
              </div>
            }

            @if (isLoading()) {
              <div class="flex gap-4">
                <div class="w-8 h-8 rounded-full bg-accent-cyan flex-shrink-0 flex items-center justify-center animate-pulse">
                  <mat-icon class="text-sm">psychology</mat-icon>
                </div>
                <div class="glass-panel p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                  <mat-progress-spinner diameter="16" mode="indeterminate" color="accent"></mat-progress-spinner>
                  <span class="text-xs text-accent-cyan animate-pulse uppercase font-bold tracking-widest">Processing...</span>
                </div>
              </div>
            }
          </div>

          <!-- Input Area -->
          <div class="p-4 bg-bg-dark/50 border-t border-white/10">
            <div class="max-w-4xl mx-auto relative">
              <textarea 
                class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-16 text-sm focus:outline-none focus:border-accent-cyan transition-all resize-none min-h-[60px] max-h-[200px]"
                placeholder="Type your command here, Captain..."
                [(ngModel)]="userInput"
                (keydown.enter)="$event.preventDefault(); sendMessage()"
                rows="1"
                #inputField
              ></textarea>
              <button 
                mat-icon-button 
                class="absolute right-3 bottom-3 text-accent-cyan disabled:text-text-muted transition-all"
                [disabled]="!userInput().trim() || isLoading()"
                (click)="sendMessage()">
                <mat-icon>send</mat-icon>
              </button>
            </div>
            <div class="text-[10px] text-center mt-2 text-text-muted uppercase tracking-widest">
              Powered by Gemini 3.1 Pro · Hybrid AI Engine
            </div>
          </div>
        </div>

        <!-- Code Preview / Editor Area (Hidden on small screens) -->
        <div class="hidden lg:flex w-1/3 flex-col bg-black/40 border-l border-white/10">
          <div class="p-4 border-b border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <mat-icon class="text-accent-purple">code</mat-icon>
              <span class="text-xs font-bold uppercase tracking-widest">Code Matrix</span>
            </div>
            <button mat-icon-button class="text-text-muted hover:text-accent-purple">
              <mat-icon>content_copy</mat-icon>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4 font-mono text-xs scrollbar-thin">
            @if (lastCodeBlock()) {
              <div class="rounded-xl overflow-hidden border border-white/5 bg-bg-dark">
                <div class="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                  <span class="text-accent-cyan uppercase font-bold tracking-tighter">{{ lastCodeBlock()?.language }}</span>
                  <span class="text-text-muted">{{ lastCodeBlock()?.filename || 'untitled' }}</span>
                </div>
                <pre class="p-4 overflow-x-auto text-accent-cyan/90 leading-relaxed"><code>{{ lastCodeBlock()?.code }}</code></pre>
              </div>
            } @else {
              <div class="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
                <mat-icon class="text-4xl">code_off</mat-icon>
                <p class="uppercase tracking-widest text-[10px]">No code detected in current session</p>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
  `]
})
export class AnitaAiComponent {
  private anitaService = inject(AnitaAiService);
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('inputField') inputField!: ElementRef;

  messages = signal<AnitaMessage[]>([]);
  userInput = signal<string>('');
  isLoading = signal<boolean>(false);
  lastCodeBlock = signal<{language: string, code: string, filename?: string} | null>(null);

  constructor() {
    afterNextRender(() => {
      this.scrollToBottom();
    });
  }

  async sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isLoading()) return;

    const userMsg: AnitaMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    this.messages.update(prev => [...prev, userMsg]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    try {
      const response = await this.anitaService.sendMessage(text, this.messages());
      this.messages.update(prev => [...prev, response]);
      
      if (response.codeBlocks && response.codeBlocks.length > 0) {
        this.lastCodeBlock.set(response.codeBlocks[response.codeBlocks.length - 1]);
      }
    } catch (error) {
      console.error('ANITA Error:', error);
      const errorMsg: AnitaMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "ERROR: System malfunction. Unable to process request. Please check connection.",
        timestamp: new Date()
      };
      this.messages.update(prev => [...prev, errorMsg]);
    } finally {
      this.isLoading.set(false);
      this.scrollToBottom();
    }
  }

  clearHistory() {
    this.messages.set([]);
    this.lastCodeBlock.set(null);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
