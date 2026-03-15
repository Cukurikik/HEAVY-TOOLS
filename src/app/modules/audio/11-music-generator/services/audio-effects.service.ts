import { Injectable } from '@angular/core';

/**
 * AUDIO EFFECTS SERVICE
 *
 * Ported from Python effects.py — provides post-processing effects using Web Audio API:
 *   - Reverb (ConvolverNode with generated impulse response)
 *   - Delay/Echo (DelayNode with feedback loop)
 *   - Low-Pass Filter (BiquadFilterNode)
 *   - High-Pass Filter (BiquadFilterNode)
 *   - Compressor (DynamicsCompressorNode)
 *   - Stereo Widener (delay-based)
 *   - Fade In/Out (GainNode automation)
 *   - Genre-specific effect presets
 *
 * All processing happens in an OfflineAudioContext for zero-latency rendering.
 */

export interface EffectsConfig {
  reverb: { enabled: boolean; decay: number; delayMs: number };
  delay: { enabled: boolean; delayMs: number; feedback: number; mix: number };
  lowPass: { enabled: boolean; frequency: number };
  highPass: { enabled: boolean; frequency: number };
  compressor: { enabled: boolean; threshold: number; ratio: number; attack: number; release: number };
  fadeIn: number;   // seconds
  fadeOut: number;   // seconds
}

/** Genre-specific effects presets — Ported from Python apply_genre_effects() */
const GENRE_EFFECTS: Record<string, EffectsConfig> = {
  'classical': {
    reverb: { enabled: true, decay: 0.5, delayMs: 50 },
    delay: { enabled: false, delayMs: 0, feedback: 0, mix: 0 },
    lowPass: { enabled: false, frequency: 20000 },
    highPass: { enabled: false, frequency: 20 },
    compressor: { enabled: false, threshold: -24, ratio: 4, attack: 0.003, release: 0.25 },
    fadeIn: 1.0, fadeOut: 2.0,
  },
  'jazz': {
    reverb: { enabled: true, decay: 0.35, delayMs: 35 },
    delay: { enabled: false, delayMs: 0, feedback: 0, mix: 0 },
    lowPass: { enabled: false, frequency: 20000 },
    highPass: { enabled: false, frequency: 20 },
    compressor: { enabled: true, threshold: -20, ratio: 3, attack: 0.01, release: 0.1 },
    fadeIn: 0.5, fadeOut: 1.5,
  },
  'electronic': {
    reverb: { enabled: true, decay: 0.3, delayMs: 30 },
    delay: { enabled: true, delayMs: 300, feedback: 0.35, mix: 0.25 },
    lowPass: { enabled: true, frequency: 8000 },
    highPass: { enabled: true, frequency: 40 },
    compressor: { enabled: true, threshold: -15, ratio: 6, attack: 0.005, release: 0.1 },
    fadeIn: 0.3, fadeOut: 1.0,
  },
  'rock': {
    reverb: { enabled: true, decay: 0.3, delayMs: 30 },
    delay: { enabled: false, delayMs: 0, feedback: 0, mix: 0 },
    lowPass: { enabled: false, frequency: 20000 },
    highPass: { enabled: true, frequency: 60 },
    compressor: { enabled: true, threshold: -18, ratio: 5, attack: 0.003, release: 0.1 },
    fadeIn: 0.3, fadeOut: 1.0,
  },
  'pop': {
    reverb: { enabled: true, decay: 0.25, delayMs: 25 },
    delay: { enabled: false, delayMs: 0, feedback: 0, mix: 0 },
    lowPass: { enabled: false, frequency: 20000 },
    highPass: { enabled: true, frequency: 40 },
    compressor: { enabled: true, threshold: -20, ratio: 3, attack: 0.005, release: 0.15 },
    fadeIn: 0.3, fadeOut: 1.0,
  },
  'ambient': {
    reverb: { enabled: true, decay: 0.6, delayMs: 80 },
    delay: { enabled: true, delayMs: 500, feedback: 0.5, mix: 0.4 },
    lowPass: { enabled: true, frequency: 4000 },
    highPass: { enabled: false, frequency: 20 },
    compressor: { enabled: false, threshold: -24, ratio: 4, attack: 0.003, release: 0.25 },
    fadeIn: 2.0, fadeOut: 3.0,
  },
  'lofi': {
    reverb: { enabled: true, decay: 0.3, delayMs: 40 },
    delay: { enabled: false, delayMs: 0, feedback: 0, mix: 0 },
    lowPass: { enabled: true, frequency: 3000 },
    highPass: { enabled: true, frequency: 80 },
    compressor: { enabled: true, threshold: -18, ratio: 4, attack: 0.01, release: 0.1 },
    fadeIn: 0.5, fadeOut: 1.5,
  },
};

@Injectable({ providedIn: 'root' })
export class AudioEffectsService {

  /**
   * Get effects config for a genre
   */
  getGenreEffects(genre: string): EffectsConfig {
    return GENRE_EFFECTS[genre] ?? GENRE_EFFECTS['pop'];
  }

  /**
   * Apply a full effects chain to an AudioBuffer using OfflineAudioContext.
   *
   * Routing: Source → HPF → LPF → Compressor → Delay (wet/dry) → Reverb → Fade → Destination
   */
  async applyEffects(
    inputBuffer: AudioBuffer,
    genre: string
  ): Promise<AudioBuffer> {
    const config = this.getGenreEffects(genre);
    const sampleRate = inputBuffer.sampleRate;
    const numChannels = inputBuffer.numberOfChannels;
    const duration = inputBuffer.duration + 2.0; // Extra 2s for reverb tail
    const totalSamples = Math.ceil(duration * sampleRate);

    const offlineCtx = new OfflineAudioContext(numChannels, totalSamples, sampleRate);

    // Create source
    const source = offlineCtx.createBufferSource();
    source.buffer = inputBuffer;

    // Build effects chain
    let currentNode: AudioNode = source;

    // 1. High-Pass Filter
    if (config.highPass.enabled) {
      const hpf = offlineCtx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = config.highPass.frequency;
      hpf.Q.value = 0.707; // Butterworth
      currentNode.connect(hpf);
      currentNode = hpf;
    }

    // 2. Low-Pass Filter
    if (config.lowPass.enabled) {
      const lpf = offlineCtx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = config.lowPass.frequency;
      lpf.Q.value = 0.707;
      currentNode.connect(lpf);
      currentNode = lpf;
    }

    // 3. Compressor
    if (config.compressor.enabled) {
      const comp = offlineCtx.createDynamicsCompressor();
      comp.threshold.value = config.compressor.threshold;
      comp.ratio.value = config.compressor.ratio;
      comp.attack.value = config.compressor.attack;
      comp.release.value = config.compressor.release;
      comp.knee.value = 6;
      currentNode.connect(comp);
      currentNode = comp;
    }

    // 4. Delay (wet/dry mix)
    if (config.delay.enabled && config.delay.mix > 0) {
      const dryGain = offlineCtx.createGain();
      dryGain.gain.value = 1.0 - config.delay.mix;

      const wetGain = offlineCtx.createGain();
      wetGain.gain.value = config.delay.mix;

      const delay = offlineCtx.createDelay(2.0);
      delay.delayTime.value = config.delay.delayMs / 1000;

      const feedback = offlineCtx.createGain();
      feedback.gain.value = config.delay.feedback;

      // Dry path
      currentNode.connect(dryGain);

      // Wet path: source → delay → feedback loop → wetGain
      currentNode.connect(delay);
      delay.connect(feedback);
      feedback.connect(delay); // Feedback loop
      delay.connect(wetGain);

      // Merge
      const merger = offlineCtx.createGain();
      merger.gain.value = 1.0;
      dryGain.connect(merger);
      wetGain.connect(merger);

      currentNode = merger;
    }

    // 5. Reverb (convolution with generated impulse response)
    if (config.reverb.enabled) {
      const reverbIR = this.generateImpulseResponse(
        offlineCtx, config.reverb.decay, config.reverb.delayMs / 1000
      );

      const dryGain = offlineCtx.createGain();
      dryGain.gain.value = 0.7;

      const wetGain = offlineCtx.createGain();
      wetGain.gain.value = 0.3;

      const convolver = offlineCtx.createConvolver();
      convolver.buffer = reverbIR;

      currentNode.connect(dryGain);
      currentNode.connect(convolver);
      convolver.connect(wetGain);

      const merger = offlineCtx.createGain();
      merger.gain.value = 1.0;
      dryGain.connect(merger);
      wetGain.connect(merger);

      currentNode = merger;
    }

    // 6. Fade In/Out (Master Gain automation)
    const masterGain = offlineCtx.createGain();
    const inputDuration = inputBuffer.duration;

    // Fade in
    if (config.fadeIn > 0) {
      masterGain.gain.setValueAtTime(0, 0);
      masterGain.gain.linearRampToValueAtTime(1.0, config.fadeIn);
    } else {
      masterGain.gain.setValueAtTime(1.0, 0);
    }

    // Fade out
    if (config.fadeOut > 0) {
      const fadeOutStart = Math.max(0, inputDuration - config.fadeOut);
      masterGain.gain.setValueAtTime(1.0, fadeOutStart);
      masterGain.gain.linearRampToValueAtTime(0, inputDuration);
    }

    currentNode.connect(masterGain);
    masterGain.connect(offlineCtx.destination);

    // Start and render
    source.start(0);
    return offlineCtx.startRendering();
  }

  /**
   * Generate a synthetic impulse response for reverb.
   * Creates exponentially decaying white noise.
   */
  private generateImpulseResponse(
    ctx: OfflineAudioContext,
    decay: number,
    preDelay: number
  ): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.ceil(sampleRate * (decay * 3 + preDelay)); // 3x decay for full tail
    const impulse = ctx.createBuffer(2, length, sampleRate);

    const preDelaySamples = Math.floor(preDelay * sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = preDelaySamples; i < length; i++) {
        const t = (i - preDelaySamples) / sampleRate;
        const envelope = Math.exp(-t / decay);
        channelData[i] = (Math.random() * 2 - 1) * envelope;
      }
    }

    return impulse;
  }
}
