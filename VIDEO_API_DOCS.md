# Omni-Tool Video Backend API Documentation

## 1. Cloud Storage Presigned URLs
**Meringankan beban server dengan upload langsung ke S3/Supabase.**

### `POST /api/video/upload-url`
Mendapatkan pre-signed URL terbatas 1 jam untuk upload video.
- **Request Body**: `{ "fileName": "video.mp4", "fileSize": 10485760, "mimeType": "video/mp4" }`
- **Response**: `{ "success": true, "uploadUrl": "...", "key": "dev-user-id/video.mp4" }`
- **Error Codes**: `400` Invalid MIME, `413` Size exceeds tier, `401` Unauthorized.

### `GET /api/video/download-url?videoId=XYZ`
Mendapatkan pre-signed URL download video milik user.

---

## 2. Fallback Firebase Integration
**Dipanggil jika FFmpeg WASM browser crash (Memory OOM/Incompatible).**

### `POST /api/video/cloud-encode`
- **Request Body**: `{ "videoId": "v123", "operation": "trimmer", "options": { "start": 0 }, "durationSeconds": 120 }`
- **Response**: `{ "success": true, "jobId": "fire-job-xyz" }`
- **Validations**: Jika `durationSeconds` > 600, mengembalikan `413` untuk mencegah cost Firebase membengkak.

---

## 3. AI Proxy Endpoints
**Menangani koneksi AI ke LLMs secara server-side agar aman.**

### `POST /api/video/ai/subtitle`
Menerima audio extract dan meneruskan ke OpenAI Whisper.
- **Form Data**: `audio (Blob/File)`
- **Response**: SRT/VTT plain text. (Dibatasi Redis Rate Limit).

### `POST /api/video/ai/chapter`
Membaca transkrip dan merangkum jadi chapters (menggunakan Gemini 1.5 Pro).
- **Request Body**: `{ "transcript": "..." }`
- **Response**: `[{ "timestamp": "00:00", "title": "Intro" }]`

---

## 4. Telemetry & Telemetri
### `POST /api/video/log-error`
Menangkap browser OOM / SAB Crash dari frontend.
- **Request Body**: `{ "errorType": "SAB_MISSING", "errorMessage": "SharedArrayBuffer not defined", "userAgent": "..." }`
