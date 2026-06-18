## 2024-03-19 - React Icons Import Tree-Shaking Bottleneck
**Learning:** Using `import * as Icons from "lucide-react"` combined with dynamic property lookups completely defeats Next.js and Webpack tree-shaking mechanisms. In this specific Next.js codebase, it pulled in the entire `lucide-react` library (~160 KB extra JavaScript) into the `/audio` route's client bundle, rather than just the ~30 icons actually needed.
**Action:** Always import icons explicitly by name (e.g., `import { Scissors } from "lucide-react"`) and store the component reference itself when mapping configurations, rather than relying on string keys and wildcard imports. This drastically reduces First Load JS size.

## 2024-03-29 - PDF Forge Icons Import Tree-Shaking Bottleneck
**Learning:** Found another instance where `import * as Icons from "lucide-react"` was used in `src/modules/pdf-forge/components/PdfForgeDashboard.tsx` to dynamically render icons based on string names from the `PDF_TOOLS` constants file. This causes the same tree-shaking failure, bloating the `/pdf` route bundle.
**Action:** Applied the explicit import pattern to `src/modules/pdf-forge/constants/tools.ts`, importing only the 30 necessary icons and assigning them to the `icon` property as component references, rather than string keys. This ensures only used icons are bundled.
