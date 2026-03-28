/**
 * Omni-Tool Audio DSP Engine — C++17 Implementation
 * 
 * Digital Signal Processing algorithms compiled to WebAssembly.
 * All functions operate on raw float32 PCM sample buffers (-1.0 to 1.0).
 */

#include "audio_dsp.h"
#include <cmath>
#include <algorithm>

namespace omni {

// ═══════════════════════════════════════════════════
// Helper: dB to linear gain
// ═══════════════════════════════════════════════════
static inline float dbToLinear(float db) {
    return std::pow(10.0f, db / 20.0f);
}

static inline float linearToDb(float linear) {
    return 20.0f * std::log10(std::max(linear, 1e-10f));
}

// ═══════════════════════════════════════════════════
// Biquad Filter (used by EQ)
// ═══════════════════════════════════════════════════
struct BiquadCoeffs {
    float b0, b1, b2, a1, a2;
};

static BiquadCoeffs lowShelf(float freq, float gain, float sampleRate) {
    float A = std::pow(10.0f, gain / 40.0f);
    float w0 = 2.0f * 3.14159265f * freq / sampleRate;
    float cosw0 = std::cos(w0);
    float sinw0 = std::sin(w0);
    float alpha = sinw0 / 2.0f * std::sqrt(2.0f);
    float sqrtA = std::sqrt(A);

    float a0 = (A + 1) + (A - 1) * cosw0 + 2 * sqrtA * alpha;
    return {
        (A * ((A + 1) - (A - 1) * cosw0 + 2 * sqrtA * alpha)) / a0,
        (2 * A * ((A - 1) - (A + 1) * cosw0)) / a0,
        (A * ((A + 1) - (A - 1) * cosw0 - 2 * sqrtA * alpha)) / a0,
        (-2 * ((A - 1) + (A + 1) * cosw0)) / a0,
        ((A + 1) + (A - 1) * cosw0 - 2 * sqrtA * alpha) / a0
    };
}

static BiquadCoeffs peaking(float freq, float gain, float Q, float sampleRate) {
    float A = std::pow(10.0f, gain / 40.0f);
    float w0 = 2.0f * 3.14159265f * freq / sampleRate;
    float cosw0 = std::cos(w0);
    float sinw0 = std::sin(w0);
    float alpha = sinw0 / (2.0f * Q);

    float a0 = 1 + alpha / A;
    return {
        (1 + alpha * A) / a0,
        (-2 * cosw0) / a0,
        (1 - alpha * A) / a0,
        (-2 * cosw0) / a0,
        (1 - alpha / A) / a0
    };
}

static BiquadCoeffs highShelf(float freq, float gain, float sampleRate) {
    float A = std::pow(10.0f, gain / 40.0f);
    float w0 = 2.0f * 3.14159265f * freq / sampleRate;
    float cosw0 = std::cos(w0);
    float sinw0 = std::sin(w0);
    float alpha = sinw0 / 2.0f * std::sqrt(2.0f);
    float sqrtA = std::sqrt(A);

    float a0 = (A + 1) - (A - 1) * cosw0 + 2 * sqrtA * alpha;
    return {
        (A * ((A + 1) + (A - 1) * cosw0 + 2 * sqrtA * alpha)) / a0,
        (-2 * A * ((A - 1) + (A + 1) * cosw0)) / a0,
        (A * ((A + 1) + (A - 1) * cosw0 - 2 * sqrtA * alpha)) / a0,
        (2 * ((A - 1) - (A + 1) * cosw0)) / a0,
        ((A + 1) - (A - 1) * cosw0 - 2 * sqrtA * alpha) / a0
    };
}

static void applyBiquad(float* samples, int numSamples, const BiquadCoeffs& c) {
    float x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (int i = 0; i < numSamples; ++i) {
        float x0 = samples[i];
        float y0 = c.b0 * x0 + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
        x2 = x1; x1 = x0;
        y2 = y1; y1 = y0;
        samples[i] = y0;
    }
}

// ═══════════════════════════════════════════════════
// 1. 3-Band Parametric Equalizer
// ═══════════════════════════════════════════════════
std::vector<float> equalize(
    const float* samples, int numSamples, int sampleRate,
    float lowGain, float midGain, float highGain
) {
    std::vector<float> output(samples, samples + numSamples);

    // Low shelf at 250Hz
    auto low = lowShelf(250.0f, lowGain, static_cast<float>(sampleRate));
    applyBiquad(output.data(), numSamples, low);

    // Peaking at 1kHz, Q=1.0
    auto mid = peaking(1000.0f, midGain, 1.0f, static_cast<float>(sampleRate));
    applyBiquad(output.data(), numSamples, mid);

    // High shelf at 4kHz
    auto high = highShelf(4000.0f, highGain, static_cast<float>(sampleRate));
    applyBiquad(output.data(), numSamples, high);

    return output;
}

// ═══════════════════════════════════════════════════
// 2. Dynamic Range Compressor
// ═══════════════════════════════════════════════════
std::vector<float> compress(
    const float* samples, int numSamples, int sampleRate,
    float threshold, float ratio, float attack, float release
) {
    std::vector<float> output(numSamples);

    float attackCoeff = std::exp(-1.0f / (sampleRate * attack / 1000.0f));
    float releaseCoeff = std::exp(-1.0f / (sampleRate * release / 1000.0f));
    float envelope = 0.0f;

    for (int i = 0; i < numSamples; ++i) {
        float absSample = std::abs(samples[i]);
        float inputDb = linearToDb(absSample);

        // Envelope follower
        if (absSample > envelope) {
            envelope = attackCoeff * envelope + (1.0f - attackCoeff) * absSample;
        } else {
            envelope = releaseCoeff * envelope + (1.0f - releaseCoeff) * absSample;
        }

        float envDb = linearToDb(envelope);

        // Gain computation
        float gainReduction = 0.0f;
        if (envDb > threshold) {
            gainReduction = (envDb - threshold) * (1.0f - 1.0f / ratio);
        }

        float gain = dbToLinear(-gainReduction);
        output[i] = samples[i] * gain;
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 3. Brickwall Limiter
// ═══════════════════════════════════════════════════
std::vector<float> limit(
    const float* samples, int numSamples, int sampleRate,
    float ceiling
) {
    std::vector<float> output(numSamples);
    float ceilingLinear = dbToLinear(ceiling);

    // Simple look-ahead limiter with 5ms look-ahead
    int lookAhead = static_cast<int>(sampleRate * 0.005f);
    float releaseCoeff = std::exp(-1.0f / (sampleRate * 0.05f)); // 50ms release
    float gain = 1.0f;

    for (int i = 0; i < numSamples; ++i) {
        // Find peak in look-ahead window
        float peak = 0.0f;
        for (int j = i; j < std::min(i + lookAhead, numSamples); ++j) {
            peak = std::max(peak, std::abs(samples[j]));
        }

        float targetGain = (peak > ceilingLinear) ? ceilingLinear / peak : 1.0f;

        // Smooth gain changes
        if (targetGain < gain) {
            gain = targetGain; // Instant attack
        } else {
            gain = releaseCoeff * gain + (1.0f - releaseCoeff) * targetGain;
        }

        output[i] = samples[i] * gain;
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 4. Normalize
// ═══════════════════════════════════════════════════
std::vector<float> normalize(
    const float* samples, int numSamples,
    float targetDb
) {
    std::vector<float> output(numSamples);

    // Find current peak
    float peak = 0.0f;
    for (int i = 0; i < numSamples; ++i) {
        peak = std::max(peak, std::abs(samples[i]));
    }

    if (peak < 1e-10f) {
        // Silence — return as-is
        std::copy(samples, samples + numSamples, output.begin());
        return output;
    }

    float targetLinear = dbToLinear(targetDb);
    float gain = targetLinear / peak;

    for (int i = 0; i < numSamples; ++i) {
        output[i] = std::min(1.0f, std::max(-1.0f, samples[i] * gain));
    }

    return output;
}

// ═══════════════════════════════════════════════════
// 5. Pitch Shift (Simple granular time-domain)
// ═══════════════════════════════════════════════════
std::vector<float> pitchShift(
    const float* samples, int numSamples, int sampleRate,
    float semitones
) {
    float ratio = std::pow(2.0f, semitones / 12.0f);
    int outputLen = static_cast<int>(numSamples / ratio);
    std::vector<float> output(outputLen);

    // Simple linear interpolation resampling
    for (int i = 0; i < outputLen; ++i) {
        float srcPos = i * ratio;
        int srcIdx = static_cast<int>(srcPos);
        float frac = srcPos - srcIdx;

        if (srcIdx + 1 < numSamples) {
            output[i] = samples[srcIdx] * (1.0f - frac) + samples[srcIdx + 1] * frac;
        } else if (srcIdx < numSamples) {
            output[i] = samples[srcIdx];
        } else {
            output[i] = 0.0f;
        }
    }

    return output;
}

} // namespace omni
