import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Store } from "@ngrx/store";
import { FileDropZoneComponent } from "../shared/components/file-drop-zone/file-drop-zone.component";
import { ProgressRingComponent } from "../shared/components/progress-ring/progress-ring.component";
import { ExportPanelComponent } from "../shared/components/export-panel/export-panel.component";
import {
  SlideshowActions,
  selectSlideshowState,
  selectSlideshowIsLoading,
  selectSlideshowCanProcess,
} from "./slideshow.store";
import { WorkerBridgeService } from "../shared/engine/worker-bridge.service";
import { VideoToolLayoutComponent } from "../shared/components/video-tool-layout/video-tool-layout.component";

@Component({
  selector: "app-slideshow",
  standalone: true,
  imports: [
    CommonModule,
    FileDropZoneComponent,
    ProgressRingComponent,
    ExportPanelComponent,
    VideoToolLayoutComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-video-tool-layout
      title="🎠 Slideshow Maker"
      description="Turn multiple images into a video slideshow with transitions and Ken Burns effect"
      gradientClass="from-amber-400 to-yellow-300"
    >
      <div leftPanel class="space-y-4">
        <app-file-drop-zone
          accept="image/*"
          label="Drop images for slideshow"
          [multiple]="true"
          (filesSelected)="onImagesSelected($event)"
        />

        @if (images.length > 0) {
          <div
            class="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4"
          >
            <!-- Image List -->
            <div class="space-y-2">
              <p class="text-sm text-white/60">
                {{ images.length }} images selected
              </p>
              <div class="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                @for (img of images; track img.name; let i = $index) {
                  <div
                    class="relative rounded-lg overflow-hidden bg-white/5 aspect-square"
                  >
                    <div
                      class="absolute inset-0 flex items-center justify-center text-white/40 text-xs"
                    >
                      {{ i + 1 }}
                    </div>
                    <button
                      (click)="removeImage(i)"
                      class="absolute top-1 right-1 w-5 h-5 bg-red-500/80 rounded-full text-xs text-white flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                }
              </div>
            </div>

            <!-- Duration Per Slide -->
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-white/60">Duration Per Slide</span
                ><span class="text-amber-400 font-mono"
                  >{{ slideDuration }}s</span
                >
              </div>
              <input
                type="range"
                min="1"
                max="10"
                [value]="slideDuration"
                (input)="slideDuration = +gv($event)"
                class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            <!-- Transition -->
            <div class="space-y-2">
              <p class="text-sm text-white/60">Slide Transition</p>
              <div class="grid grid-cols-3 gap-2">
                @for (t of transitions; track t.value) {
                  <button
                    (click)="slideTransition = t.value"
                    [class]="
                      slideTransition === t.value
                        ? 'p-2 rounded-lg border-2 border-amber-400 bg-amber-400/10 text-amber-300 text-sm font-semibold'
                        : 'p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 text-sm hover:bg-white/10'
                    "
                  >
                    {{ t.icon }} {{ t.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Ken Burns Toggle -->
            <div
              class="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
            >
              <div>
                <p class="text-sm text-white/80">🎥 Ken Burns Effect</p>
                <p class="text-xs text-white/40">
                  Slow zoom & pan on each image
                </p>
              </div>
              <button
                (click)="kenBurns = !kenBurns"
                [class]="
                  kenBurns
                    ? 'w-12 h-6 rounded-full bg-amber-500 relative transition-colors'
                    : 'w-12 h-6 rounded-full bg-white/20 relative transition-colors'
                "
              >
                <span
                  [class]="
                    kenBurns
                      ? 'absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all'
                      : 'absolute left-1 top-1 w-4 h-4 bg-white/60 rounded-full transition-all'
                  "
                ></span>
              </button>
            </div>

            <!-- Total Duration -->
            <div
              class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center"
            >
              <p class="text-xs text-white/40">Estimated Duration</p>
              <p class="text-lg font-mono text-amber-400">
                {{ images.length * slideDuration }}s
              </p>
            </div>

            <button
              [disabled]="(isLoading$ | async) || images.length < 2"
              (click)="onProcess()"
              class="w-full py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              @if (isLoading$ | async) {
                <div
                  class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"
                ></div>
                Creating...
              } @else {
                🎠 Create Slideshow
              }
            </button>
          </div>
        }
        @if ((state$ | async)?.status === "error") {
          <div
            class="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400"
          >
            ⚠️ {{ (state$ | async)?.errorMessage }}
          </div>
        }
      </div>
      <div rightPanel class="space-y-4">
        @if ((state$ | async)?.status === "processing") {
          <div class="flex justify-center p-8">
            <app-progress-ring
              [progress]="(state$ | async)?.progress ?? 0"
              label="Creating..."
              [size]="120"
            />
          </div>
        }
        @if ((state$ | async)?.status === "done") {
          <app-export-panel
            [outputBlob]="(state$ | async)?.outputBlob ?? null"
            [outputSizeMB]="(state$ | async)?.outputSizeMB ?? null"
            defaultFilename="omni_slideshow"
          />
        }
      </div>
    </app-video-tool-layout>
  `,
})
export class SlideshowComponent implements OnDestroy {
  private store = inject(Store);
  private bridge = inject(WorkerBridgeService);
  state$ = this.store.select(selectSlideshowState);
  isLoading$ = this.store.select(selectSlideshowIsLoading);
  canProcess$ = this.store.select(selectSlideshowCanProcess);
  images: File[] = [];
  slideDuration = 3;
  slideTransition = "fade";
  kenBurns = true;
  transitions = [
    { value: "none", label: "None", icon: "➖" },
    { value: "fade", label: "Fade", icon: "🌅" },
    { value: "wipe", label: "Wipe", icon: "👈" },
  ];
  gv(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }
  onImagesSelected(files: File[]) {
    this.images = [...this.images, ...files];
    this.store.dispatch(SlideshowActions.loadFile({ file: files[0] }));
  }
  removeImage(i: number) {
    const arr = [...this.images];
    arr.splice(i, 1);
    this.images = arr;
  }
  onProcess() {
    this.store.dispatch(SlideshowActions.startProcessing());
    this.bridge
      .process<unknown, Blob>(
        () =>
          new Worker(new URL("./slideshow.worker", import.meta.url), {
            type: "module",
          }),
        {
          images: this.images,
          duration: this.slideDuration,
          transition: this.slideTransition,
          kenBurns: this.kenBurns,
        },
      )
      .subscribe((msg) => {
        if (msg.type === "progress")
          this.store.dispatch(
            SlideshowActions.updateProgress({ progress: msg.value ?? 0 }),
          );
        else if (msg.type === "complete" && msg.data) {
          const b = msg.data as Blob;
          this.store.dispatch(
            SlideshowActions.processingSuccess({
              outputBlob: b,
              outputSizeMB: b.size / 1_048_576,
            }),
          );
        } else if (msg.type === "error") {
          this.store.dispatch(
            SlideshowActions.processingFailure({
              errorCode: msg.errorCode ?? "UNKNOWN_ERROR",
              message: msg.message ?? "Slideshow failed",
            }),
          );
        }
      });
  }
  ngOnDestroy() {
    this.store.dispatch(SlideshowActions.resetState());
  }
}
