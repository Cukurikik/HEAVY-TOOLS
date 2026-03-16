import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { SpeedControllerActions, selectSpeedControllerState, selectStatus, selectProgress, selectOutputBlob } from './speed-controller.store';
import { SpeedControllerService } from './speed-controller.service';

@Component({
  selector: 'app-speed-controller',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './speed-controller.component.html'
})
export class SpeedControllerComponent {
  private store = inject(Store);
  public service = inject(SpeedControllerService);

  state$ = this.store.select(selectSpeedControllerState);
  status$ = this.store.select(selectStatus);
  progress$ = this.store.select(selectProgress);
  outputBlob$ = this.store.select(selectOutputBlob);

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.store.dispatch(SpeedControllerActions.loadFile({ file }));
      
      // Mock meta loading
      setTimeout(() => {
        this.store.dispatch(SpeedControllerActions.loadMetaSuccess({
          meta: {
            filename: file.name,
            fileSizeMB: file.size / 1024 / 1024,
            duration: 120,
            width: 1920,
            height: 1080,
            fps: 30,
            codec: 'h264',
            audioCodec: 'aac',
            audioBitrate: 128000,
            videoBitrate: 2500000,
            bitrate: 2628000,
            sampleRate: 44100,
            hasAudio: true,
            aspectRatio: '16:9'
          }
        }));
      }, 1000);
    }
  }

  onSpeedSelect(speed: number) {
    this.store.dispatch(SpeedControllerActions.updateSpeed({ speed }));
  }

  start() {
    this.store.dispatch(SpeedControllerActions.startProcessing());
    
    const worker = new Worker(new URL('./speed-controller.worker', import.meta.url));
    
    this.state$.subscribe(state => {
      if (state.status === 'processing' && state.inputFile) {
        worker.postMessage({ config: { 
          inputFile: state.inputFile, 
          speed: state.speed
        } });
      }
    }).unsubscribe();

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        this.store.dispatch(SpeedControllerActions.updateProgress({ progress: data.value }));
      } else if (data.type === 'complete') {
        this.store.dispatch(SpeedControllerActions.processingSuccess({ 
          outputBlob: data.data, 
          outputSizeMB: data.data.size / 1024 / 1024 
        }));
        worker.terminate();
      } else if (data.type === 'error') {
        this.store.dispatch(SpeedControllerActions.processingFailure({ 
          errorCode: data.errorCode, 
          message: data.message 
        }));
        worker.terminate();
      }
    };
  }

  download() {
    this.outputBlob$.subscribe(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `speed_adjusted_video_${Date.now()}.mp4`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 150);
      }
    }).unsubscribe();
  }

  reset() {
    this.store.dispatch(SpeedControllerActions.resetState());
  }
}
