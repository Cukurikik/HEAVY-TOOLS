import { Injectable, inject } from '@angular/core';
import {
  MusicTheoryService,
  NoteEvent,
  CompositionRequest,
  GENRE_CONFIGS,
} from './music-theory.service';
import { AudioEffectsService } from './audio-effects.service';

/**
 * PROCEDURAL MUSIC SERVICE — ADVANCED SYNTHESIZER
 *
 * Ported from Python synthesizer.py + effects.py:
 *   - 8 Instrument presets with ADSR envelopes and harmonic overtone profiles
 *   - 4 Waveform types: sine, square, sawtooth, triangle
 *   - Multi-layer composition: Melody + Chord Pads + Bass + Drums
 *   - Genre-aware instrument selection and mixing
 *   - Post-processing effects chain via AudioEffectsService
 *   - Complete WAV exporter
 *
 * NOTE: Also retains sample-based playback via GM CDN when available.
 */

// ============================================================
// INSTRUMENT PRESETS (Ported from Python INSTRUMENT_PRESETS)
// ============================================================

interface InstrumentPreset {
  waveform: OscillatorType;
  attack: number;   // seconds
  decay: number;     // seconds
  sustain: number;   // level 0-1
  release: number;   // seconds
  harmonics: number[];  // amplitude for each harmonic (fundamental + overtones)
  filterFreq: number;   // lowpass filter cutoff Hz
}

const INSTRUMENT_PRESETS: Record<string, InstrumentPreset> = {
  'piano': {
    waveform: 'triangle',
    attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5,
    harmonics: [1.0, 0.5, 0.25, 0.125],
    filterFreq: 8000,
  },
  'strings': {
    waveform: 'sawtooth',
    attack: 0.15, decay: 0.1, sustain: 0.7, release: 0.3,
    harmonics: [1.0, 0.7, 0.4, 0.2, 0.1],
    filterFreq: 6000,
  },
  'synth_lead': {
    waveform: 'square',
    attack: 0.02, decay: 0.15, sustain: 0.6, release: 0.2,
    harmonics: [1.0, 0.0, 0.3, 0.0, 0.1],
    filterFreq: 10000,
  },
  'synth_pad': {
    waveform: 'sine',
    attack: 0.4, decay: 0.2, sustain: 0.8, release: 0.6,
    harmonics: [1.0, 0.6, 0.3, 0.15],
    filterFreq: 4000,
  },
  'bass': {
    waveform: 'sawtooth',
    attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.15,
    harmonics: [1.0, 0.8, 0.3],
    filterFreq: 1500,
  },
  'flute': {
    waveform: 'sine',
    attack: 0.08, decay: 0.1, sustain: 0.7, release: 0.2,
    harmonics: [1.0, 0.1, 0.05],
    filterFreq: 7000,
  },
  'electric_guitar': {
    waveform: 'sawtooth',
    attack: 0.005, decay: 0.3, sustain: 0.5, release: 0.3,
    harmonics: [1.0, 0.8, 0.6, 0.4, 0.2],
    filterFreq: 5000,
  },
  'saxophone': {
    waveform: 'square',
    attack: 0.05, decay: 0.15, sustain: 0.6, release: 0.25,
    harmonics: [1.0, 0.7, 0.5, 0.35, 0.2],
    filterFreq: 5500,
  },
};

/** Drum synthesis presets (for fully synthetic drums) */
interface DrumPreset {
  type: OscillatorType;
  freq: number;
  freqEnd: number;
  duration: number;
  noiseAmount: number;  // 0 = pure tone, 1 = pure noise
}

const DRUM_PRESETS: Record<string, DrumPreset> = {
  'kick':  { type: 'sine',     freq: 150,  freqEnd: 40,  duration: 0.2,  noiseAmount: 0.0 },
  'snare': { type: 'triangle', freq: 200,  freqEnd: 100, duration: 0.15, noiseAmount: 0.7 },
  'hihat': { type: 'square',   freq: 8000, freqEnd: 4000, duration: 0.05, noiseAmount: 0.9 },
};

// Drum samples from CDN
const DRUM_SAMPLE_URLS: Record<string, string> = {
  kick:  'https://cdn.freesound.org/previews/171/171104_2394245-lq.mp3',
  snare: 'https://cdn.freesound.org/previews/387/387186_7255551-lq.mp3',
  hihat: 'https://cdn.freesound.org/previews/421/421944_6010041-lq.mp3',
};

// ============================================================
// RE-EXPORTED CONFIG TYPE (for backward compatibility)
// ============================================================

export type MusicGenerationConfig = CompositionRequest;

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class ProceduralMusicService {
  private readonly theory = inject(MusicTheoryService);
  private readonly effects = inject(AudioEffectsService);

  private audioBufferCache = new Map<string, AudioBuffer>();
  private audioContext = new AudioContext();

  // ============================================================
  // MAIN GENERATOR
  // ============================================================

  /**
   * Generate a complete music piece.
   *
   * Flow:
   *   1. Compose note events (MusicTheoryService)
   *   2. Synthesize audio (ADSR + Harmonics + Drums)
   *   3. Apply genre effects (AudioEffectsService)
   *   4. Return final AudioBuffer
   */
  async generateMusic(
    config: CompositionRequest,
    onProgress?: (p: number, msg?: string) => void
  ): Promise<AudioBuffer> {
    // 1. Try to pre-load real drum samples from CDN
    if (onProgress) onProgress(5, 'Downloading drum samples...');
    await this.preloadDrumSamples();

    // 2. Compose note events using Music Theory
    if (onProgress) onProgress(15, 'Composing melody, chords, bass, and drums...');
    const composition = this.theory.compose(config);

    // 3. Calculate total duration
    const secondsPerBeat = 60 / config.bpm;
    const totalSeconds = composition.totalBeats * secondsPerBeat + 3.0; // +3s for tail/release
    const sampleRate = 44100;
    const totalSamples = Math.ceil(totalSeconds * sampleRate);

    // Create offline context for rendering
    const offlineCtx = new OfflineAudioContext(2, totalSamples, sampleRate);

    // Master chain: gain → compressor → destination
    const masterComp = offlineCtx.createDynamicsCompressor();
    masterComp.threshold.value = -12;
    masterComp.ratio.value = 4;
    masterComp.attack.value = 0.003;
    masterComp.release.value = 0.1;
    masterComp.connect(offlineCtx.destination);

    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 0.85;
    masterGain.connect(masterComp);

    // 4. Render each layer
    if (onProgress) onProgress(30, 'Synthesizing melody...');
    const genreConfig = GENRE_CONFIGS[config.genre];
    const melodyInstrument = config.instrument;
    this.renderNoteEvents(offlineCtx, masterGain, composition.melody, melodyInstrument, secondsPerBeat, 0.5);

    if (onProgress) onProgress(45, 'Synthesizing chord pads...');
    const padInstrument = genreConfig?.instruments[genreConfig.instruments.length - 1] ?? 'synth_pad';
    this.renderNoteEvents(offlineCtx, masterGain, composition.chords, padInstrument, secondsPerBeat, 0.2);

    if (onProgress) onProgress(60, 'Synthesizing bassline...');
    this.renderNoteEvents(offlineCtx, masterGain, composition.bass, 'bass', secondsPerBeat, 0.5);

    if (onProgress) onProgress(75, 'Rendering drum patterns...');
    this.renderDrums(offlineCtx, masterGain, composition.drums, secondsPerBeat);

    // 5. Render the raw buffer
    if (onProgress) onProgress(85, 'Rendering audio buffer...');
    const rawBuffer = await offlineCtx.startRendering();

    // 6. Apply genre-specific effects
    if (config.addEffects) {
      if (onProgress) onProgress(92, 'Applying genre effects (reverb, EQ, compression)...');
      const processedBuffer = await this.effects.applyEffects(rawBuffer, config.genre);
      if (onProgress) onProgress(100, 'Done!');
      return processedBuffer;
    }

    if (onProgress) onProgress(100, 'Done!');
    return rawBuffer;
  }

  // ============================================================
  // NOTE EVENT RENDERER (ADSR + Harmonics Synthesis)
  // ============================================================

  /**
   * Render note events using the specified instrument's ADSR envelope and harmonics.
   * Ported from Python AudioSynthesizer.synthesize_piece()
   */
  private renderNoteEvents(
    ctx: OfflineAudioContext,
    masterOut: AudioNode,
    events: NoteEvent[],
    instrumentName: string,
    secondsPerBeat: number,
    volumeScale = 1.0
  ): void {
    const preset = INSTRUMENT_PRESETS[instrumentName] ?? INSTRUMENT_PRESETS['piano'];

    for (const event of events) {
      const startTime = event.startBeat * secondsPerBeat;
      const durationSec = Math.max(event.durationBeats * secondsPerBeat, 0.05);
      const freq = this.theory.midiToFreq(event.note);
      const velocityFactor = (event.velocity / 127) * volumeScale * 0.3;

      // Skip if frequency too high (Nyquist) or too low
      if (freq < 20 || freq > 16000) continue;

      // Create oscillators for each harmonic
      for (let h = 0; h < preset.harmonics.length; h++) {
        const harmonicAmp = preset.harmonics[h];
        if (harmonicAmp <= 0) continue;

        const harmonicFreq = freq * (h + 1);
        if (harmonicFreq > ctx.sampleRate / 2) break; // Nyquist limit

        const osc = ctx.createOscillator();
        osc.type = preset.waveform;
        osc.frequency.value = harmonicFreq;

        // ADSR envelope via GainNode
        const gainNode = ctx.createGain();
        const { attack, decay, sustain, release } = preset;

        const attackEnd = startTime + Math.min(attack, durationSec * 0.3);
        const decayEnd = attackEnd + Math.min(decay, durationSec * 0.2);
        const releaseStart = startTime + durationSec;
        const releaseEnd = releaseStart + Math.min(release, 0.5);

        const amp = harmonicAmp * velocityFactor;

        // Attack: 0 → peak
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(amp, attackEnd);
        // Decay: peak → sustain
        gainNode.gain.linearRampToValueAtTime(amp * sustain, decayEnd);
        // Sustain: hold
        gainNode.gain.setValueAtTime(amp * sustain, releaseStart);
        // Release: sustain → 0
        gainNode.gain.linearRampToValueAtTime(0.001, releaseEnd);

        // Low-pass filter for brightness control
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = preset.filterFreq;
        filter.Q.value = 0.5;

        // Connect: oscillator → filter → gain → output
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterOut);

        osc.start(startTime);
        osc.stop(releaseEnd + 0.01);
      }
    }
  }

  // ============================================================
  // DRUM RENDERER (Sample-based + Synthetic fallback)
  // ============================================================

  /**
   * Render drum events using CDN samples or synthetic fallback.
   */
  private renderDrums(
    ctx: OfflineAudioContext,
    masterOut: AudioNode,
    events: NoteEvent[],
    secondsPerBeat: number
  ): void {
    for (const event of events) {
      const startTime = event.startBeat * secondsPerBeat;
      const velocityFactor = event.velocity / 127;

      // Map MIDI drum notes to names
      let drumName = '';
      if (event.note === 36) drumName = 'kick';
      else if (event.note === 38) drumName = 'snare';
      else if (event.note === 42 || event.note === 46) drumName = 'hihat';

      if (!drumName) continue;

      // Try to play real sample first
      const sampleBuffer = this.audioBufferCache.get(drumName);
      if (sampleBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = sampleBuffer;

        const gain = ctx.createGain();
        gain.gain.value = velocityFactor * 0.8;

        source.connect(gain);
        gain.connect(masterOut);
        source.start(startTime);
      } else {
        // Synthetic drum fallback
        this.renderSyntheticDrum(ctx, masterOut, drumName, startTime, velocityFactor);
      }
    }
  }

  /**
   * Synthesize a drum hit from pure oscillators (no samples needed).
   */
  private renderSyntheticDrum(
    ctx: OfflineAudioContext,
    masterOut: AudioNode,
    drumType: string,
    time: number,
    velocity: number
  ): void {
    const preset = DRUM_PRESETS[drumType];
    if (!preset) return;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(velocity * 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + preset.duration);
    gain.connect(masterOut);

    // Tone component
    if (preset.noiseAmount < 1.0) {
      const osc = ctx.createOscillator();
      osc.type = preset.type;
      osc.frequency.setValueAtTime(preset.freq, time);
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(preset.freqEnd, 20), time + preset.duration
      );

      const toneGain = ctx.createGain();
      toneGain.gain.value = 1.0 - preset.noiseAmount;
      osc.connect(toneGain);
      toneGain.connect(gain);
      osc.start(time);
      osc.stop(time + preset.duration + 0.01);
    }

    // Noise component (for snare/hihat)
    if (preset.noiseAmount > 0) {
      const bufferSize = Math.ceil(ctx.sampleRate * preset.duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = preset.noiseAmount;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = drumType === 'hihat' ? 'highpass' : 'bandpass';
      noiseFilter.frequency.value = drumType === 'hihat' ? 6000 : 2000;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(gain);
      noiseSource.start(time);
      noiseSource.stop(time + preset.duration + 0.01);
    }
  }

  // ============================================================
  // SAMPLE PRELOADER
  // ============================================================

  private async preloadDrumSamples(): Promise<void> {
    for (const [name, url] of Object.entries(DRUM_SAMPLE_URLS)) {
      if (this.audioBufferCache.has(name)) continue;
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBufferCache.set(name, audioBuffer);
      } catch {
        // Silent fallback — synthetic drums will be used instead
      }
    }
  }

  // ============================================================
  // WAV EXPORTER (unchanged from original)
  // ============================================================

  audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const channels: Float32Array[] = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([out], { type: 'audio/wav' });

    function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }
  }
}
