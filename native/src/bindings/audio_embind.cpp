/**
 * Emscripten Embind — Audio DSP C++ ↔ JavaScript Bridge
 * 
 * Exposes DSP functions operating on Float32Array PCM buffers.
 */

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include "audio_dsp.h"

using namespace emscripten;

static val js_equalize(val jsSamples, int numSamples, int sampleRate,
                       float lowGain, float midGain, float highGain) {
    auto vec = convertJSArrayToNumberVector<float>(jsSamples);
    auto result = omni::equalize(vec.data(), numSamples, sampleRate, lowGain, midGain, highGain);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_compress(val jsSamples, int numSamples, int sampleRate,
                       float threshold, float ratio, float attack, float release) {
    auto vec = convertJSArrayToNumberVector<float>(jsSamples);
    auto result = omni::compress(vec.data(), numSamples, sampleRate, threshold, ratio, attack, release);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_limit(val jsSamples, int numSamples, int sampleRate, float ceiling) {
    auto vec = convertJSArrayToNumberVector<float>(jsSamples);
    auto result = omni::limit(vec.data(), numSamples, sampleRate, ceiling);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_normalize(val jsSamples, int numSamples, float targetDb) {
    auto vec = convertJSArrayToNumberVector<float>(jsSamples);
    auto result = omni::normalize(vec.data(), numSamples, targetDb);
    return val(typed_memory_view(result.size(), result.data()));
}

static val js_pitchShift(val jsSamples, int numSamples, int sampleRate, float semitones) {
    auto vec = convertJSArrayToNumberVector<float>(jsSamples);
    auto result = omni::pitchShift(vec.data(), numSamples, sampleRate, semitones);
    return val(typed_memory_view(result.size(), result.data()));
}

EMSCRIPTEN_BINDINGS(omni_audio_dsp) {
    function("equalize", &js_equalize);
    function("compress", &js_compress);
    function("limit", &js_limit);
    function("normalize", &js_normalize);
    function("pitchShift", &js_pitchShift);
}
