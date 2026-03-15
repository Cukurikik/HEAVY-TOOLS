import { ScaleLibrary } from '../theory/scales';
import { ChordLibrary } from '../theory/chords';
import { ProgressionLibrary } from '../theory/progressions';
import { RhythmLibrary } from '../theory/rhythm';
import { GENRE_CATALOG, GenreDefinition } from './genre-definitions';

// Match the Python interface
export interface NoteEvent {
  note: number;
  velocity: number;
  durationBeats: number;
  startBeat: number;
  layer?: string;
}

export interface CompositionResult {
  note_events: NoteEvent[];
  melody_events: NoteEvent[];
  chord_events: NoteEvent[];
  bass_events: NoteEvent[];
  bpm: number;
  key: string;
  genre: string;
  num_bars: number;
  beats_per_bar: number;
  chord_progression: string[];
  scale: string;
  totalBeats: number;
}

export class GenreEngine {
  static readonly KEY_MAP: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11,
  };

  static getGenreConfig(genre: string): GenreDefinition {
    return GENRE_CATALOG[genre] || GENRE_CATALOG['pop'];
  }

  static generate(
    genre = 'pop',
    key = 'C',
    bpm?: number,
    numBars = 16
  ): CompositionResult {
    const config = this.getGenreConfig(genre);
    const root = this.KEY_MAP[key] ?? 0;

    if (!bpm) {
      const [bpmLo, bpmHi] = config.bpm_range;
      bpm = Math.floor(Math.random() * (bpmHi - bpmLo + 1) + bpmLo);
    }
    bpm = Math.max(40, Math.min(300, bpm));

    const beatsPerBar = RhythmLibrary.getBeatsPerBar(genre);
    const totalBeats = numBars * beatsPerBar;

    const rawProgression = ProgressionLibrary.getProgression(genre);
    const extendedChords: string[] = [];
    while (extendedChords.length < numBars) {
      extendedChords.push(...rawProgression);
    }
    const finalChords = extendedChords.slice(0, numBars);

    const scaleName = config.scale;
    const [low, high] = config.note_range;
    let scaleNotes = ScaleLibrary.getAllNotes(root, scaleName, low, high);
    if (!scaleNotes.length) {
      scaleNotes = ScaleLibrary.getAllNotes(root, 'major', 48, 84);
    }

    const melodyEvents = this._generateMelody(config, root, scaleName, scaleNotes, finalChords, beatsPerBar, numBars, genre);
    const chordEvents = this._generateChords(config, root, finalChords, beatsPerBar);
    const bassEvents = this._generateBass(config, root, scaleName, finalChords, beatsPerBar, genre);

    return {
      note_events: [...melodyEvents, ...chordEvents, ...bassEvents],
      melody_events: melodyEvents,
      chord_events: chordEvents,
      bass_events: bassEvents,
      bpm,
      key,
      genre,
      num_bars: numBars,
      beats_per_bar: beatsPerBar,
      chord_progression: finalChords,
      scale: scaleName,
      totalBeats
    };
  }

  // ─── Melody Generation ────────────────────────────────

  private static _generateMelody(
    config: GenreDefinition,
    root: number,
    scaleName: string,
    scaleNotes: number[],
    chords: string[],
    beatsPerBar: number,
    numBars: number,
    genreName: string
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    const [velLo, velHi] = config.velocity_range;
    const restProb = config.rest_probability;

    let noteIdx = Math.floor(scaleNotes.length / 2);

    for (let bar = 0; bar < numBars; bar++) {
      const barStart = bar * beatsPerBar;
      const pattern = RhythmLibrary.getMelodyPattern(genreName);

      let beatInBar = 0.0;
      for (const duration of pattern) {
        const absoluteBeat = barStart + beatInBar;

        if (beatInBar + duration > beatsPerBar + 0.01) break;

        if (Math.random() < restProb) {
          beatInBar += duration;
          continue;
        }

        const note = this._chooseMelodyNote(scaleNotes, noteIdx, chords[bar], root);
        noteIdx = this._findNearestIdx(scaleNotes, note);

        const velocity = this._expressiveVelocity(velLo, velHi, beatInBar, beatsPerBar, bar, numBars);

        events.push({
          note,
          velocity,
          durationBeats: Math.max(duration * 0.9, 0.1),
          startBeat: absoluteBeat,
          layer: 'melody'
        });

        beatInBar += duration;
      }
    }
    return events;
  }

  private static _chooseMelodyNote(
    scaleNotes: number[], currentIdx: number,
    chordRoman: string, root: number
  ): number {
    const stepWeights: Record<number, number> = {
      '-3': 0.05, '-2': 0.15, '-1': 0.3, '0': 0.1, '1': 0.3, '2': 0.15, '3': 0.05
    };

    const center = Math.floor(scaleNotes.length / 2);
    if (currentIdx > center + 5) {
      stepWeights['-2'] += 0.15;
      stepWeights['-1'] += 0.1;
    } else if (currentIdx < center - 5) {
      stepWeights['2'] += 0.15;
      stepWeights['1'] += 0.1;
    }

    const steps = Object.keys(stepWeights).map(Number);
    const weights = Object.values(stepWeights);
    const step = this._weightedRandom(steps, weights);

    const newIdx = Math.max(0, Math.min(scaleNotes.length - 1, currentIdx + step));
    let note = scaleNotes[newIdx];

    if (Math.random() < 0.3) {
      const chordNotes = ChordLibrary.getChordFromRoman(chordRoman, (root + 60) % 12 + 60);
      if (chordNotes.length) {
        let bestDist = 999;
        let target = chordNotes[0];
        for (const cn of chordNotes) {
          if (Math.abs(cn - note) < bestDist) {
            bestDist = Math.abs(cn - note);
            target = cn;
          }
        }
        note = ScaleLibrary.snapToScale(target, root, 'major');
        note = Math.max(scaleNotes[0], Math.min(scaleNotes[scaleNotes.length - 1], note));
      }
    }

    return note;
  }

  // ─── Chord Generation ─────────────────────────────────

  private static _generateChords(
    config: GenreDefinition, root: number, chords: string[], beatsPerBar: number
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    const [velLo] = config.velocity_range;

    for (let barIdx = 0; barIdx < chords.length; barIdx++) {
      const chordRoman = chords[barIdx];
      const barStart = barIdx * beatsPerBar;
      const chordNotes = ChordLibrary.getChordFromRoman(chordRoman, (root + 48) % 12 + 48);

      if (!chordNotes.length) continue;

      const chordVel = Math.max(40, velLo - 15);

      if (Math.random() < 0.6) {
        for (const cn of chordNotes.slice(0, 4)) {
          events.push({
            note: cn,
            velocity: chordVel + Math.floor(Math.random() * 11) - 5,
            durationBeats: beatsPerBar * 0.9,
            startBeat: barStart,
            layer: 'chords'
          });
        }
      } else {
        const half = beatsPerBar / 2;
        for (let hit = 0; hit < 2; hit++) {
          for (const cn of chordNotes.slice(0, 4)) {
            events.push({
              note: cn,
              velocity: chordVel + Math.floor(Math.random() * 11) - 5,
              durationBeats: half * 0.85,
              startBeat: barStart + hit * half,
              layer: 'chords'
            });
          }
        }
      }
    }
    return events;
  }

  // ─── Bass Generation ──────────────────────────────────

  private static _generateBass(
    config: GenreDefinition, root: number, scaleName: string,
    chords: string[], beatsPerBar: number, genre: string
  ): NoteEvent[] {
    const events: NoteEvent[] = [];
    let bassNotes = ScaleLibrary.getAllNotes(root, scaleName, 28, 55);
    if (!bassNotes.length) bassNotes = ScaleLibrary.getAllNotes(root, 'major', 36, 55);

    const velLo = Math.max(70, config.velocity_range[0]);

    for (let barIdx = 0; barIdx < chords.length; barIdx++) {
      const chordRoman = chords[barIdx];
      const barStart = barIdx * beatsPerBar;

      let bassRoot = root;
      if (ChordLibrary.ROMAN_NUMERALS[chordRoman]) {
        bassRoot = root + ChordLibrary.ROMAN_NUMERALS[chordRoman][0];
      }

      let bassNote = bassNotes[Math.floor(bassNotes.length / 2)];
      for (const bn of bassNotes) {
        if (bn % 12 === bassRoot % 12) {
          bassNote = bn;
          break;
        }
      }

      const bassPattern = this._getBassPattern(genre, beatsPerBar);

      for (const [beatOffset, dur] of bassPattern) {
        if (beatOffset + dur > beatsPerBar + 0.01) break;

        let note = bassNote;
        if (beatOffset > 0 && Math.random() < 0.25) {
          const fifth = bassNote + 7;
          if (bassNotes.includes(fifth)) note = fifth;
          else if (bassNote + 12 <= 55) note = bassNote + 12;
        }

        events.push({
          note,
          velocity: velLo + Math.floor(Math.random() * 16) - 5,
          durationBeats: dur * 0.85,
          startBeat: barStart + beatOffset,
          layer: 'bass'
        });
      }
    }
    return events;
  }

  private static _getBassPattern(genre: string, beatsPerBar: number): [number, number][] {
    const patterns: Record<string, [number, number][]> = {
      'pop':          [[0, 1], [2, 1]],
      'rock':         [[0, 0.5], [1, 0.5], [2, 0.5], [3, 0.5]],
      'blues':        [[0, 1], [1, 0.5], [2, 1], [3.5, 0.5]],
      'jazz':         [[0, 1], [1.5, 0.5], [2, 1], [3.5, 0.5]],
      'classical':    [[0, 2], [2, 2]],
      'electronic':   [[0, 0.5], [0.5, 0.5], [1, 0.5], [1.5, 0.5], [2, 0.5], [2.5, 0.5], [3, 0.5], [3.5, 0.5]],
      'ambient':      [[0, 4]],
      'rnb':          [[0, 1.5], [1.5, 1], [2.5, 1.5]],
      'hiphop':       [[0, 1], [2, 1]],
      'country':      [[0, 1], [1, 1], [2, 1], [3, 1]],
      'reggae':       [[0.5, 0.5], [1.5, 0.5], [2.5, 0.5], [3.5, 0.5]],
      'latin':        [[0, 0.75], [0.75, 0.75], [1.5, 0.5], [2, 0.75], [2.75, 0.75], [3.5, 0.5]],
      'metal':        [[0, 0.25], [0.25, 0.25], [0.5, 0.25], [0.75, 0.25], [1, 0.25], [1.25, 0.25], [1.5, 0.25], [1.75, 0.25], [2, 0.5], [2.5, 0.5], [3, 0.5], [3.5, 0.5]],
      'funk':         [[0, 0.25], [0.5, 0.25], [1, 0.5], [2, 0.25], [2.5, 0.25], [3, 0.5], [3.5, 0.5]],
      'gospel':       [[0, 1], [1, 1], [2, 1], [3, 1]],
      'celtic':       [[0, 1], [1, 0.5], [1.5, 0.5], [2, 1], [3, 1]],
      'middle_eastern': [[0, 1.5], [1.5, 0.5], [2, 1], [3, 1]],
      'cinematic':    [[0, 2], [2, 2]],
      'lofi':         [[0, 1.5], [1.5, 1], [2.5, 1.5]],
      'trap':         [[0, 2], [2, 0.5], [3, 0.5], [3.5, 0.5]],
      'synthwave':    [[0, 0.5], [0.5, 0.5], [1, 0.5], [1.5, 0.5], [2, 0.5], [2.5, 0.5], [3, 0.5], [3.5, 0.5]],
      'disco':        [[0, 0.5], [0.5, 0.5], [1, 0.5], [1.5, 0.5], [2, 0.5], [2.5, 0.5], [3, 0.5], [3.5, 0.5]],
      'bossa_nova':   [[0, 1.5], [1.5, 1], [2.5, 0.5], [3, 0.5], [3.5, 0.5]],
      'waltz':        [[0, 1], [1, 1], [2, 1]],
      'flamenco':     [[0, 1], [1, 0.5], [1.5, 0.5], [2, 1]],
      'dnb':          [[0, 0.5], [1, 0.5], [2, 0.5], [3, 0.5]],
      'dubstep':      [[0, 2], [2, 0.5], [2.75, 0.25], [3, 0.5], [3.5, 0.5]],
    };
    const pat = patterns[genre] || [[0, 1], [2, 1]];
    return pat.filter(([b]) => b < beatsPerBar);
  }

  // ─── Helpers ──────────────────────────────────────────

  private static _findNearestIdx(notes: number[], target: number): number {
    let bestIdx = 0;
    let bestDist = Math.abs(notes[0] - target);
    for (let i = 0; i < notes.length; i++) {
      const d = Math.abs(notes[i] - target);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  private static _expressiveVelocity(
    velLo: number, velHi: number,
    beatInBar: number, beatsPerBar: number,
    bar: number, totalBars: number
  ): number {
    const accent = Math.abs(beatInBar % beatsPerBar) < 0.1 ? 8 : 0;
    const progress = bar / Math.max(totalBars - 1, 1);
    const dynamicOffset = progress < 0.5
      ? Math.floor(progress * 2 * 15)
      : Math.floor((1 - progress) * 2 * 15);

    const velocity = Math.floor(Math.random() * (velHi - velLo + 1) + velLo) + accent + dynamicOffset;
    return Math.max(1, Math.min(127, velocity));
  }

  private static _weightedRandom(items: number[], weights: number[]): number {
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      if (rand < weights[i]) return items[i];
      rand -= weights[i];
    }
    return items[0];
  }
}
