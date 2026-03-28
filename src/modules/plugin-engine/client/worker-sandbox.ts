export function createSandboxWorker(code: string): Worker {
  // We wrap the code to ensure it's evaluated in strict mode and isolated context
  const wrappedCode = `
    "use strict";
    self.onmessage = async (e) => {
      try {
        const result = await (async () => {
          ${code}
        })();
        self.postMessage({ type: 'SUCCESS', result });
      } catch (error) {
        self.postMessage({ type: 'ERROR', error: error.message });
      }
    };
  `;

  const blob = new Blob([wrappedCode], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);
  return new Worker(url);
}
