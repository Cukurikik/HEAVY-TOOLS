import { Injectable, inject } from '@angular/core';
import {
  MusicTheoryService,
  CompositionRequest,
  GENRE_CONFIGS,
} from './music-theory.service';

/**
 * STYLE PARSER SERVICE
 *
 * Interprets free-text descriptions and uploaded audio to configure
 * the AI Music Generator automatically.
 *
 * Features:
 *   1. Text Style Parser — "chill lofi piano with rain" → genre/key/BPM/instrument config
 *   2. Audio Similarity Engine — analyzes uploaded audio → generates ~50% similar music
 */

// ============================================================
// KEYWORD DICTIONARIES
// ============================================================

/** Maps keywords → genre */
const GENRE_KEYWORDS: Record<string, string[]> = {
  'classical': ['classical', 'orchestra', 'symphony', 'baroque', 'operatic', 'concerto', 'sonata'],
  'jazz': ['jazz', 'swing', 'bebop', 'bossa', 'smooth', 'blues', 'funk', 'soul', 'motown'],
  'electronic': ['electronic', 'edm', 'techno', 'trance', 'house', 'dubstep', 'dnb', 'drum and bass', 'future bass', 'synth'],
  'rock': ['rock', 'metal', 'punk', 'grunge', 'indie', 'alternative', 'hard rock', 'garage'],
  'pop': ['pop', 'catchy', 'upbeat', 'dance', 'disco', 'kpop', 'bubblegum'],
  'ambient': ['ambient', 'atmospheric', 'soundscape', 'drone', 'ethereal', 'space', 'meditation', 'zen', 'nature', 'rain', 'ocean', 'peaceful'],
  'lofi': ['lofi', 'lo-fi', 'chill', 'relaxing', 'study', 'cozy', 'warm', 'nostalgic', 'cafe', 'vinyl', 'tape'],
};

/** Maps keywords → instrument */
const INSTRUMENT_KEYWORDS: Record<string, string[]> = {
  'piano': ['piano', 'keys', 'keyboard', 'rhodes', 'grand'],
  'strings': ['strings', 'violin', 'cello', 'viola', 'orchestral'],
  'synth_lead': ['synth', 'lead', 'arpeggio', 'seq'],
  'synth_pad': ['pad', 'ambient', 'atmosphere', 'texture'],
  'bass': ['bass', 'sub', '808', 'low'],
  'flute': ['flute', 'wind', 'woodwind', 'pan'],
  'electric_guitar': ['guitar', 'electric', 'distortion', 'overdrive'],
  'saxophone': ['sax', 'saxophone', 'brass', 'horn', 'trumpet'],
};

/** Maps keywords → mood/energy (affects BPM and temperature) */
const MOOD_KEYWORDS: Record<string, { bpmMod: number; tempMod: number }> = {
  'energetic': { bpmMod: 1.3, tempMod: 0.9 },
  'fast': { bpmMod: 1.4, tempMod: 0.8 },
  'upbeat': { bpmMod: 1.2, tempMod: 0.85 },
  'happy': { bpmMod: 1.15, tempMod: 0.8 },
  'aggressive': { bpmMod: 1.35, tempMod: 1.1 },
  'intense': { bpmMod: 1.3, tempMod: 1.0 },
  'chill': { bpmMod: 0.75, tempMod: 0.7 },
  'relaxing': { bpmMod: 0.65, tempMod: 0.65 },
  'slow': { bpmMod: 0.6, tempMod: 0.7 },
  'sad': { bpmMod: 0.7, tempMod: 0.75 },
  'dark': { bpmMod: 0.8, tempMod: 1.1 },
  'dreamy': { bpmMod: 0.7, tempMod: 0.9 },
  'epic': { bpmMod: 1.1, tempMod: 0.95 },
  'cinematic': { bpmMod: 0.9, tempMod: 0.85 },
  'minimal': { bpmMod: 0.8, tempMod: 0.6 },
  'complex': { bpmMod: 1.0, tempMod: 1.3 },
  'experimental': { bpmMod: 1.0, tempMod: 1.4 },
  'groovy': { bpmMod: 1.05, tempMod: 0.85 },
};

/** Maps keywords → musical key */
const KEY_KEYWORDS: Record<string, string> = {
  'c major': 'C', 'c minor': 'C', 'd major': 'D', 'd minor': 'D',
  'e major': 'E', 'e minor': 'E', 'f major': 'F', 'f minor': 'F',
  'g major': 'G', 'g minor': 'G', 'a major': 'A', 'a minor': 'A',
  'b major': 'B', 'b minor': 'B',
  'key of c': 'C', 'key of d': 'D', 'key of e': 'E', 'key of f': 'F',
  'key of g': 'G', 'key of a': 'A', 'key of b': 'B',
};

// ============================================================
// AUDIO ANALYSIS RESULT
// ============================================================

export interface AudioAnalysisResult {
  detectedBpm: number;
  detectedKey: string;
  energy: number;         // 0-1, overall loudness/energy
  spectralCentroid: number; // Hz, brightness
  zeroCrossingRate: number; // rhythmic density
  suggestedGenre: string;
  suggestedInstrument: string;
}

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class StyleParserService {
  private readonly theory = inject(MusicTheoryService);

  /**
   * PARSE FREE TEXT → CompositionRequest
   *
   * Interprets user descriptions like:
   *   "chill lofi piano with rain vibes"
   *   "energetic electronic synth beat"
   *   "dark ambient soundscape in D minor"
   *
   * Returns a fully configured CompositionRequest for the AI.
   */
  parseStyleText(text: string): CompositionRequest {
    const input = text.toLowerCase().trim();

    // 1. Detect genre from keywords
    let genre = 'pop';
    let genreScore = 0;
    for (const [g, keywords] of Object.entries(GENRE_KEYWORDS)) {
      let score = 0;
      for (const kw of keywords) {
        if (input.includes(kw)) score++;
      }
      if (score > genreScore) {
        genre = g;
        genreScore = score;
      }
    }

    const gc = GENRE_CONFIGS[genre];

    // 2. Detect instrument from keywords
    let instrument = gc.instruments[0]; // Default to genre's primary instrument
    for (const [inst, keywords] of Object.entries(INSTRUMENT_KEYWORDS)) {
      for (const kw of keywords) {
        if (input.includes(kw)) {
          instrument = inst;
          break;
        }
      }
    }

    // 3. Detect key from keywords
    let key = '';
    for (const [phrase, k] of Object.entries(KEY_KEYWORDS)) {
      if (input.includes(phrase)) {
        key = k;
        break;
      }
    }
    // If no key detected, AI picks one
    if (!key) {
      const commonKeys = this.getCommonKeysForGenre(genre);
      key = commonKeys[Math.floor(Math.random() * commonKeys.length)];
    }

    // 4. Detect mood → adjust BPM and temperature
    let bpmMultiplier = 1.0;
    let tempMultiplier = 1.0;
    for (const [mood, mods] of Object.entries(MOOD_KEYWORDS)) {
      if (input.includes(mood)) {
        bpmMultiplier *= mods.bpmMod;
        tempMultiplier *= mods.tempMod;
      }
    }

    // 5. Calculate BPM from genre base, modified by mood
    const baseBpm = (gc.bpm_range[0] + gc.bpm_range[1]) / 2;
    const bpm = Math.floor(Math.min(200, Math.max(40, baseBpm * bpmMultiplier)));

    // 6. Extract explicit BPM if mentioned (e.g. "120 bpm")
    const bpmMatch = input.match(/(\d{2,3})\s*bpm/);
    const finalBpm = bpmMatch ? parseInt(bpmMatch[1], 10) : bpm;

    // 7. Extract explicit bar count (e.g. "32 bars")
    const barsMatch = input.match(/(\d{1,3})\s*bars?/);
    const numBars = barsMatch ? Math.min(64, Math.max(4, parseInt(barsMatch[1], 10))) : 16;

    // 8. Temperature from genre, modified by mood
    const temperature = Math.min(1.5, Math.max(0.1, gc.temperature * tempMultiplier));

    return {
      genre,
      key,
      bpm: finalBpm,
      numBars,
      instrument,
      temperature,
      addEffects: true,
    };
  }

  /**
   * AUDIO SIMILARITY ANALYSIS
   *
   * Decodes uploaded audio, analyzes its characteristics (BPM, key, energy,
   * spectral centroid), and generates a CompositionRequest that creates
   * music ~50% similar to the reference.
   *
   * "50% similar" = same key + similar BPM + similar energy level,
   * but with different melody, chords, and rhythmic variation.
   */
  async analyzeUploadedAudio(audioFile: File): Promise<{
    analysis: AudioAnalysisResult;
    config: CompositionRequest;
  }> {
    // Decode audio to PCM
    const audioCtx = new AudioContext();
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioCtx.close();

    const data = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    // Analyze characteristics
    const detectedBpm = this.detectBpm(data, sampleRate);
    const detectedKey = this.detectKey(data, sampleRate);
    const energy = this.calculateEnergy(data);
    const spectralCentroid = this.calculateSpectralCentroid(data, sampleRate);
    const zeroCrossingRate = this.calculateZeroCrossingRate(data);

    // Map analysis → genre suggestion
    const suggestedGenre = this.suggestGenreFromAnalysis(energy, spectralCentroid, detectedBpm);
    const suggestedInstrument = this.suggestInstrumentFromAnalysis(spectralCentroid, suggestedGenre);

    const analysis: AudioAnalysisResult = {
      detectedBpm,
      detectedKey,
      energy,
      spectralCentroid,
      zeroCrossingRate,
      suggestedGenre,
      suggestedInstrument,
    };

    // Create ~50% similar config:
    // Same: key, similar BPM (±10%), same genre
    // Different: melody (random seed), instruments (AI picks), bars (random)
    const bpmVariation = 0.9 + Math.random() * 0.2; // ±10%
    const config: CompositionRequest = {
      genre: suggestedGenre,
      key: detectedKey,
      bpm: Math.floor(detectedBpm * bpmVariation),
      numBars: [8, 12, 16, 16, 24][Math.floor(Math.random() * 5)],
      instrument: suggestedInstrument,
      temperature: GENRE_CONFIGS[suggestedGenre]?.temperature ?? 0.85,
      addEffects: true,
    };

    return { analysis, config };
  }

  // ============================================================
  // DSP ANALYSIS METHODS
  // ============================================================

  /**
   * Simple BPM detection via autocorrelation on onset envelope
   */
  private detectBpm(data: Float32Array, sampleRate: number): number {
    // Downsample to ~1kHz for fast analysis
    const hop = Math.floor(sampleRate / 1000);
    const envelope: number[] = [];
    for (let i = 0; i < data.length - hop; i += hop) {
      let sum = 0;
      for (let j = 0; j < hop; j++) {
        sum += Math.abs(data[i + j]);
      }
      envelope.push(sum / hop);
    }

    // Onset detection: first derivative of envelope
    const onset: number[] = [];
    for (let i = 1; i < envelope.length; i++) {
      onset.push(Math.max(0, envelope[i] - envelope[i - 1]));
    }

    // Autocorrelation on onset signal
    // BPM range: 60-200 → lag range in ms: 300-1000ms → in samples: 300-1000
    const minLag = 300; // 200 BPM
    const maxLag = Math.min(1000, onset.length - 1); // 60 BPM
    let bestLag = 500;
    let bestCorr = 0;

    for (let lag = minLag; lag < maxLag; lag++) {
      let corr = 0;
      const count = Math.min(onset.length - lag, 2000);
      for (let i = 0; i < count; i++) {
        corr += onset[i] * onset[i + lag];
      }
      if (corr > bestCorr) {
        bestCorr = corr;
        bestLag = lag;
      }
    }

    // Convert lag (ms) to BPM
    const bpm = Math.round(60000 / bestLag);
    return Math.max(40, Math.min(200, bpm));
  }

  /**
   * Key detection via simplified chromagram
   */
  private detectKey(data: Float32Array, sampleRate: number): string {
    const chromagram = new Float32Array(12);
    const fftSize = 4096;
    const hop = 2048;

    for (let start = 0; start + fftSize < data.length; start += hop) {
      // Simple DFT for each pitch class
      for (let pc = 0; pc < 12; pc++) {
        // Frequency of C0 + pitch class, check multiple octaves
        for (let octave = 2; octave < 7; octave++) {
          const freq = 440 * Math.pow(2, (pc - 9 + (octave - 4) * 12) / 12);
          const period = sampleRate / freq;

          // Goertzel-like magnitude estimation
          let real = 0, imag = 0;
          const n = Math.min(fftSize, Math.floor(period * 4));
          for (let i = 0; i < n; i++) {
            const sample = data[start + i] || 0;
            const angle = (2 * Math.PI * freq * i) / sampleRate;
            real += sample * Math.cos(angle);
            imag += sample * Math.sin(angle);
          }
          chromagram[pc] += Math.sqrt(real * real + imag * imag);
        }
      }
    }

    // Find peak pitch class
    let maxEnergy = 0;
    let peakPc = 0;
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (let i = 0; i < 12; i++) {
      if (chromagram[i] > maxEnergy) {
        maxEnergy = chromagram[i];
        peakPc = i;
      }
    }

    return noteNames[peakPc];
  }

  /**
   * Calculate RMS energy (0-1)
   */
  private calculateEnergy(data: Float32Array): number {
    let sum = 0;
    for (const sample of data) {
      sum += sample * sample;
    }
    const rms = Math.sqrt(sum / data.length);
    return Math.min(1, rms * 3); // Scale to 0-1 range
  }

  /**
   * Spectral centroid — measures "brightness" of audio
   */
  private calculateSpectralCentroid(data: Float32Array, sampleRate: number): number {
    const fftSize = 2048;
    const segment = data.slice(Math.floor(data.length * 0.25), Math.floor(data.length * 0.75));

    let weightedSum = 0;
    let magnitudeSum = 0;

    for (let k = 1; k < fftSize / 2; k++) {
      const freq = (k * sampleRate) / fftSize;
      let real = 0, imag = 0;

      const n = Math.min(segment.length, fftSize);
      for (let i = 0; i < n; i++) {
        const angle = (2 * Math.PI * k * i) / fftSize;
        real += segment[i] * Math.cos(angle);
        imag += segment[i] * Math.sin(angle);
      }

      const mag = Math.sqrt(real * real + imag * imag);
      weightedSum += freq * mag;
      magnitudeSum += mag;
    }

    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 1000;
  }

  /**
   * Zero crossing rate — measures rhythmic density
   */
  private calculateZeroCrossingRate(data: Float32Array): number {
    let crossings = 0;
    for (let i = 1; i < data.length; i++) {
      if ((data[i] >= 0 && data[i - 1] < 0) || (data[i] < 0 && data[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / data.length;
  }

  // ============================================================
  // SUGGESTION HELPERS
  // ============================================================

  private suggestGenreFromAnalysis(energy: number, centroid: number, bpm: number): string {
    // High energy + fast BPM → electronic/rock
    if (energy > 0.5 && bpm > 130) return 'electronic';
    if (energy > 0.5 && bpm > 110) return 'rock';
    // Low energy + slow BPM → ambient/lofi
    if (energy < 0.2 && bpm < 85) return 'ambient';
    if (energy < 0.35 && bpm < 95) return 'lofi';
    // Bright centroid + moderate tempo → pop/jazz
    if (centroid > 3000 && bpm > 100 && bpm < 140) return 'pop';
    if (centroid < 2000 && bpm > 80 && bpm < 160) return 'jazz';
    // Classical fallback
    if (bpm < 100 && energy < 0.4) return 'classical';
    return 'pop';
  }

  private suggestInstrumentFromAnalysis(centroid: number, genre: string): string {
    const gc = GENRE_CONFIGS[genre];
    if (!gc) return 'piano';

    // Use spectral centroid to bias toward brighter/darker instruments
    if (centroid > 4000) {
      // Bright → lead instruments
      return gc.instruments.find(i => i.includes('lead') || i.includes('guitar')) ?? gc.instruments[0];
    }
    if (centroid < 1500) {
      // Dark → bass/pad
      return gc.instruments.find(i => i.includes('bass') || i.includes('pad')) ?? gc.instruments[0];
    }
    return gc.instruments[0];
  }

  private getCommonKeysForGenre(genre: string): string[] {
    const keysByGenre: Record<string, string[]> = {
      'classical': ['C', 'G', 'D', 'F', 'A'],
      'jazz': ['Bb', 'Eb', 'F', 'Ab', 'C'],
      'electronic': ['A', 'C', 'D', 'E', 'F'],
      'rock': ['E', 'A', 'D', 'G', 'C'],
      'pop': ['C', 'G', 'D', 'A', 'F'],
      'ambient': ['C', 'D', 'F', 'G', 'A'],
      'lofi': ['C', 'D', 'F', 'G', 'A'],
    };
    return keysByGenre[genre] ?? ['C', 'G', 'D', 'A'];
  }
}
