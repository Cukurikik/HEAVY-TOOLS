#!/bin/bash
# ═══════════════════════════════════════════════════
# Omni-Tool Native C++ → WebAssembly Build Script
# 
# Prerequisites:
#   1. Install Emscripten SDK: https://emscripten.org/docs/getting_started/downloads.html
#   2. Activate: source emsdk_env.sh
#   3. Run this script from the project root: bash native/scripts/build-wasm.sh
# ═══════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NATIVE_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$NATIVE_DIR")"
BUILD_DIR="$NATIVE_DIR/build"
OUTPUT_DIR="$PROJECT_ROOT/public/wasm"

echo "╔═══════════════════════════════════════════╗"
echo "║  Omni-Tool C++ → WASM Build Pipeline      ║"
echo "╠═══════════════════════════════════════════╣"
echo "║  Native Dir:  $NATIVE_DIR"
echo "║  Build Dir:   $BUILD_DIR"
echo "║  Output Dir:  $OUTPUT_DIR"
echo "╚═══════════════════════════════════════════╝"

# Check Emscripten
if ! command -v emcc &> /dev/null; then
    echo "❌ ERROR: Emscripten (emcc) not found in PATH!"
    echo "   Install: git clone https://github.com/emscripten-core/emsdk.git"
    echo "   Setup:   cd emsdk && ./emsdk install latest && ./emsdk activate latest"
    echo "   Activate: source emsdk_env.sh"
    exit 1
fi

echo ""
echo "✅ Emscripten found: $(emcc --version | head -n1)"
echo ""

# Create directories
mkdir -p "$BUILD_DIR"
mkdir -p "$OUTPUT_DIR"

# Build using CMake + Emscripten
cd "$BUILD_DIR"
echo "🔧 Running emcmake cmake..."
emcmake cmake "$NATIVE_DIR" -DCMAKE_BUILD_TYPE=Release

echo ""
echo "🔨 Compiling C++ → WASM..."
emmake make -j$(nproc 2>/dev/null || echo 4)

echo ""
echo "📦 Build Results:"
echo "─────────────────────────────────────────"

for wasm_file in "$OUTPUT_DIR"/*.wasm; do
    if [ -f "$wasm_file" ]; then
        size=$(du -h "$wasm_file" | cut -f1)
        echo "  ✅ $(basename "$wasm_file") — $size"
    fi
done

for js_file in "$OUTPUT_DIR"/*.js; do
    if [ -f "$js_file" ]; then
        size=$(du -h "$js_file" | cut -f1)
        echo "  ✅ $(basename "$js_file") — $size"
    fi
done

echo "─────────────────────────────────────────"
echo ""
echo "🚀 BUILD COMPLETE! WASM modules ready at: $OUTPUT_DIR"
echo "   Import in TypeScript:"
echo "     import { NativeEngine } from '@/lib/native-engine';"
echo "     const kernel = await NativeEngine.load('image-kernel');"
