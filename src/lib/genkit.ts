import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance for the workspace.
 * Uses the default GEMINI_API_KEY from environment variables.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiKey: process.env.GEMINI_API_KEY })
  ]
});

/**
 * A simple test flow to verify Genkit Dev UI connectivity.
 */
export const helloFlow = ai.defineFlow({
  name: 'helloFlow',
  inputSchema: z.string(),
  outputSchema: z.string(),
}, async (name) => {
  return `Hello, ${name}! Genkit is successfully connected to the Omni-Tool Workspace.`;
});

/**
 * Creates a configured Genkit instance dynamically with a specific Gemini API key.
 * This is used for generating images or video sequences via Google's models with fallback keys.
 */
export const createGenkitInstance = (apiKey: string) => {
  return genkit({
    plugins: [
      googleAI({ apiKey })
    ]
  });
};

