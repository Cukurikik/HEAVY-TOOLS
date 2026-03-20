export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import the Genkit flows on server startup
    // This allows the Genkit Developer UI to discover the flows immediately
    await import('./lib/genkit');
    console.log('✅ Genkit Developer UI & Flows registered successfully.');
  }
}
