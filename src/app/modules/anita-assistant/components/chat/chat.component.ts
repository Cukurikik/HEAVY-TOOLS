import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnitaStore } from '../../store/anita.store';

@Component({
  selector: 'app-anita-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent {
  private fb = inject(FormBuilder);
  readonly store = inject(AnitaStore);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  chatForm = this.fb.group({
    message: ['', [Validators.required, Validators.minLength(1)]],
  });

  sendMessage() {
    if (this.chatForm.valid && !this.store.isLoading()) {
      const message = this.chatForm.value.message as string;
      this.store.sendMessage(message);
      this.chatForm.reset();
      this.scrollToBottom();
    }
  }

  clearChat() {
    this.store.clearChat();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
