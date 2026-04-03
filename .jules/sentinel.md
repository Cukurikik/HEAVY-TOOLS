## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").

## 2024-05-18 - Path Traversal in File Uploads
**Vulnerability:** Unsanitized user-provided filenames (e.g. `file.name`) in `FormData` can include directory traversal sequences (like `../`), potentially allowing arbitrary file writes outside the intended server directory.
**Learning:** The `crypto.randomUUID()` prefix alone does not protect against path traversal if the malicious input contains `../` sequences that escape the directory hierarchy.
**Prevention:** Always sanitize uploaded filenames using `path.basename()` before concatenating them into server-side file paths.
