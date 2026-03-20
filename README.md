# Omni-Tool Enterprise

![GHBanner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: <https://ai.studio/apps/aa40f60b-1ab6-45b9-b601-2e1e7294e586>

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set your API key in [.env.local](.env.local):

   **For International Users (Recommended):**
   - Get a **Google Gemini API key** from [Google AI Studio](https://ai.google.dev/gemini-api)
   - Set `GEMINI_API_KEY=your_api_key` in `.env.local`

   **For China Mainland Users:**
   - Get a **DashScope API key** from [DashScope Console](https://dashscope.console.aliyun.com/apiKey)
   - Set `ALIBABA_CLOUD_API_KEY=your_api_key` in `.env.local`

   **Note:** Monitoring/metrics API keys (like Prometheus/Grafana keys) will NOT work for AI models.

3. Run the app:
   `npm run dev`