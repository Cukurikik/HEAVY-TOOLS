/**
 * Omni-Tool Image Processing Kernel — C++17 Implementation
 * 
 * Pure C++ with zero external dependencies.
 * Compiled to WebAssembly via Emscripten for near-native browser performance.
 * 
 * All functions operate on raw RGBA uint8_t pixel buffers.
 * Memory management uses std::vector (automatically freed by Embind).
 */

#include "image_kernel.h"
#include <cmath>
#include <algorithm>
#include <numeric>

namespace omni {

// ═══════════════════════════════════════════════════
// Helper: Clamp pixel values to [0, 255]
// ═══════════════════════════════════════════════════
static inline uint8_t clamp8(float v) {
    return static_cast<uint8_t>(std::max(0.0f, std::min(255.0f, v)));
}

// ═══════════════════════════════════════════════════
// 1. Lanczos-3 Resize
// ═══════════════════════════════════════════════════
static double lanczos3(double x) {
    if (x == 0.0) return 1.0;
    if (std::abs(x) >= 3.0) return 0.0;
    const double pi = 3.14159265358979323846;
    const double pix = pi * x;
    return (std::sin(pix) / pix) * (std::sin(pix / 3.0) / (pix / 3.0));
}

std::vector<uint8_t> resize(
    const uint8_t* pixels, int width, int height,
    int newWidth, int newHeight
) {
    std::vector<uint8_t> output(newWidth * newHeight * 4);

    const double xRatio = static_cast<double>(width) / newWidth;
    const double yRatio = static_cast<double>(height) / newHeight;

    for (int y = 0; y < newHeight; ++y) {
        for (int x = 0; x < newWidth; ++x) {
            double srcX = (x + 0.5) * xRatio - 0.5;
            double srcY = (y + 0.5) * yRatio - 0.5;

            double r = 0, g = 0, b = 0, a = 0;
            double weightSum = 0;

            int x0 = static_cast<int>(std::floor(srcX)) - 2;
            int y0 = static_cast<int>(std::floor(srcY)) - 2;

            for (int ky = 0; ky < 6; ++ky) {
                int sy = std::max(0, std::min(height - 1, y0 + ky));
                double wy = lanczos3(srcY - sy);

                for (int kx = 0; kx < 6; ++kx) {
                    int sx = std::max(0, std::min(width - 1, x0 + kx));
                    double wx = lanczos3(srcX - sx);

                    double w = wx * wy;
                    int idx = (sy * width + sx) * 4;

                    r += pixels[idx + 0] * w;
                    g += pixels[idx + 1] * w;
                    b += pixels[idx + 2] * w;
                    a += pixels[idx + 3] * w;
                    weightSum += w;
                }
            }

            int outIdx = (y * newWidth + x) * 4;
            if (weightSum > 0) {
                output[outIdx + 0] = clamp8(static_cast<float>(r / weightSum));
                output[outIdx + 1] = clamp8(static_cast<float>(g / weightSum));
                output[outIdx + 2] = clamp8(static_cast<float>(b / weightSum));
                output[outIdx + 3] = clamp8(static_cast<float>(a / weightSum));
            }
        }
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 2. Unsharp Mask Sharpen
// ═══════════════════════════════════════════════════
std::vector<uint8_t> sharpen(
    const uint8_t* pixels, int width, int height,
    float strength
) {
    // First create a 3x3 Gaussian blur
    std::vector<uint8_t> blurred(width * height * 4);

    // Simple 3x3 box blur for the base
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            float r = 0, g = 0, b = 0;
            int count = 0;

            for (int dy = -1; dy <= 1; ++dy) {
                for (int dx = -1; dx <= 1; ++dx) {
                    int nx = std::max(0, std::min(width - 1, x + dx));
                    int ny = std::max(0, std::min(height - 1, y + dy));
                    int idx = (ny * width + nx) * 4;
                    r += pixels[idx + 0];
                    g += pixels[idx + 1];
                    b += pixels[idx + 2];
                    count++;
                }
            }

            int outIdx = (y * width + x) * 4;
            blurred[outIdx + 0] = clamp8(r / count);
            blurred[outIdx + 1] = clamp8(g / count);
            blurred[outIdx + 2] = clamp8(b / count);
            blurred[outIdx + 3] = pixels[outIdx + 3]; // Preserve alpha
        }
    }

    // Unsharp mask: result = original + strength * (original - blurred)
    std::vector<uint8_t> output(width * height * 4);
    for (int i = 0; i < width * height; ++i) {
        int idx = i * 4;
        for (int c = 0; c < 3; ++c) {
            float diff = static_cast<float>(pixels[idx + c]) - blurred[idx + c];
            output[idx + c] = clamp8(pixels[idx + c] + strength * diff);
        }
        output[idx + 3] = pixels[idx + 3]; // Preserve alpha
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 3. Bilateral Denoise Filter
// ═══════════════════════════════════════════════════
std::vector<uint8_t> denoise(
    const uint8_t* pixels, int width, int height,
    float strength
) {
    std::vector<uint8_t> output(width * height * 4);

    const int radius = 3;
    const float spatialSigma = static_cast<float>(radius);
    const float rangeSigma = strength * 30.0f; // Map 0-5 to 0-150

    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            float sumR = 0, sumG = 0, sumB = 0;
            float weightSum = 0;

            int centerIdx = (y * width + x) * 4;
            float cR = pixels[centerIdx + 0];
            float cG = pixels[centerIdx + 1];
            float cB = pixels[centerIdx + 2];

            for (int dy = -radius; dy <= radius; ++dy) {
                for (int dx = -radius; dx <= radius; ++dx) {
                    int nx = std::max(0, std::min(width - 1, x + dx));
                    int ny = std::max(0, std::min(height - 1, y + dy));
                    int nIdx = (ny * width + nx) * 4;

                    float nR = pixels[nIdx + 0];
                    float nG = pixels[nIdx + 1];
                    float nB = pixels[nIdx + 2];

                    // Spatial weight (Gaussian distance)
                    float spatialDist = static_cast<float>(dx * dx + dy * dy);
                    float spatialWeight = std::exp(-spatialDist / (2.0f * spatialSigma * spatialSigma));

                    // Range weight (color similarity)
                    float colorDist = (nR - cR) * (nR - cR) + (nG - cG) * (nG - cG) + (nB - cB) * (nB - cB);
                    float rangeWeight = std::exp(-colorDist / (2.0f * rangeSigma * rangeSigma));

                    float w = spatialWeight * rangeWeight;
                    sumR += nR * w;
                    sumG += nG * w;
                    sumB += nB * w;
                    weightSum += w;
                }
            }

            int outIdx = (y * width + x) * 4;
            output[outIdx + 0] = clamp8(sumR / weightSum);
            output[outIdx + 1] = clamp8(sumG / weightSum);
            output[outIdx + 2] = clamp8(sumB / weightSum);
            output[outIdx + 3] = pixels[centerIdx + 3]; // Preserve alpha
        }
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 4. Grayscale — ITU-R BT.709 Luminosity
// ═══════════════════════════════════════════════════
std::vector<uint8_t> grayscale(
    const uint8_t* pixels, int width, int height
) {
    std::vector<uint8_t> output(width * height * 4);

    for (int i = 0; i < width * height; ++i) {
        int idx = i * 4;
        // BT.709: L = 0.2126*R + 0.7152*G + 0.0722*B
        float lum = 0.2126f * pixels[idx + 0]
                  + 0.7152f * pixels[idx + 1]
                  + 0.0722f * pixels[idx + 2];
        uint8_t gray = clamp8(lum);
        output[idx + 0] = gray;
        output[idx + 1] = gray;
        output[idx + 2] = gray;
        output[idx + 3] = pixels[idx + 3]; // Preserve alpha
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 5. Brightness / Contrast Adjustment
// ═══════════════════════════════════════════════════
std::vector<uint8_t> adjustBrightnessContrast(
    const uint8_t* pixels, int width, int height,
    float brightness, float contrast
) {
    std::vector<uint8_t> output(width * height * 4);

    for (int i = 0; i < width * height; ++i) {
        int idx = i * 4;
        for (int c = 0; c < 3; ++c) {
            // Apply contrast around midpoint (128), then add brightness
            float val = (static_cast<float>(pixels[idx + c]) - 128.0f) * contrast + 128.0f + brightness;
            output[idx + c] = clamp8(val);
        }
        output[idx + 3] = pixels[idx + 3]; // Preserve alpha
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 6. Gaussian Blur (Separable 1D passes)
// ═══════════════════════════════════════════════════
std::vector<uint8_t> gaussianBlur(
    const uint8_t* pixels, int width, int height,
    int radius
) {
    radius = std::max(1, std::min(50, radius));

    // Build 1D Gaussian kernel
    int kernelSize = radius * 2 + 1;
    std::vector<float> kernel(kernelSize);
    float sigma = radius / 3.0f;
    float sum = 0;

    for (int i = 0; i < kernelSize; ++i) {
        float x = static_cast<float>(i - radius);
        kernel[i] = std::exp(-(x * x) / (2.0f * sigma * sigma));
        sum += kernel[i];
    }
    for (auto& k : kernel) k /= sum; // Normalize

    // Horizontal pass
    std::vector<uint8_t> temp(width * height * 4);
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            float r = 0, g = 0, b = 0;
            for (int k = -radius; k <= radius; ++k) {
                int sx = std::max(0, std::min(width - 1, x + k));
                int idx = (y * width + sx) * 4;
                float w = kernel[k + radius];
                r += pixels[idx + 0] * w;
                g += pixels[idx + 1] * w;
                b += pixels[idx + 2] * w;
            }
            int outIdx = (y * width + x) * 4;
            temp[outIdx + 0] = clamp8(r);
            temp[outIdx + 1] = clamp8(g);
            temp[outIdx + 2] = clamp8(b);
            temp[outIdx + 3] = pixels[outIdx + 3];
        }
    }

    // Vertical pass
    std::vector<uint8_t> output(width * height * 4);
    for (int y = 0; y < height; ++y) {
        for (int x = 0; x < width; ++x) {
            float r = 0, g = 0, b = 0;
            for (int k = -radius; k <= radius; ++k) {
                int sy = std::max(0, std::min(height - 1, y + k));
                int idx = (sy * width + x) * 4;
                float w = kernel[k + radius];
                r += temp[idx + 0] * w;
                g += temp[idx + 1] * w;
                b += temp[idx + 2] * w;
            }
            int outIdx = (y * width + x) * 4;
            output[outIdx + 0] = clamp8(r);
            output[outIdx + 1] = clamp8(g);
            output[outIdx + 2] = clamp8(b);
            output[outIdx + 3] = temp[outIdx + 3];
        }
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 7. Sepia Tone
// ═══════════════════════════════════════════════════
std::vector<uint8_t> sepia(
    const uint8_t* pixels, int width, int height
) {
    std::vector<uint8_t> output(width * height * 4);

    for (int i = 0; i < width * height; ++i) {
        int idx = i * 4;
        float r = pixels[idx + 0];
        float g = pixels[idx + 1];
        float b = pixels[idx + 2];

        // Standard sepia tone matrix
        output[idx + 0] = clamp8(r * 0.393f + g * 0.769f + b * 0.189f);
        output[idx + 1] = clamp8(r * 0.349f + g * 0.686f + b * 0.168f);
        output[idx + 2] = clamp8(r * 0.272f + g * 0.534f + b * 0.131f);
        output[idx + 3] = pixels[idx + 3]; // Preserve alpha
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 8. Invert Colors
// ═══════════════════════════════════════════════════
std::vector<uint8_t> invert(
    const uint8_t* pixels, int width, int height
) {
    std::vector<uint8_t> output(width * height * 4);

    for (int i = 0; i < width * height; ++i) {
        int idx = i * 4;
        output[idx + 0] = 255 - pixels[idx + 0];
        output[idx + 1] = 255 - pixels[idx + 1];
        output[idx + 2] = 255 - pixels[idx + 2];
        output[idx + 3] = pixels[idx + 3]; // Preserve alpha
    }

    return output;
}

} // namespace omni
