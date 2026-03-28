# Omni-Tool Plugin SDK (Phase 10 Documentation)

## Introduction
The Omni-Tool Plugin system is a self-hosted, 100% offline-compatible background execution engine. It allows Kapten to distribute completely isolated tools running safely within `worker_threads` and a generic `vm` Node.js context. 

## 1. File Structure
Every plugin requires a directory containing at minimum:
- `plugin.json` (The manifest file)
- `index.js` (The execution code)

### Example `plugin.json`
```json
{
  "id": "omni-image-optimizer",
  "name": "Image Optimizer Ultra",
  "version": "1.0.1",
  "description": "Compress images automatically using WASM within the backend.",
  "author": "Kapten",
  "main": "index.js",
  "price": 0,
  "permissions": ["read:local_files"]
}
```

## 2. Execution Context
Your `index.js` file is executed inside a hardened `vm` Sandbox where direct access to global `fs` and `process.env` is restricted. 

### Hooking into the API
```javascript
module.exports = {
  // Method 'run' will be invoked when triggered via 'execute' route
  run: async (payload, api) => {
    // Report progress to the frontend UI
    api.emitProgress(50);
    
    // Safely write to Virtual Filesystem scoped only to your Plugin
    api.fs.writeFile('temp.txt', 'Processing payload: ' + payload.taskId);
    
    // Secure localized DB storage
    await api.db.set('lastTask', payload.taskId);
    
    // Call network strictly through HTTPS interceptors
    const res = await api.fetch('https://some-api.com/data');
    
    api.emitProgress(100);
    return { success: true, processed: await res.json() };
  }
};
```

## 3. CLI Commands
Use the global binary (if linked) or run via node:
- **`node bin/omni-plugin.js init <name>`**: Generates standard templates.
- **`node bin/omni-plugin.js build <name>`**: Packages it securely using `adm-zip` to output `<name>-release.zip` ready to be uploaded to Dashboard.
