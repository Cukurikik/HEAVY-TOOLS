import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ErrorHandler,
  Injectable,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GracefulDegradationService } from '../../services/graceful-degradation.service';

/**
 * ERROR BOUNDARY COMPONENT
 * 
 * Catches rendering/runtime errors in child components and displays
 * a graceful fallback UI instead of crashing the entire application.
 * 
 * Usage:
 * <app-error-boundary featureKey="video-engine">
 *   <app-video-trimmer />
 * </app-error-boundary>
 */
@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!hasError) {
      <ng-content />
    } @else {
      <div class="glass-panel rounded-2xl p-8 text-center space-y-4 border border-yellow-500/30">
        <div class="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
          <span class="text-3xl">⚠️</span>
        </div>
        <h3 class="text-xl font-bold text-yellow-400">Feature Temporarily Unavailable</h3>
        <p class="text-text-secondary text-sm max-w-md mx-auto">
          {{ degradationMessage || 'This feature encountered an error. The rest of the application continues to work normally.' }}
        </p>
        <button
          (click)="retry()"
          class="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-semibold">
          ↻ Retry
        </button>
      </div>
    }
  `
})
export class ErrorBoundaryComponent {
  @Input() featureKey = 'unknown';
  hasError = false;
  degradationMessage: string | null = null;

  private degradation = inject(GracefulDegradationService);

  /** Called by the global error handler when a child component fails */
  handleError(error: unknown): void {
    this.hasError = true;
    this.degradationMessage = this.degradation.getDegradationMessage(this.featureKey);
    console.error(`[ErrorBoundary:${this.featureKey}] Caught error:`, error);
  }

  retry(): void {
    this.hasError = false;
    this.degradationMessage = null;
  }
}

/**
 * GLOBAL ERROR HANDLER
 * 
 * Catches all unhandled errors in the Angular application.
 * Prevents full page crashes by logging and containing errors.
 */
@Injectable()
export class OmniErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // Prevent full app crash — log and contain the error
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';

    console.error('[OmniErrorHandler] Unhandled error:', message);
    if (stack) {
      console.error('[OmniErrorHandler] Stack trace:', stack);
    }

    // In production, you could send this to your monitoring service
    // via the Ghost Server API endpoint
  }
}
