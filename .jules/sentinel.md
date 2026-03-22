## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").

## 2024-05-20 - Prevent FFmpeg Filter Parameter Injection (Watermark Tool)
**Vulnerability:** User input (`text`) was directly interpolated into an FFmpeg `-vf drawtext` filter string wrapped in single quotes without escaping (`drawtext=text='${text}'...`).
**Learning:** An attacker could input a single quote (`'`), backslash (`\`), or colon (`:`) to break out of the `text` parameter encapsulation and inject arbitrary FFmpeg filters, potentially leading to DoS or logic abuse, even in a WASM environment.
**Prevention:** Always sanitize and escape user inputs intended for FFmpeg filtergraphs. specifically for `drawtext`: replace `\` with `\\\\`, `:` with `\\:`, and `'` with `'\\''` before interpolation.
