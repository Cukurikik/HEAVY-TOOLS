
## $(date +%Y-%m-%d) - Optimize inline array allocations
**Learning:** Hard-coded or dummy inline arrays within a React component's render cycle trigger unnecessary garbage collection and break referential equality for child components relying on `React.memo` or effects. Furthermore, wildcard imports combined with dynamic lookup on large libraries like `lucide-react` entirely break Next.js/Webpack tree-shaking, resulting in heavily bloated client bundles.
**Action:** Always hoist constant arrays/objects to the module scope and replace dynamic wildcard imports (`import * as Icons from 'lucide-react'`) with explicit imports to leverage bundler tree-shaking.
