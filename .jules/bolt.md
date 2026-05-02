## 2024-03-19 - React Icons Import Tree-Shaking Bottleneck
**Learning:** Using `import * as Icons from "lucide-react"` combined with dynamic property lookups completely defeats Next.js and Webpack tree-shaking mechanisms. In this specific Next.js codebase, it pulled in the entire `lucide-react` library (~160 KB extra JavaScript) into the `/audio` route's client bundle, rather than just the ~30 icons actually needed.
**Action:** Always import icons explicitly by name (e.g., `import { Scissors } from "lucide-react"`) and store the component reference itself when mapping configurations, rather than relying on string keys and wildcard imports. This drastically reduces First Load JS size.
## 2026-05-02 - Admin Stats Query Optimization
**Learning:** Sequential database queries inside loops (N+1 query problem) in API routes introduce significant latency overhead, especially when communicating with remote databases like Firestore.
**Action:** Always replace sequential `where('field', '==', item).get()` queries inside a loop with a single `where('field', 'in', array).get()` query. This reduces network roundtrips from O(N) to O(1) and, in this specific endpoint, reduced query time by ~80%.
## 2026-05-02 - CI Environment Updates
**Learning:** Node.js 20 actions are deprecated on GitHub Actions runners, resulting in warnings in the CI logs. Furthermore, the CI pipeline failed because the pnpm lockfile was out of sync.
**Action:** Updated all CI workflows to use `actions/setup-node@v4` with Node 22, `pnpm/action-setup@v4` with pnpm 9, and ensured `cache-dependency-path: pnpm-lock.yaml` is properly configured. Resolved the frozen lockfile error by syncing `pnpm-lock.yaml` locally with `pnpm install --no-frozen-lockfile`.
