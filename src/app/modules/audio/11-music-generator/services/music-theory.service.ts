import { Injectable } from '@angular/core';

/**
 * MUSIC THEORY SERVICE
 *
 * The foundational brain of the AI Music Generator.
 * Ported from Python config.py + tokenizer.py with complete music theory:
 *   - 7 Genre configurations with BPM ranges, scales, instruments, temperature
 *   - 9 Scale definitions (major, minor, dorian, etc.)
 *   - 6 Chord progression templates
 *   - 9 Chord voicings (major, minor, dim, aug, 7ths, sus)
 *   - Random-walk melodic generator with momentum and center-gravity
 *   - Note event output: { note, velocity, durationBeats, startBeat }
 */

// ============================================================
// TYPES
// ============================================================

export interface NoteEvent {
  note: number;           // MIDI note number 0-127
  velocity: number;       // 0-127
  durationBeats: number;  // Duration in beats
  startBeat: number;      // Start time in beats
}

export interface GenreConfig {
  name: string;
  label: string;
  icon: string;
  bpmRange: [number, number];
  scale: string;
  instruments: string[];
  temperature: number;
  chordProgression: string;
  drumsEnabled: boolean;
  swingFactor: number;  // 0 = straight, 0.05+ = swing
}

export interface CompositionRequest {
  genre: string;
  key: string;
  bpm: number;
  numBars: number;
  instrument: string;
  temperature: number;
  addEffects: boolean;
}

// ============================================================
// CONSTANTS
// ============================================================

/** All 12 chromatic note names */
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

/** Map note name to MIDI C4 base number */
export const KEY_TO_MIDI: Record<string, number> = {
  'C': 60, 'C#': 61, 'D': 62, 'D#': 63, 'E': 64, 'F': 65,
  'F#': 66, 'G': 67, 'G#': 68, 'A': 69, 'A#': 70, 'B': 71,
};

/** Scale intervals (semitones from root) — Ported from Python SCALES */
export const SCALES: Record<string, number[]> = {
  'major':            [0, 2, 4, 5, 7, 9, 11],
  'minor':            [0, 2, 3, 5, 7, 8, 10],
  'dorian':           [0, 2, 3, 5, 7, 9, 10],
  'mixolydian':       [0, 2, 4, 5, 7, 9, 10],
  'lydian':           [0, 2, 4, 6, 7, 9, 11],
  'pentatonic_major': [0, 2, 4, 7, 9],
  'pentatonic_minor': [0, 3, 5, 7, 10],
  'blues':            [0, 3, 5, 6, 7, 10],
  'chromatic':        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

/** Chord intervals relative to scale degree */
export const CHORD_VOICINGS: Record<string, number[]> = {
  'major':  [0, 4, 7],
  'minor':  [0, 3, 7],
  'dim':    [0, 3, 6],
  'aug':    [0, 4, 8],
  'maj7':   [0, 4, 7, 11],
  'min7':   [0, 3, 7, 10],
  'dom7':   [0, 4, 7, 10],
  'sus2':   [0, 2, 7],
  'sus4':   [0, 5, 7],
};

/** Chord progression templates using Roman numeral indices */
const CHORD_PROGRESSIONS: Record<string, number[][]> = {
  'pop':       [[0, 4, 7], [7, 11, 14], [9, 12, 16], [5, 9, 12]],       // I-V-vi-IV
  'jazz':      [[2, 5, 9], [7, 11, 14], [0, 4, 7], [9, 12, 16]],        // ii-V-I-vi
  'blues':     [[0, 4, 7], [0, 4, 7], [5, 9, 12], [0, 4, 7], [7, 11, 14], [5, 9, 12], [0, 4, 7], [7, 11, 14]],
  'minor':     [[0, 3, 7], [5, 8, 12], [7, 10, 14], [0, 3, 7]],         // i-iv-v-i
  'emotional': [[9, 12, 16], [5, 9, 12], [0, 4, 7], [7, 11, 14]],       // vi-IV-I-V
  'major':     [[0, 4, 7], [5, 9, 12], [7, 11, 14], [0, 4, 7]],         // I-IV-V-I
};

/** Genre presets — Ported from Python GENRES config */
export const GENRE_CONFIGS: Record<string, GenreConfig> = {
  'classical': {
    name: 'classical', label: '🎻 Classical', icon: '🎻',
    bpmRange: [60, 120], scale: 'major',
    instruments: ['piano', 'strings', 'flute'],
    temperature: 0.7, chordProgression: 'major',
    drumsEnabled: false, swingFactor: 0,
  },
  'jazz': {
    name: 'jazz', label: '🎷 Jazz', icon: '🎷',
    bpmRange: [80, 160], scale: 'dorian',
    instruments: ['piano', 'bass', 'saxophone'],
    temperature: 0.9, chordProgression: 'jazz',
    drumsEnabled: true, swingFactor: 0.08,
  },
  'electronic': {
    name: 'electronic', label: '🎹 Electronic', icon: '🎹',
    bpmRange: [120, 150], scale: 'minor',
    instruments: ['synth_lead', 'synth_pad', 'bass'],
    temperature: 0.85, chordProgression: 'emotional',
    drumsEnabled: true, swingFactor: 0,
  },
  'rock': {
    name: 'rock', label: '🎸 Rock', icon: '🎸',
    bpmRange: [100, 140], scale: 'pentatonic_minor',
    instruments: ['electric_guitar', 'bass', 'synth_pad'],
    temperature: 0.8, chordProgression: 'pop',
    drumsEnabled: true, swingFactor: 0,
  },
  'pop': {
    name: 'pop', label: '🎤 Pop', icon: '🎤',
    bpmRange: [100, 130], scale: 'major',
    instruments: ['piano', 'synth_pad', 'bass'],
    temperature: 0.75, chordProgression: 'pop',
    drumsEnabled: true, swingFactor: 0,
  },
  'ambient': {
    name: 'ambient', label: '🌊 Ambient', icon: '🌊',
    bpmRange: [60, 90], scale: 'lydian',
    instruments: ['synth_pad', 'strings', 'flute'],
    temperature: 0.95, chordProgression: 'emotional',
    drumsEnabled: false, swingFactor: 0,
  },
  'lofi': {
    name: 'lofi', label: '📻 Lo-Fi', icon: '📻',
    bpmRange: [70, 90], scale: 'minor',
    instruments: ['piano', 'bass', 'synth_pad'],
    temperature: 0.8, chordProgression: 'jazz',
    drumsEnabled: true, swingFactor: 0.05,
  },
};

/** Instrument options for the UI */
export const INSTRUMENT_OPTIONS = [
  { value: 'piano', label: '🎹 Piano' },
  { value: 'strings', label: '🎻 Strings' },
  { value: 'synth_lead', label: '🎵 Synth Lead' },
  { value: 'synth_pad', label: '🎶 Synth Pad' },
  { value: 'bass', label: '🎸 Bass' },
  { value: 'flute', label: '🎶 Flute' },
  { value: 'electric_guitar', label: '⚡ Electric Guitar' },
  { value: 'saxophone', label: '🎷 Saxophone' },
];

// ============================================================
// SERVICE
// ============================================================

@Injectable({ providedIn: 'root' })
export class MusicTheoryService {

  /**
   * Get all MIDI notes for a scale across octaves 1-8.
   * Ported from Python MusicTokenizer.get_scale_notes()
   */
  getScaleNotes(rootMidi: number, scaleName: string): number[] {
    const intervals = SCALES[scaleName] ?? SCALES['major'];
    const notes: number[] = [];
    // Build scale notes across octaves, anchored at root
    const rootPitchClass = rootMidi % 12;
    for (let octave = 0; octave < 11; octave++) {
      for (const interval of intervals) {
        const note = rootPitchClass + (octave * 12) + interval;
        if (note >= 0 && note < 128) {
          notes.push(note);
        }
      }
    }
    return [...new Set(notes)].sort((a, b) => a - b);
  }

  /**
   * Get MIDI notes for a chord given a root note and voicing type.
   * Ported from Python MusicTokenizer.get_chord_notes()
   */
  getChordNotes(rootMidi: number, chordType = 'major'): number[] {
    const intervals = CHORD_VOICINGS[chordType] ?? CHORD_VOICINGS['major'];
    return intervals
      .map(i => rootMidi + i)
      .filter(n => n >= 0 && n < 128);
  }

  /**
   * Get the chord progression for a genre, transposed to a given root note.
   */
  getChordProgression(genre: string, rootMidi: number): number[][] {
    const config = GENRE_CONFIGS[genre];
    const progressionName = config?.chordProgression ?? 'major';
    const template = CHORD_PROGRESSIONS[progressionName] ?? CHORD_PROGRESSIONS['major'];
    // Transpose: each chord's intervals are relative to C, shift by root
    return template.map(chord =>
      chord.map(interval => rootMidi + interval).filter(n => n >= 0 && n < 128)
    );
  }

  /**
   * COMPOSE A FULL PIECE
   *
   * Generates note events for lead melody, chord pads, bassline, and drums.
   * Ported from Python tokenizer.generate_training_sequence() with massive enhancements.
   *
   * @returns Object with separate note event arrays for each layer
   */
  compose(request: CompositionRequest): {
    melody: NoteEvent[];
    chords: NoteEvent[];
    bass: NoteEvent[];
    drums: NoteEvent[];
    totalBeats: number;
  } {
    const genreConfig = GENRE_CONFIGS[request.genre] ?? GENRE_CONFIGS['pop'];
    const rootMidi = KEY_TO_MIDI[request.key] ?? 60;
    const scaleName = genreConfig.scale;
    const temperature = request.temperature;

    // Get scale notes in playable range (MIDI 48-84)
    const allScaleNotes = this.getScaleNotes(rootMidi, scaleName);
    const scaleNotes = allScaleNotes.filter(n => n >= 48 && n <= 84);
    if (scaleNotes.length === 0) return { melody: [], chords: [], bass: [], drums: [], totalBeats: 0 };

    // Get chord progression
    const chordProg = this.getChordProgression(request.genre, rootMidi);

    const beatsPerBar = 4;
    const totalBeats = request.numBars * beatsPerBar;

    // Generate each layer
    const melody = this.generateMelody(scaleNotes, totalBeats, temperature, genreConfig);
    const chords = this.generateChords(chordProg, totalBeats, genreConfig);
    const bass = this.generateBass(chordProg, totalBeats, rootMidi, genreConfig);
    const drums = genreConfig.drumsEnabled
      ? this.generateDrums(totalBeats, request.bpm, genreConfig)
      : [];

    return { melody, chords, bass, drums, totalBeats };
  }

  /**
   * MELODY GENERATOR (Random Walk with Momentum)
   * Ported from Python tokenizer's random walk algorithm.
   */
  private generateMelody(
    scaleNotes: number[],
    totalBeats: number,
    temperature: number,
    genre: GenreConfig
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    let currentBeat = 0;
    let noteIdx = Math.floor(scaleNotes.length / 2); // Start in middle
    const center = noteIdx;

    // Duration choices weighted by genre
    const durationChoices = genre.name === 'ambient'
      ? [1.0, 1.5, 2.0, 2.0, 3.0, 4.0]
      : genre.name === 'lofi'
        ? [0.5, 0.5, 1.0, 1.0, 1.5, 2.0]
        : [0.25, 0.5, 0.5, 1.0, 1.0, 1.0, 1.5, 2.0];

    while (currentBeat < totalBeats) {
      // Random walk step with scale-aware weights
      const stepWeights = [-2, -1, 0, 1, 2];
      const weights = [0.1, 0.25, 0.15, 0.25, 0.1];

      // Thermal randomness: higher temperature = more random
      const adjustedWeights = weights.map(w => Math.pow(w, 1 / temperature));
      const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
      const normalized = adjustedWeights.map(w => w / totalWeight);

      // Weighted random selection
      let rand = Math.random();
      let step = 0;
      for (let i = 0; i < normalized.length; i++) {
        rand -= normalized[i];
        if (rand <= 0) { step = stepWeights[i]; break; }
      }

      // Center gravity — pull towards middle of range
      if (noteIdx > center + 4) step -= 1;
      else if (noteIdx < center - 4) step += 1;

      noteIdx = Math.max(0, Math.min(scaleNotes.length - 1, noteIdx + step));
      const note = scaleNotes[noteIdx];

      // Velocity variation for expression
      const velocity = Math.floor(60 + Math.random() * 50); // 60-110

      // Duration selection
      const duration = durationChoices[Math.floor(Math.random() * durationChoices.length)];

      // Occasional rest (15% chance)
      if (Math.random() < 0.15) {
        currentBeat += 0.25;
        continue;
      }

      events.push({
        note,
        velocity,
        durationBeats: Math.max(duration, 0.125),
        startBeat: currentBeat,
      });

      currentBeat += duration;
    }

    return events;
  }

  /**
   * CHORD PAD GENERATOR
   * Plays sustained chords following the progression for each bar.
   */
  private generateChords(
    chordProg: number[][],
    totalBeats: number,
    genre: GenreConfig
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    const barDuration = 4; // beats per bar
    const totalBars = Math.floor(totalBeats / barDuration);

    for (let bar = 0; bar < totalBars; bar++) {
      const chordNotes = chordProg[bar % chordProg.length];
      const startBeat = bar * barDuration;

      // Shift chords up an octave for separation from bass
      for (const note of chordNotes) {
        const chordNote = note + (note < 60 ? 12 : 0); // Ensure mid-range
        if (chordNote < 128) {
          events.push({
            note: chordNote,
            velocity: genre.name === 'ambient' ? 40 : 55,
            durationBeats: barDuration, // Sustain whole bar
            startBeat,
          });
        }
      }
    }

    return events;
  }

  /**
   * BASSLINE GENERATOR
   * Plays the root of each chord with rhythmic variation by genre.
   */
  private generateBass(
    chordProg: number[][],
    totalBeats: number,
    rootMidi: number,
    genre: GenreConfig
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    if (genre.name === 'ambient') return events; // No bass in ambient

    const barDuration = 4;
    const totalBars = Math.floor(totalBeats / barDuration);

    for (let bar = 0; bar < totalBars; bar++) {
      const chordNotes = chordProg[bar % chordProg.length];
      // Bass plays the root note of the chord, dropped 1-2 octaves
      let bassNote = (chordNotes[0] ?? rootMidi);
      while (bassNote > 48) bassNote -= 12; // Drop to bass range
      while (bassNote < 28) bassNote += 12; // Not too low

      const startBeat = bar * barDuration;

      if (genre.name === 'lofi' || genre.name === 'jazz') {
        // Sparse bass: beats 1 and 3 with occasional ghost notes
        for (let beat = 0; beat < 4; beat++) {
          if (beat === 0 || beat === 2) {
            events.push({
              note: bassNote,
              velocity: 85,
              durationBeats: 1.0,
              startBeat: startBeat + beat,
            });
          } else if (Math.random() > 0.5) {
            events.push({
              note: bassNote + (Math.random() > 0.5 ? 7 : 5), // 5th or 4th
              velocity: 60,
              durationBeats: 0.5,
              startBeat: startBeat + beat,
            });
          }
        }
      } else {
        // Driving bass: 8th notes for electronic/rock
        const stepsPerBar = genre.name === 'electronic' ? 8 : 4;
        const stepDuration = barDuration / stepsPerBar;
        for (let s = 0; s < stepsPerBar; s++) {
          if (genre.name === 'pop' && s % 2 === 1 && Math.random() > 0.4) continue;
          events.push({
            note: bassNote,
            velocity: s === 0 ? 90 : 70,
            durationBeats: stepDuration,
            startBeat: startBeat + s * stepDuration,
          });
        }
      }
    }

    return events;
  }

  /**
   * DRUM PATTERN GENERATOR
   * Creates kick/snare/hihat patterns based on genre.
   */
  private generateDrums(
    totalBeats: number,
    _bpm: number,
    genre: GenreConfig
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    // MIDI standard drum notes: kick=36, snare=38, hihat_closed=42, hihat_open=46
    const KICK = 36, SNARE = 38, HIHAT = 42;

    for (let beat = 0; beat < totalBeats; beat++) {
      const posInBar = beat % 4;
      const swing = genre.swingFactor;

      // KICK: beats 1 & 3
      if (posInBar === 0 || posInBar === 2) {
        events.push({ note: KICK, velocity: 100, durationBeats: 0.25, startBeat: beat });
      }
      // Ghost kick for lofi
      if (genre.name === 'lofi' && posInBar === 1 && Math.random() > 0.5) {
        events.push({ note: KICK, velocity: 60, durationBeats: 0.25, startBeat: beat + 0.5 });
      }

      // SNARE: beats 2 & 4
      if (posInBar === 1 || posInBar === 3) {
        events.push({ note: SNARE, velocity: 90, durationBeats: 0.25, startBeat: beat });
      }

      // HI-HAT: 8th notes with optional swing
      events.push({ note: HIHAT, velocity: 70, durationBeats: 0.125, startBeat: beat });
      events.push({ note: HIHAT, velocity: 50, durationBeats: 0.125, startBeat: beat + 0.5 + swing });
    }

    return events;
  }

  /**
   * Convert MIDI note number to frequency in Hz.
   * Standard formula: f = 440 * 2^((n-69)/12)
   */
  midiToFreq(midi: number): number {
    return 440.0 * Math.pow(2, (midi - 69) / 12.0);
  }

  /**
   * Get note name from MIDI number (e.g., 60 → "C4")
   */
  midiToName(midi: number): string {
    const name = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${name}${octave}`;
  }

  /**
   * AUTO-COMPOSE: The AI decides EVERYTHING on its own.
   *
   * Given only an optional style hint (or nothing at all), the AI autonomously:
   *   - Picks the genre
   *   - Picks the musical key (weighted by genre aptness)
   *   - Picks the BPM from the genre's range
   *   - Picks lead, pad, and bass instruments
   *   - Sets creativity/temperature
   *   - Determines length (8-32 bars)
   *   - Composes melody, chords, bass, drums
   *
   * @param styleHint Optional genre hint (e.g. 'lofi', 'jazz'). If omitted, AI picks randomly.
   * @returns CompositionRequest + the composed note events
   */
  autoCompose(styleHint?: string): {
    config: CompositionRequest;
    melody: NoteEvent[];
    chords: NoteEvent[];
    bass: NoteEvent[];
    drums: NoteEvent[];
    totalBeats: number;
    instruments: { lead: string; pad: string; bass: string };
  } {
    // 1. AI picks genre
    const genreNames = Object.keys(GENRE_CONFIGS);
    const genre = (styleHint && GENRE_CONFIGS[styleHint])
      ? styleHint
      : genreNames[Math.floor(Math.random() * genreNames.length)];
    const gc = GENRE_CONFIGS[genre];

    // 2. AI picks key — weighted towards common keys for the genre
    const commonKeys = this.getCommonKeysForGenre(genre);
    const key = commonKeys[Math.floor(Math.random() * commonKeys.length)];

    // 3. AI picks BPM from genre range with slight randomization
    const [bpmLow, bpmHigh] = gc.bpmRange;
    const bpm = Math.floor(bpmLow + Math.random() * (bpmHigh - bpmLow));

    // 4. AI picks instruments based on genre
    const instruments = this.autoSelectInstruments(genre);

    // 5. AI sets temperature from genre config
    const temperature = gc.temperature;

    // 6. AI decides length (8-32 bars, weighted towards 16)
    const barOptions = [8, 12, 16, 16, 16, 24, 32];
    const numBars = barOptions[Math.floor(Math.random() * barOptions.length)];

    // 7. Build config
    const config: CompositionRequest = {
      genre,
      key,
      bpm,
      numBars,
      instrument: instruments.lead,
      temperature,
      addEffects: true,
    };

    // 8. Compose
    const result = this.compose(config);

    return {
      config,
      ...result,
      instruments,
    };
  }

  /**
   * Get commonly used keys for a genre (weighted list).
   * E.g. Jazz often uses Bb, Eb, F; Pop uses C, G, D, A
   */
  private getCommonKeysForGenre(genre: string): string[] {
    const keysByGenre: Record<string, string[]> = {
      'classical': ['C', 'G', 'D', 'F', 'A', 'E', 'Bb'],
      'jazz':      ['Bb', 'Eb', 'F', 'Ab', 'C', 'G', 'D'],
      'electronic': ['A', 'C', 'D', 'E', 'F', 'G'],
      'rock':      ['E', 'A', 'D', 'G', 'C', 'B'],
      'pop':       ['C', 'G', 'D', 'A', 'F', 'E'],
      'ambient':   ['C', 'D', 'F', 'G', 'A', 'E'],
      'lofi':      ['C', 'D', 'F', 'G', 'A', 'Bb', 'Eb'],
    };
    return keysByGenre[genre] ?? ['C', 'G', 'D', 'A', 'F'];
  }

  /**
   * AI auto-selects lead, pad, and bass instruments based on genre.
   * Each genre has a pool of fitting instruments and the AI picks randomly from each pool.
   */
  autoSelectInstruments(genre: string): { lead: string; pad: string; bass: string } {
    const pools: Record<string, { lead: string[]; pad: string[]; bass: string[] }> = {
      'classical': {
        lead: ['piano', 'flute', 'strings'],
        pad:  ['strings', 'synth_pad'],
        bass: ['bass', 'strings'],
      },
      'jazz': {
        lead: ['saxophone', 'piano', 'flute', 'electric_guitar'],
        pad:  ['piano', 'synth_pad'],
        bass: ['bass'],
      },
      'electronic': {
        lead: ['synth_lead', 'synth_pad'],
        pad:  ['synth_pad', 'strings'],
        bass: ['bass', 'synth_lead'],
      },
      'rock': {
        lead: ['electric_guitar', 'synth_lead'],
        pad:  ['synth_pad', 'strings'],
        bass: ['bass'],
      },
      'pop': {
        lead: ['piano', 'synth_lead', 'flute'],
        pad:  ['synth_pad', 'strings'],
        bass: ['bass'],
      },
      'ambient': {
        lead: ['synth_pad', 'flute', 'strings'],
        pad:  ['synth_pad', 'strings'],
        bass: ['bass', 'synth_pad'],
      },
      'lofi': {
        lead: ['piano', 'electric_guitar', 'flute'],
        pad:  ['synth_pad', 'piano'],
        bass: ['bass'],
      },
    };

    const pool = pools[genre] ?? pools['pop'];
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    return {
      lead: pick(pool.lead),
      pad:  pick(pool.pad),
      bass: pick(pool.bass),
    };
  }
}
