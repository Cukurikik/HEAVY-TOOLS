import '@testing-library/jest-dom'

if (typeof global !== 'undefined') {
  if (typeof global.DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
      a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
      constructor() {}
    } as any;
  }
  if (typeof global.Worker === 'undefined') {
    global.Worker = class Worker {
      constructor() {}
      postMessage() {}
      terminate() {}
    } as any;
  }
}
