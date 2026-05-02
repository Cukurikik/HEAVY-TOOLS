🧹 [code health improvement] refactor self.onmessage switch statement into separate handler functions

🎯 What: Refactored the huge switch statement in `self.onmessage` of `src/workers/converter.worker.ts` into individual handler functions (e.g., `handleMagicByteDetector`, `handleHashGenerator`) mapped by a `handlers` record object lookup.

💡 Why: The switch statement contained over 20 large cases, making the worker difficult to read, maintain, and prone to breaking during extensions. Isolating the logic for each specific tool into separate handler functions keeps the code modular, drastically improves readability, and makes it trivial to map new functionality without bloating the main message handler block.

✅ Verification:
- Executed `tsc --noEmit` and confirmed all type checks pass.
- Fixed two existing unit tests failing in jsdom due to `global.URL` missing constructor polyfills by substituting with Node's native `URL` implementation.
- Handled mocking of the Worker in the fallback execution tests to ensure the unit tests correctly verify execution paths.
- Executed the full `pnpm test` suite; all 30 tests correctly report passing.

✨ Result: `converter.worker.ts` is now logically grouped, much easier to read, and ready for further decoupled extension.
