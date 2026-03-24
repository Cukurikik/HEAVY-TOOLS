# OMNI-TOOL AUDIO ENGINE API DOCS

## Arsitektur Utama
- **Local-First:** Operasi mayor (Trim, Pitch, EQ) berjalan via Browser `FFmpeg.wasm`.
- **Cloud-Optional (Fallback):** Operasi berat (Stem Splitter 4-Track, 4K Upscale AI, Metadata SEO) di-route via Serverless Proxy (Vercel/Fal.ai) di `/api/audio/cloud-encode`.

## API Routes

### 1. `POST /api/audio/upload-url`
Menghasilkan S3 Presigned URL untuk bypass batas Vercel (`10gb`). Validasi lossless Mime (`audio/flac`, `audio/wav`).

### 2. `POST /api/audio/cloud-encode`
- Menerima `audioUrl` dan `operation` (contoh: `targetLUFS`).
- Melempar request ke `ServerlessAudioProxy`.

### 3. `POST /api/webhooks/cloud-audio`
Menangkap `event: COMPLETE` dari serverless provider dan mendorong pemberitahuan via WebSockets (`broadcastAudioEvent`).

### 4. `GET /api/audio/cron/aggregate`
Mengumpulkan baris `AudioAnalytics` dari Prisma into aggregasi metrik harian (Process time average, Crash rates).

### 5. `GET /api/audio/sse`
Menyediakan mekanisme Server-Sent Events HTTP konvensional apabila UI user memblokir protokol `wss://` (WebSockets).
