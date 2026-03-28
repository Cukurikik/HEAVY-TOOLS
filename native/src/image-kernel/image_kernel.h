#pragma once
/**
 * Omni-Tool Image Processing Kernel
 * Pure C++17 — Zero external dependencies
 * 
 * Operations performed on raw RGBA pixel buffers (uint8_t arrays).
 * Designed for WebAssembly compilation via Emscripten Embind.
 * 
 * Performance: 5-10x faster than equivalent Canvas 2D / JS operations.
 */

#include <cstdint>
#include <vector>

namespace omni {

/**
 * Lanczos-3 Resize — High-quality downscaling/upscaling
 * @param pixels   Input RGBA pixel buffer (width * height * 4 bytes)
 * @param width    Source width in pixels
 * @param height   Source height in pixels
 * @param newWidth Target width
 * @param newHeight Target height
 * @return Resized RGBA pixel buffer
 */
std::vector<uint8_t> resize(
    const uint8_t* pixels, int width, int height,
    int newWidth, int newHeight
);

/**
 * Unsharp Mask Sharpen
 * @param pixels   Input RGBA pixel buffer
 * @param width    Width in pixels
 * @param height   Height in pixels
 * @param strength Sharpening strength (0.0 - 5.0, default 1.0)
 * @return Sharpened RGBA pixel buffer
 */
std::vector<uint8_t> sharpen(
    const uint8_t* pixels, int width, int height,
    float strength
);

/**
 * Bilateral Denoise Filter — Edge-preserving noise removal
 * @param pixels   Input RGBA pixel buffer
 * @param width    Width in pixels
 * @param height   Height in pixels
 * @param strength Denoise strength (0.0 - 5.0, default 1.5)
 * @return Denoised RGBA pixel buffer
 */
std::vector<uint8_t> denoise(
    const uint8_t* pixels, int width, int height,
    float strength
);

/**
 * Grayscale Conversion — ITU-R BT.709 luminosity method
 * @param pixels   Input RGBA pixel buffer
 * @param width    Width in pixels
 * @param height   Height in pixels
 * @return Grayscale RGBA pixel buffer (alpha preserved)
 */
std::vector<uint8_t> grayscale(
    const uint8_t* pixels, int width, int height
);

/**
 * Brightness/Contrast Adjustment
 * @param pixels     Input RGBA pixel buffer
 * @param width      Width in pixels
 * @param height     Height in pixels
 * @param brightness Brightness offset (-100 to +100)
 * @param contrast   Contrast multiplier (0.0 to 3.0, 1.0 = neutral)
 * @return Adjusted RGBA pixel buffer
 */
std::vector<uint8_t> adjustBrightnessContrast(
    const uint8_t* pixels, int width, int height,
    float brightness, float contrast
);

/**
 * Gaussian Blur
 * @param pixels Input RGBA pixel buffer
 * @param width  Width in pixels
 * @param height Height in pixels
 * @param radius Blur radius (1-50)
 * @return Blurred RGBA pixel buffer
 */
std::vector<uint8_t> gaussianBlur(
    const uint8_t* pixels, int width, int height,
    int radius
);

/**
 * Sepia Tone Filter
 * @param pixels Input RGBA pixel buffer
 * @param width  Width in pixels
 * @param height Height in pixels
 * @return Sepia-toned RGBA pixel buffer
 */
std::vector<uint8_t> sepia(
    const uint8_t* pixels, int width, int height
);

/**
 * Invert Colors
 * @param pixels Input RGBA pixel buffer
 * @param width  Width in pixels
 * @param height Height in pixels
 * @return Inverted RGBA pixel buffer
 */
std::vector<uint8_t> invert(
    const uint8_t* pixels, int width, int height
);

} // namespace omni
