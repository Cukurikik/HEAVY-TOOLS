# GEMINI.md - Omni-Tool App (AI Studio)

## Project Overview
The **Omni-Tool App** is a high-performance, hybrid-online enterprise suite built with **Angular 21**. It follows a "Local-First, Cloud-Optional" philosophy, leveraging modern web technologies like **WASM**, **WebGPU**, and **Web Workers** for heavy client-side processing (Video, Audio, AI), while using **Supabase/Firebase** for cloud synchronization and authentication.

### Core Technologies
- **Framework:** Angular 21+ (Standalone Components, Signal-based Reactivity)
- **State Management:** NgRx (Store, Effects, Selectors, Signals)
- **Styling:** Tailwind CSS 4, Framer Motion (via `motion` package), GSAP
- **Processing Engines:**
  - **Video:** FFmpeg WASM (v0.12.x)
  - **Audio:** Offline Audio Context, ONNX Runtime Web (Stem Splitting)
  - **Image:** Canvas API, WebGL, TensorFlow.js (AI Upscaling)
  - **PDF:** pdf-lib, Tesseract WASM (OCR)
- **Storage:** OPFS (Origin Private File System) for large file handling

### Architecture
The project follows a modular, isolated architecture:
- `src/app/core/`: Singleton services, guards, and interceptors.
- `src/app/shared/`: Reusable components, pipes, and directives.
- `src/app/modules/`: Feature-specific modules (Video, Audio, Image, Converter, PDF), each lazy-loaded.
- `src/app/layout/`: Shell components (Navbar, Sidebar).
- `src/app/store/`: Global NgRx state management.

---

## Building and Running

### Prerequisites
- Node.js (Latest LTS recommended)
- Gemini API Key

### Key Commands
- **Install Dependencies:** `npm install`
- **Development Server:** `npm run dev` (Runs on `http://localhost:3000`)
  - *Note: Requires `GEMINI_API_KEY` to be set in environment or `.env` file.*
- **Production Build:** `npm run build`
- **Run Unit Tests:** `npm test`
- **Linting:** `npm run lint`
- **SSR Server:** `npm run serve:ssr:app` (Runs the built SSR application)

---

## Development Conventions

### 1. Component Architecture
- Always use **Standalone Components**.
- Prefer `ChangeDetectionStrategy.OnPush` for performance.
- Use **Angular Signals** for local state and **NgRx** for global state.
- Utilize `AsyncPipe` to consume Observables in templates to avoid memory leaks.

### 2. State Management
- Follow the NgRx pattern: **Actions -> Reducers -> Selectors -> Effects**.
- Keep the state normalized and serializable.
- Use **NgRx Signals Store** for simpler feature-level state when appropriate.

### 3. Performance & Security
- Heavy operations (FFmpeg, AI models) MUST run in **Web Workers**.
- Implement **COOP/COEP headers** to enable `SharedArrayBuffer` for FFmpeg WASM.
- Use **OPFS** for temporary storage of large assets to avoid memory bloat.

### 4. Styling & Animations
- Use **Tailwind CSS 4** utility classes for styling.
- Implement complex animation sequences using **GSAP** or **Angular Animations API**.
- Use the `motion` package for interactive feedback and micro-interactions.

### 5. Type Safety
- Maintain strict TypeScript configurations.
- Define **Zod Schemas** for data validation at runtime, especially for file processing and API responses.

---

## Project Structure (Key Folders)
- `src/app/modules/audio/`: 30+ Audio tools (Recorder, Trimmer, Splitter, etc.)
- `src/app/modules/video/`: Video editing tools (Trimmer, Merger, Stabilizer, etc.)
- `src/app/modules/converter/`: Universal file conversion engine.
- `src/app/modules/pdf/`: 30+ PDF processing tools.
- `src/app/modules/image-matrix/`: Image processing and AI vision tools.
