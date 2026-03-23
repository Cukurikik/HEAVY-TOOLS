/**
 * 100. Final COOP/COEP Review Script
 * A simple utility to ping localhost and assert the strict security headers 
 * essential for FFmpeg WASM SharedArrayBuffer to function.
 */

async function verifyHeaders() {
  try {
    const res = await fetch('http://localhost:3000/');
    const coop = res.headers.get('Cross-Origin-Opener-Policy');
    const coep = res.headers.get('Cross-Origin-Embedder-Policy');
    const cors = res.headers.get('Cross-Origin-Resource-Policy');
    
    console.log("=== WASM Security Headers Check ===");
    console.log(`COOP: ${coop} ${coop === 'same-origin' ? '✅' : '❌'}`);
    console.log(`COEP: ${coep} ${coep === 'require-corp' ? '✅' : '❌'}`);
    console.log(`CORP: ${cors} ${cors === 'cross-origin' ? '✅' : '❌'}`);
    
    if (coop !== 'same-origin' || coep !== 'require-corp') {
        process.exit(1);
    }
  } catch (e) {
    console.log("Server not reachable. Please run 'npm run dev' first.");
  }
}

verifyHeaders();
