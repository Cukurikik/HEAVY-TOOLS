import {
  Injectable,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-3GKPD7AG.js";

// src/app/modules/video/shared/engine/ffmpeg.service.ts
var FFmpegService = class _FFmpegService {
  ffmpeg = null;
  isLoaded = signal(false, ...ngDevMode ? [{ debugName: "isLoaded" }] : (
    /* istanbul ignore next */
    []
  ));
  isLoading = signal(false, ...ngDevMode ? [{ debugName: "isLoading" }] : (
    /* istanbul ignore next */
    []
  ));
  loadPromise = null;
  async load() {
    if (this.isLoaded())
      return;
    if (this.loadPromise)
      return this.loadPromise;
    this.loadPromise = this._doLoad();
    return this.loadPromise;
  }
  async _doLoad() {
    try {
      this.isLoading.set(true);
      const { FFmpeg } = await import("./chunk-QGEHUEVD.js");
      const { toBlobURL } = await import("./chunk-4D5FANVU.js");
      const ff = new FFmpeg();
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
      await ff.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm")
      });
      this.ffmpeg = ff;
      this.isLoaded.set(true);
    } catch {
      this.loadPromise = null;
      throw new Error("FFMPEG_LOAD_FAILED");
    } finally {
      this.isLoading.set(false);
    }
  }
  async getMetadata(file) {
    await this.load();
    const ff = this.ffmpeg;
    const { fetchFile } = await import("./chunk-4D5FANVU.js");
    const inputName = `meta_${Date.now()}.mp4`;
    try {
      ff.writeFile(inputName, await fetchFile(file));
      let output = "";
      ff.on("log", ({ message }) => {
        output += String(message ?? "") + "\n";
      });
      try {
        await ff.exec(["-i", inputName, "-f", "null", "/dev/null"]);
      } catch {
      }
      return this._parseMetaFromLog(output, file);
    } finally {
      try {
        ff.deleteFile(inputName);
      } catch {
      }
    }
  }
  _parseMetaFromLog(log, file) {
    const durMatch = log.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
    const duration = durMatch ? parseInt(durMatch[1]) * 3600 + parseInt(durMatch[2]) * 60 + parseFloat(durMatch[3]) : 0;
    const resMatch = log.match(/(\d{2,5})x(\d{2,5})/);
    const width = resMatch ? parseInt(resMatch[1]) : 0;
    const height = resMatch ? parseInt(resMatch[2]) : 0;
    const fpsMatch = log.match(/(\d+(?:\.\d+)?)\s*fps/);
    const fps = fpsMatch ? parseFloat(fpsMatch[1]) : 30;
    const videoCodecMatch = log.match(/Video:\s*(\w+)/);
    const codec = videoCodecMatch ? videoCodecMatch[1] : "unknown";
    const audioCodecMatch = log.match(/Audio:\s*(\w+)/);
    const audioCodec = audioCodecMatch ? audioCodecMatch[1] : null;
    const bitrateMatch = log.match(/bitrate:\s*(\d+)\s*kb\/s/);
    const videoBitrate = bitrateMatch ? parseInt(bitrateMatch[1]) : 0;
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const g = width && height ? gcd(width, height) : 1;
    const aspectRatio = width && height ? `${width / g}:${height / g}` : "16:9";
    return {
      filename: file.name,
      fileSizeMB: file.size / 1048576,
      duration,
      width,
      height,
      fps,
      codec,
      audioCodec,
      audioBitrate: 128,
      videoBitrate,
      bitrate: videoBitrate,
      sampleRate: 44100,
      hasAudio: !!audioCodec,
      aspectRatio
    };
  }
  async runCommand(args, onProgress) {
    await this.load();
    const ff = this.ffmpeg;
    if (onProgress)
      ff.on("progress", ({ progress }) => {
        onProgress(Math.min(Math.round(Number(progress) * 100), 99));
      });
    await ff.exec(args);
    const outputName = args[args.length - 1];
    try {
      return await ff.readFile(outputName);
    } catch {
      return new Uint8Array(0);
    }
  }
  deleteFile(name) {
    if (!this.ffmpeg)
      return;
    try {
      this.ffmpeg.deleteFile(name);
    } catch {
    }
  }
  isReady() {
    return this.isLoaded.asReadonly();
  }
  static \u0275fac = function FFmpegService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FFmpegService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _FFmpegService, factory: _FFmpegService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FFmpegService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  FFmpegService
};
//# sourceMappingURL=chunk-BYCJNMIZ.js.map
