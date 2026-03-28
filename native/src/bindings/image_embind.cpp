/**
 * Emscripten Embind — Image Kernel C++ ↔ JavaScript Bridge
 * 
 * Exposes all image processing functions to JS/TS via:
 *   import Module from '/wasm/omni-image-kernel.js';
 *   const kernel = await Module();
 *   const result = kernel.resize(pixelData, w, h, newW, newH);
 */

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "image_kernel.h"

using namespace emscripten;

// Helper: Convert JS Uint8Array → C++ pointer + call → return JS Uint8Array
static val js_resize(val jsPixels, int width, int height, int newWidth, int newHeight) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::resize(vec.data(), width, height, newWidth, newHeight);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_sharpen(val jsPixels, int width, int height, float strength) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::sharpen(vec.data(), width, height, strength);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_denoise(val jsPixels, int width, int height, float strength) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::denoise(vec.data(), width, height, strength);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_grayscale(val jsPixels, int width, int height) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::grayscale(vec.data(), width, height);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_adjustBrightnessContrast(val jsPixels, int width, int height, float brightness, float contrast) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::adjustBrightnessContrast(vec.data(), width, height, brightness, contrast);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_gaussianBlur(val jsPixels, int width, int height, int radius) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::gaussianBlur(vec.data(), width, height, radius);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_sepia(val jsPixels, int width, int height) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::sepia(vec.data(), width, height);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_invert(val jsPixels, int width, int height) {
    auto vec = convertJSArrayToNumberVector<uint8_t>(jsPixels);
    auto result = omni::invert(vec.data(), width, height);
    return val(typed_memory_view(result.size(), result.data()));
}

EMSCRIPTEN_BINDINGS(omni_image_kernel) {
    function("resize", &js_resize);
    function("sharpen", &js_sharpen);
    function("denoise", &js_denoise);
    function("grayscale", &js_grayscale);
    function("adjustBrightnessContrast", &js_adjustBrightnessContrast);
    function("gaussianBlur", &js_gaussianBlur);
    function("sepia", &js_sepia);
    function("invert", &js_invert);
}
