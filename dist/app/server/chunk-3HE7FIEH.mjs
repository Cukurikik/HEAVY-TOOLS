import './polyfills.server.mjs';
import {
  Injectable,
  Subject,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-CX47CWGJ.mjs";

// src/app/modules/video/shared/engine/worker-bridge.service.ts
var WorkerBridgeService = class _WorkerBridgeService {
  process(workerFactory, config) {
    const subject = new Subject();
    let worker = null;
    let timeoutId = null;
    let done = false;
    const cleanup = () => {
      done = true;
      if (timeoutId !== null)
        clearTimeout(timeoutId);
      if (worker) {
        try {
          worker.terminate();
        } catch {
        }
      }
      worker = null;
    };
    try {
      worker = workerFactory();
    } catch {
      subject.error({ type: "error", errorCode: "WORKER_INIT_FAILED", message: "Worker could not be started." });
      return subject.asObservable();
    }
    timeoutId = setTimeout(() => {
      if (!done) {
        cleanup();
        subject.next({ type: "error", errorCode: "FFMPEG_TIMEOUT", message: "Operation timed out after 15 seconds." });
        subject.complete();
      }
    }, 15e3);
    worker.onmessage = (event) => {
      const msg = event.data;
      subject.next(msg);
      if (msg.type === "complete" || msg.type === "error") {
        cleanup();
        subject.complete();
      }
    };
    worker.onerror = (err) => {
      if (!done) {
        cleanup();
        subject.next({ type: "error", errorCode: "WORKER_CRASHED", message: err.message });
        subject.complete();
      }
    };
    worker.postMessage({ type: "start", config });
    return subject.asObservable();
  }
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 150);
  }
  static \u0275fac = function WorkerBridgeService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _WorkerBridgeService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _WorkerBridgeService, factory: _WorkerBridgeService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WorkerBridgeService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  WorkerBridgeService
};
//# sourceMappingURL=chunk-3HE7FIEH.mjs.map
