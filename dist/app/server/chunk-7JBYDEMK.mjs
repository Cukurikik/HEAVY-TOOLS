import './polyfills.server.mjs';

// node_modules/@ffmpeg/ffmpeg/dist/esm/empty.mjs
var FFmpeg = class {
  constructor() {
    throw new Error("ffmpeg.wasm does not support nodejs");
  }
};

export {
  FFmpeg
};
//# sourceMappingURL=chunk-7JBYDEMK.mjs.map
