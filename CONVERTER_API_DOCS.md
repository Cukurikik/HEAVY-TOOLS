# CONVERTER API DOCS

## Converter Engine API Reference (30 Tools)

### Infrastructure
| Endpoint | Method | Description |
|---|---|---|
| `/api/converter/health` | GET | Health check: DB connectivity status |
| `/api/converter/detect-mime` | POST | Magic byte file type detection (anti-spoofing) |

### Cloud Storage (Firebase/GCS)
| Endpoint | Method | Description |
|---|---|---|
| `/api/converter/upload-url` | POST | Generate signed V4 upload URL |
| `/api/converter/download-url` | POST | Generate signed download URL (1hr expiry) |
| `/api/converter/cleanup` | POST | Cron: purge expired unpinned files |
| `/api/converter/webhooks/storage` | POST | Storage event webhook listener |

### AI Proxy (Gemini + Google Cloud)
| Endpoint | Method | Description |
|---|---|---|
| `/api/converter/ai/ocr` | POST | Smart OCR (Cloud Vision + Gemini fallback) |
| `/api/converter/ai/translate` | POST | Text/subtitle translation |
| `/api/converter/ai/data-map` | POST | AI data mapping (CSV→JSON semantic) |
| `/api/converter/ai/describe` | POST | Image metadata/alt-text generator |
| `/api/converter/ai/nlp` | POST | Natural language unit/currency parser |
| `/api/converter/ai/code` | POST | Markdown→HTML with Tailwind injection |

### Cloud Run Fallback
| Endpoint | Method | Description |
|---|---|---|
| `/api/converter/cloud-run-trigger` | POST | Trigger heavy conversion jobs |
| `/api/converter/cloud-status` | GET | Poll Cloud Run job status |
| `/api/converter/webhooks/cloud-run` | POST/GET | Webhook + polling for Cloud Run results |

### Quota & Payments
| Endpoint | Method | Description |
|---|---|---|
| `/api/converter/quota-reset` | POST | Cron: monthly quota reset |
| `/api/converter/webhooks/payment` | POST | Stripe payment webhook |

### Realtime & Telemetry
| Endpoint | Method | Description |
|---|---|---|
| `/api/converter/events` | GET (SSE) | Server-Sent Events for live status |
| `/api/converter/telemetry` | POST/GET | Usage analytics + admin dashboard |
| `/api/converter/log-error` | POST | WASM crash reporter |

### Server Actions (Next.js App Router)
| Action | Module | Description |
|---|---|---|
| `saveConverterHistory` | converter-actions | Log conversion result |
| `getConverterHistory` | converter-actions | Fetch user history (paginated) |
| `deleteConverterHistory` | converter-actions | Delete history entry |
| `saveConverterPreset` | converter-actions | Save custom preset |
| `getConverterPresets` | converter-actions | Fetch user + default presets |
| `deleteConverterPreset` | converter-actions | Delete user preset |
| `pinConvertedFile` | converter-actions | Pin file (prevent auto-delete) |
| `unpinConvertedFile` | converter-actions | Unpin file (24hr auto-expiry) |
| `fetchCurrencyRates` | converter-actions | Get cached exchange rates |
| `fetchTimezoneData` | converter-actions | Get timezone offset data |
| `checkFileSizeLimit` | quota-actions | Validate file size vs tier |
| `checkBatchLimit` | quota-actions | Validate batch count vs tier |
| `checkAdvancedFormatAccess` | quota-actions | Guard CAD/RAW format access |
| `getConverterQuota` | quota-actions | Get remaining quota info |
| `getConverterFeatureFlags` | quota-actions | Get feature toggle states |
