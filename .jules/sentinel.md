## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").

## 2024-03-20 - [Fix missing file upload validation in Audio Studio]
**Vulnerability:** The AudioToolInterface component accepted file uploads via drag-and-drop and input selection without validating file type or size.
**Learning:** Client-side input validation is crucial to prevent processing excessively large files that could lead to Denial of Service (DoS) and to prevent potentially malicious non-audio files from being handled by the application's audio engine.
**Prevention:** Implement file type (`file.type.startsWith("audio/")`) and size checks (e.g., `file.size <= 50 * 1024 * 1024`) directly in the event handlers (`handleDrop` and `handleChange`) before updating the component state.
