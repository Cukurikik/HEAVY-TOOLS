import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * API: Hugging Face Inference Proxy
 * Forwards requests to HF API server-side to avoid CORS issues.
 * Route: POST /api/hf-inference/:model(*)
 */
app.post('/api/hf-inference/{*modelPath}', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const modelPath = (req.params as Record<string, string>)['modelPath'];
    if (!modelPath) {
      res.status(400).json({ error: 'Model path is required' });
      return;
    }

    const hfUrl = `https://api-inference.huggingface.co/models/${modelPath}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = req.headers['authorization'];
    if (authHeader && typeof authHeader === 'string') {
      headers['Authorization'] = authHeader;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

    const hfResponse = await fetch(hfUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!hfResponse.ok) {
      const errText = await hfResponse.text();
      res.status(hfResponse.status).send(errText);
      return;
    }

    // Forward content-type from HF response
    const contentType = hfResponse.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // Stream the response body to the client
    const arrayBuffer = await hfResponse.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      res.status(504).json({ error: 'Hugging Face API request timed out (120s)' });
      return;
    }
    const message = err instanceof Error ? err.message : 'Unknown proxy error';
    console.error('[HF Proxy Error]', message);
    res.status(502).json({ error: `Proxy error: ${message}` });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
