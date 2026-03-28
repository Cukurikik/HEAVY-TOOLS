# Omni-Tool PDF Engine (Backend API Docs)
*Vercel serverless specifications integrating Firebase Storage and Prisma Postgres.*

## 1. Storage Connectivity (Firebase Admin)
- `POST /api/pdf/upload-url` 
  - Payload: `{ fileName, fileSize, contentType }`
  - Constraints: `< 50MB`, `application/pdf`
  - Returns Signed Firebase Admin PUT URL.
- `GET /api/pdf/download-url?fileId={uuid}`
  - Returns Signed GET URL valid for 1 hour.
- `POST /api/webhooks/storage-pdf`
  - Validates completion and injects DB.

## 2. Server Actions (Prisma ORM)
*All actions guarded by active Session checks (MOCK_USER_ID used in dev)*
- `pdf.actions.ts`:
  - `savePdfTaskHistory(zodPayload)`
  - `getPdfHistory(page, limit)`
  - `deletePdfHistory(id)`
  - `saveSignatureTemplate() / getSignatureTemplates()`
  - `togglePinCloudPdf()`
  - `deleteCloudPdf()`
- `quota.actions.ts`:
  - `getPdfQuota()` -> Returns AI Credits, Feature flags.
  - `deductPdfCredits(amount)`
- `telemetry.actions.ts`:
  - `getPdfAnalyticsDashboard()` -> Stats admin dashboard.

## 3. Background Jobs & AI Proxies
- `GET /api/pdf/cron/cleanup` (Auth: Vercel Cron Secret) -> purges 24h unpinned PDFs.
- `GET /api/pdf/cron/reset-quota` -> refills credits.
- `POST /api/pdf/ai/[operation]` -> Operations: `ocr`, `summarize`, `redact`, `extract-table`, `chat`. Features Zod validation and Telemetry embedding.
- `POST /api/pdf/cloud-convert` -> Interface routing `pdf-to-word`, `compress-ghostscript` jobs bypassing WASM client failures.
- `GET /api/pdf/events` (SSE) -> Zero latency PubSub fallback mirroring Socket statuses.
