import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AnitaAiService } from './services/anita-ai.service';
import { AnitaMessage } from './types/anita.types';

@Component({
  selector: 'app-anita-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col h-[calc(100vh-64px)] bg-[#040409] text-white overflow-hidden relative" #container>
      
      <!-- Background Ambient Glows -->
      <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <!-- Premium Glassmorphic Header -->
      <header class="p-5 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-2xl z-20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div class="flex items-center gap-4">
          <div class="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(6,182,212,0.15)] group">
            <div class="absolute inset-0 rounded-xl bg-cyan-400/20 animate-ping opacity-20"></div>
            <mat-icon class="text-cyan-400 scale-125 group-hover:rotate-12 transition-transform duration-300">psychology</mat-icon>
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400">
              ANITA AI
            </h1>
            <p class="text-[10px] text-cyan-200/50 uppercase tracking-[0.2em] font-medium flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              Neural Processing Core Active
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="clearHistory()" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400 transition-all duration-300 text-white/50 tooltip-trigger group">
            <mat-icon class="group-hover:scale-110 transition-transform">delete_sweep</mat-icon>
          </button>
          <button (click)="isSettingsOpen.set(!isSettingsOpen())" class="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-cyan-500/20 hover:border-cyan-500/30 hover:text-cyan-400 transition-all duration-300 text-white/50 group" [class.bg-cyan-500/20]="isSettingsOpen()" [class.text-cyan-400]="isSettingsOpen()" [class.border-cyan-500]="isSettingsOpen()">
            <mat-icon class="group-hover:rotate-90 transition-transform duration-500">tune</mat-icon>
          </button>
        </div>
      </header>

      <!-- Main Layout -->
      <main class="flex-1 flex overflow-hidden relative z-10">
        
        <!-- Chat Area -->
        <div class="flex-1 flex flex-col relative transition-all duration-500" [class.mr-[400px]]="isSettingsOpen()">
          
          <div class="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-hide" #scrollContainer>
            
            @if (messages().length === 0) {
              <!-- Empty State / Welcome Screen -->
              <div class="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-10 opacity-0 animate-[fadeSlideUp_0.8s_ease-out_forwards]">
                <div class="relative group">
                  <div class="absolute inset-0 bg-cyan-500 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div class="w-32 h-32 rounded-full border border-white/10 bg-gradient-to-b from-white/5 to-transparent flex items-center justify-center backdrop-blur-md relative z-10">
                    <mat-icon class="text-7xl text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">graphic_eq</mat-icon>
                  </div>
                </div>
                
                <div class="space-y-4">
                  <h2 class="text-4xl font-extrabold tracking-tight">System Ready, <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Captain.</span></h2>
                  <p class="text-white/60 text-lg font-light max-w-lg mx-auto leading-relaxed">I am your highly advanced coding symbiote. I can architect solutions, debug complex states, and generate production-ready code in milliseconds.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-6">
                  <button (click)="userInput.set('Generate a beautiful TailwindCSS glassmorphic login form in Angular')" 
                          class="p-5 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 text-left group hover:-translate-y-1 flex flex-col gap-2">
                    <div class="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2 group-hover:scale-110 transition-transform"><mat-icon class="scale-75">brush</mat-icon></div>
                    <div class="font-semibold group-hover:text-cyan-300">UI Generation</div>
                    <div class="text-xs text-white/40">Glassmorphic login form</div>
                  </button>
                  <button (click)="userInput.set('Write a Python script to deeply merge two JSON files handling array conflicts')"
                          class="p-5 rounded-2xl bg-white/3 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 text-left group hover:-translate-y-1 flex flex-col gap-2">
                    <div class="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-2 group-hover:scale-110 transition-transform"><mat-icon class="scale-75">integration_instructions</mat-icon></div>
                    <div class="font-semibold group-hover:text-purple-300">Scripting Magic</div>
                    <div class="text-xs text-white/40">Python JSON deep merger</div>
                  </button>
                </div>
              </div>
            }

            <!-- Messages List -->
            <div class="max-w-4xl mx-auto space-y-8 pb-10">
              @for (msg of messages(); track msg.id) {
                <div class="flex gap-4 group opacity-0 animate-[fadeSlideUp_0.4s_ease-out_forwards]" [class.flex-row-reverse]="msg.role === 'user'">
                  
                  <!-- Avatar -->
                  <div class="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border border-white/10" 
                       [class.bg-gradient-to-br]="true"
                       [class.from-cyan-500]="msg.role === 'assistant'" [class.to-blue-600]="msg.role === 'assistant'" [class.shadow-cyan-500/20]="msg.role === 'assistant'"
                       [class.from-purple-500]="msg.role === 'user'" [class.to-pink-600]="msg.role === 'user'" [class.shadow-purple-500/20]="msg.role === 'user'">
                    <mat-icon class="text-white scale-75">{{ msg.role === 'assistant' ? 'psychology' : 'person' }}</mat-icon>
                  </div>
                  
                  <!-- Message Content -->
                  <div class="max-w-[85%] flex flex-col" [class.items-end]="msg.role === 'user'">
                    <div class="p-5 rounded-3xl text-sm leading-relaxed tracking-wide shadow-xl backdrop-blur-md" 
                         [class.rounded-tr-sm]="msg.role === 'user'"
                         [class.bg-white/10]="msg.role === 'user'"
                         [class.border-white/10]="msg.role === 'user'"
                         [class.text-white]="msg.role === 'user'"
                         [class.rounded-tl-sm]="msg.role === 'assistant'"
                         [class.bg-[#12121a]/90]="msg.role === 'assistant'"
                         [class.border]="true"
                         [class.border-white/5]="msg.role === 'assistant'"
                         [class.text-white/90]="msg.role === 'assistant'">
                      
                      <!-- Markdown Rendering Simulation -->
                      <p class="whitespace-pre-wrap font-light" [innerHTML]="formatMessage(msg.content)"></p>
                    </div>
                    <span class="text-[10px] text-white/30 font-medium uppercase tracking-widest mt-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {{ msg.timestamp | date:'HH:mm:ss' }}
                    </span>
                  </div>
                </div>
              }

              <!-- Typing Indicator -->
              @if (isLoading()) {
                <div class="flex gap-4 opacity-0 animate-[fadeIn_0.3s_forwards]">
                  <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-white/20">
                    <mat-icon class="text-white scale-75 animate-spin">autorenew</mat-icon>
                  </div>
                  <div class="p-5 rounded-3xl rounded-tl-sm bg-[#12121a]/90 border border-white/5 flex items-center gap-3 w-32 shadow-xl backdrop-blur-md">
                    <div class="flex gap-1.5">
                      <div class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 0ms"></div>
                      <div class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 150ms"></div>
                      <div class="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Input Area -->
          <div class="p-4 md:p-6 bg-gradient-to-t from-[#040409] to-transparent relative z-20">
            <div class="max-w-4xl mx-auto relative group">
              
              <!-- Glowing border effect -->
              <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-focus-within:opacity-50 transition duration-1000 group-hover:opacity-40"></div>
              
              <div class="relative flex items-end bg-[#0a0a0f] border border-white/10 rounded-3xl shadow-2xl p-2 transition-all">
                <button mat-icon-button class="text-white/40 hover:text-white mb-1 ml-1" title="Attach file (coming soon)">
                  <mat-icon>attach_file</mat-icon>
                </button>
                
                <textarea 
                  class="flex-1 bg-transparent border-none p-4 text-sm text-white focus:ring-0 resize-none min-h-[60px] max-h-[300px] scrollbar-hide outline-none placeholder:text-white/30"
                  placeholder="Ask ANITA to build, debug, or explain..."
                  [(ngModel)]="userInput"
                  (keydown.enter)="$event.preventDefault(); sendMessage()"
                  rows="2" #inputField
                ></textarea>
                
                <button 
                  class="flex items-center justify-center w-12 h-12 rounded-2xl mb-1 mr-1 transition-all duration-300 group/btn overflow-hidden relative"
                  [disabled]="!userInput().trim() || isLoading()"
                  [class.bg-white/5]="!userInput().trim() || isLoading()"
                  [class.bg-cyan-500]="userInput().trim() && !isLoading()"
                  [class.text-white/30]="!userInput().trim() || isLoading()"
                  [class.text-black]="userInput().trim() && !isLoading()"
                  (click)="sendMessage()">
                  <div class="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                  <mat-icon class="relative z-10 transition-transform duration-300" [class.group-hover/btn:translate-x-1]="userInput().trim() && !isLoading()" [class.group-hover/btn:-translate-y-1]="userInput().trim() && !isLoading()">send</mat-icon>
                </button>
              </div>
            </div>
            <div class="text-[10px] text-center mt-4 text-cyan-200/40 uppercase tracking-[0.3em] font-medium drop-shadow-md">
              Powered by Alibaba Cloud Qwen Max Engine
            </div>
          </div>
        </div>

        <!-- Slide-out Settings Panel -->
        <div class="absolute right-0 top-0 bottom-0 w-[400px] bg-[#0d0d14] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-30"
             [class.translate-x-full]="!isSettingsOpen()"
             [class.translate-x-0]="isSettingsOpen()">
             
          <div class="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
            <h3 class="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <mat-icon class="text-cyan-400">tune</mat-icon> Model Configuration
            </h3>
            <button (click)="isSettingsOpen.set(false)" class="text-white/40 hover:text-white">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          
          <div class="p-6 space-y-8 overflow-y-auto h-[calc(100%-80px)] scrollbar-hide">
            
            <div class="space-y-4">
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-wider font-bold text-white/50">API Provider</label>
                <div class="flex gap-2">
                  <button class="flex-1 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-sm font-bold flex items-center justify-center gap-2">
                    Alibaba DashScope
                  </button>
                  <button class="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-sm hover:bg-white/10 transition-colors">
                    Custom OpenAI
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-xs uppercase tracking-wider font-bold text-white/50">API Key</label>
                <input type="password" [(ngModel)]="apiKeyStr" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none text-white font-mono placeholder:text-white/20" placeholder="sk-..." />
              </div>
              
              <div class="space-y-2">
                <label class="text-xs uppercase tracking-wider font-bold text-white/50">Endpoint URL</label>
                <input type="text" [(ngModel)]="endpointUrl" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none text-white font-mono placeholder:text-white/20" />
                <p class="text-[10px] text-white/40 leading-relaxed">Ensure the endpoint is fully compatible with OpenAI Chat Completions API.</p>
              </div>
              
              <div class="space-y-2">
                <label class="text-xs uppercase tracking-wider font-bold text-white/50">Model Name</label>
                <input type="text" [(ngModel)]="modelName" class="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 outline-none text-white font-mono placeholder:text-white/20" />
              </div>
              
            </div>
            
            <div class="pt-6 border-t border-white/5 space-y-4">
              <button (click)="saveConfig()" class="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                Save & Restart Core
              </button>
              
              @if(configSaved()) {
                <div class="p-3 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm text-center animate-pulse">
                  ✓ Configuration Updated Successfully
                </div>
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class AnitaAiComponent {
  private anitaService = inject(AnitaAiService);
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  messages = signal<AnitaMessage[]>([]);
  userInput = signal<string>('');
  isLoading = signal<boolean>(false);
  
  // Settings State
  isSettingsOpen = signal<boolean>(false);
  configSaved = signal<boolean>(false);
  
  apiKeyStr = '';
  endpointUrl = '';
  modelName = '';

  constructor() {
    this.apiKeyStr = this.anitaService.config().apiKey;
    this.endpointUrl = this.anitaService.config().endpoint;
    this.modelName = this.anitaService.config().model;
  }

  saveConfig() {
    this.anitaService.updateConfig(this.apiKeyStr, this.endpointUrl, this.modelName);
    this.configSaved.set(true);
    setTimeout(() => {
      this.configSaved.set(false);
      this.isSettingsOpen.set(false);
    }, 2000);
  }

  // Simple Markdown formatter to make text look pretty without full marked library
  formatMessage(text: string): string {
    let formatted = text
      .replace(/<([^>]+)>/g, '&lt;$1&gt;') // html escape
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300 font-bold">$1</strong>')
      .replace(/\`(.*?)\`/g, '<code class="bg-[#202028] text-pink-400 px-1.5 py-0.5 rounded text-xs border border-white/10">$1</code>')
      
    // Handle code blocks manually
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    formatted = formatted.replace(codeRegex, (match, lang, code) => {
      return `<div class="my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0f] shadow-lg">
        <div class="bg-white/5 border-b border-white/5 px-4 py-2 flex items-center justify-between">
          <span class="text-xs text-white/40 uppercase tracking-widest">${lang || 'code'}</span>
        </div>
        <pre class="p-4 overflow-x-auto text-xs text-cyan-200/90 leading-relaxed font-mono selection:bg-cyan-500/30"><code>${code.trim()}</code></pre>
      </div>`;
    });
    
    return formatted;
  }

  async sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isLoading()) return;

    this.messages.update(prev => [...prev, {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }]);
    
    this.userInput.set('');
    this.isLoading.set(true);
    this.scrollToBottom();

    setTimeout(async () => {
      try {
        const response = await this.anitaService.sendMessage(text, this.messages());
        this.messages.update(prev => [...prev, response]);
      } catch (err: any) {
        this.messages.update(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "ERROR: System malfunction. " + String(err),
          timestamp: new Date()
        }]);
      } finally {
        this.isLoading.set(false);
        this.scrollToBottom();
      }
    }, 300); // UI breathing room
  }

  clearHistory() {
    this.messages.set([]);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
