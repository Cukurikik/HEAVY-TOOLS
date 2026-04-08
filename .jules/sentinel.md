## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").

## 2024-03-25 - Prevent Path Traversal in Server File Uploads
**Vulnerability:** In `src/app/api/video/[tool]/route.ts`, the file upload endpoint used the unsanitized `file.name` to construct the `inputPath` where the server would save the user's file (`${tmpDir}/${crypto.randomUUID()}_${file.name}`). This permitted a Path Traversal vulnerability where an attacker could upload a file with a name containing `../` to write arbitrary files outside the intended `/tmp/omni/video` directory, such as `../../../../../etc/passwd`.
**Learning:** Even if randomizing the start of a file path (using `crypto.randomUUID()`), appending user-controlled input to the end of a path without sanitization still allows the directory segments to traverse up the file tree.
**Prevention:** Always sanitize filenames from user uploads using `path.basename(file.name)` to strip out any directory paths and safely construct paths using `path.join()`.
