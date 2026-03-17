import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class OnnxAudioService {
  readonly modelLoaded = signal(false);
  readonly downloadProgress = signal(0);

  async loadModel(modelUrl: string): Promise<unknown> {
    this.downloadProgress.set(0);
    try {
      const ort = await import("onnxruntime-web");
      const session = await ort.InferenceSession.create(modelUrl, {
        executionProviders: ["wasm"],
      });
      this.modelLoaded.set(true);
      this.downloadProgress.set(100);
      return session;
    } catch (err) {
      this.modelLoaded.set(false);
      throw err;
    }
  }

  isReady(): boolean {
    return this.modelLoaded();
  }
}
