## 2024-05-18 - Prevent Sensitive Error Data Leakage
**Vulnerability:** Raw error objects from FFmpeg and browser APIs (`error.message` and `console.error`) were being rendered directly in the user interface and browser console.
**Learning:** Returning unhandled exception messages to the client risks exposing internal stack traces, system paths, and unexpected framework vulnerabilities to potential attackers.
**Prevention:** Catch error blocks should log a sanitized version of the error or omit sensitive details, while the state presented to the user should be a generic, friendly, and secure fallback message (e.g. "Processing failed securely").
## 2024-05-24 - Remove hardcoded API keys from fallback array
**Vulnerability:** Hardcoded API keys for Alibaba Cloud (`sk-baadd0ecc39547d68b00872b10f95e87` and `sk-4be34075ee564d4d85fd6357f70898e2`) were present in `src/app/api/ai/route.ts` as fallback options.
**Learning:** Developers sometimes hardcode secrets temporarily to bypass rate limits or ensure fallback functionality without setting up proper environment variables. This exposes the secrets in source control.
**Prevention:** Always use environment variables for sensitive data like API keys. Enforce secrets scanning in pre-commit hooks and CI pipelines to prevent accidental commits of hardcoded credentials.
