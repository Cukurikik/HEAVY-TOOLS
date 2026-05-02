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

if (typeof global !== 'undefined') {
  if (typeof global.URL === 'undefined') {
    // Basic Mock for URL Constructor.
    global.URL = class URL {
      constructor(url: string, base?: string | URL) {}
      static createObjectURL = () => 'blob:test-url';
      static revokeObjectURL = () => {};
    } as any;
  } else {
    if (typeof global.URL.createObjectURL === 'undefined') {
      global.URL.createObjectURL = () => 'blob:test-url';
    }
    if (typeof global.URL.revokeObjectURL === 'undefined') {
      global.URL.revokeObjectURL = () => {};
    }
  }
}
