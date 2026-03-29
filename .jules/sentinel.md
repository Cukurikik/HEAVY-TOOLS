## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").
## 2024-05-30 - Fix Path Traversal Risk in Server API Uploads
**Vulnerability:** User-uploaded file names were concatenated directly into temporary storage file paths in `src/app/api/video/[tool]/route.ts` and `src/app/api/plugins/install/route.ts` (e.g., `const inputPath = ${tmpDir}/${crypto.randomUUID()}_${file.name};`).
**Learning:** While using a UUID prefix makes brute-forcing paths more difficult, it does not guarantee protection if the user input `file.name` contains directory traversal sequences (like `../` or newline characters). Trusting unvalidated inputs inside path strings is a systemic risk for path traversal vulnerabilities when passing these paths to file system commands (like `fs.writeFile`).
**Prevention:** Always sanitize the user-provided filename using `path.basename()` before combining it into server-side file paths to strip off any directory structures provided by the client.
