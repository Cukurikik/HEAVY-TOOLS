
## 2024-03-23 - [Adding Keyboard Focus Rings to Custom Components]
**Learning:** Custom components like `motion.button` and pure visual elements (like styled `div` wrappers) easily lose their keyboard navigability when stripped of native HTML button semantics. In `Navbar.tsx`, interactive icons and visually simulated buttons lacked the `focus-visible` ring.
**Action:** When working on navigation or custom component libraries in this app, explicitly use `focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none` on interactive elements to ensure they do not become "dead ends" for keyboard users, and convert interactive `div` wrappers into native `<button>` tags so they can receive tab focus naturally.
