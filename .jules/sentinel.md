## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").

## 2024-03-21 - Remove Hardcoded Alibaba Cloud API Keys
**Vulnerability:** Secondary and tertiary API keys for Alibaba Cloud were hardcoded directly in `src/app/api/ai/route.ts` inside the `FALLBACK_KEYS` array, exposing sensitive credentials in the source code.
**Learning:** Hardcoding secrets like API keys directly in the codebase exposes them to anyone with access to the repository, potentially leading to unauthorized usage, data breaches, and financial impact. API keys must always be injected via environment variables and never be committed to source control.
**Prevention:** Always rely on `process.env.*` for accessing API credentials, including secondary and tertiary fallback keys. Consider implementing pre-commit hooks to automatically scan the codebase for secrets using tools like `trufflehog` or `git-secrets`.
