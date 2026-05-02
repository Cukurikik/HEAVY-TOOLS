## 2024-05-24 - [CRITICAL] Fix dangerouslySetInnerHTML in InspectorPanel
**Vulnerability:** Usage of `dangerouslySetInnerHTML` for a static style tag exposes the component to potential cross-site scripting (XSS) vulnerabilities if the string were ever dynamically generated or manipulated.
**Learning:** Hardcoded styles should never be injected via `dangerouslySetInnerHTML`.
**Prevention:** Always refactor inline `<style>` tags with `dangerouslySetInnerHTML` into standard CSS files (e.g. globals.css) or standard styled components.
