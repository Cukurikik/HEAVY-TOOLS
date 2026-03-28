#pragma once
/**
 * Omni-Tool Audio DSP Engine — C++17
 * Pure C++ digital signal processing functions for WebAssembly.
 * Operates on raw float32 PCM sample buffers.
 */

#include <cstdint>
#include <vector>

namespace omni {

/**
 * Parametric Equalizer — 3-band (Low/Mid/High)
 * @param samples    Raw PCM float32 samples (-1.0 to 1.0)
 * @param sampleRate Sample rate (e.g., 44100, 48000)
 * @param lowGain    Low band gain in dB (-20 to +20)
 * @param midGain    Mid band gain in dB (-20 to +20)
 * @param highGain   High band gain in dB (-20 to +20)
 * @return Processed PCM buffer
 */
std::vector<float> equalize(
    const float* samples, int numSamples, int sampleRate,
    float lowGain, float midGain, float highGain
);

/**
 * Dynamic Range Compressor
 * @param samples    Raw PCM float32 samples
 * @param threshold  Threshold in dB (-60 to 0)
 * @param ratio      Compression ratio (1:1 to 20:1)
 * @param attack     Attack time in ms (0.1 to 100)
 * @param release    Release time in ms (10 to 1000)
 * @param sampleRate Sample rate
 * @return Compressed PCM buffer
 */
std::vector<float> compress(
    const float* samples, int numSamples, int sampleRate,
    float threshold, float ratio, float attack, float release
);

/**
 * Brickwall Limiter — Prevents clipping
 * @param samples    Raw PCM float32 samples
 * @param ceiling    Max output level in dB (-6 to 0)
 * @param sampleRate Sample rate
 * @return Limited PCM buffer
 */
std::vector<float> limit(
    const float* samples, int numSamples, int sampleRate,
    float ceiling
);

/**
 * Normalize audio to target peak level
 * @param samples    Raw PCM float32 samples
 * @param targetDb   Target peak level in dB (-3 to 0)
 * @return Normalized PCM buffer
 */
std::vector<float> normalize(
    const float* samples, int numSamples,
    float targetDb
);

/**
 * Pitch Shift without time stretch (granular synthesis)
 * @param samples    Raw PCM float32 samples
 * @param sampleRate Sample rate
 * @param semitones  Pitch shift in semitones (-12 to +12)
 * @return Pitch-shifted PCM buffer
 */
std::vector<float> pitchShift(
    const float* samples, int numSamples, int sampleRate,
    float semitones
);

} // namespace omni
