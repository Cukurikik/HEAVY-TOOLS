import { Injectable } from '@angular/core';
// unused imports removed
import { RhythmLibrary } from './theory/rhythm';
import { GENRE_CATALOG, GenreDefinition } from './genres/genre-definitions';
import { GenreEngine, NoteEvent, CompositionResult } from './genres/genre-engine';
import { DrumLibrary } from './theory/drums';

/**
 * MUSIC THEORY SERVICE
 *
 * The foundational brain of the AI Music Generator.
 * Powered by massive 27-genre library covering:
 *   - 37 Musical Scales
 *   - 36 Chord Voicings
 *   - 60+ Chord Progressions
 *   - 80+ Rhythm Patterns
 */

export type { NoteEvent, CompositionResult };

export interface CompositionRequest {
  genre: string;
  key: string;
  bpm: number;
  numBars: number;
  instrument: string;
  temperature: number;
  addEffects: boolean;
}

export const GENRE_CONFIGS = GENRE_CATALOG;

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export const KEY_TO_MIDI: Record<string, number> = {
  'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
  'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
  'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71,
};

export const INSTRUMENT_OPTIONS = [
  { value: 'piano', label: '🎹 Piano' },
  { value: 'strings', label: '🎻 Strings' },
  { value: 'synth_lead', label: '🎵 Synth Lead' },
  { value: 'synth_pad', label: '🎶 Synth Pad' },
  { value: 'bass', label: '🎸 Bass' },
  { value: 'flute', label: '🎶 Flute' },
  { value: 'electric_guitar', label: '⚡ Electric Guitar' },
  { value: 'saxophone', label: '🎷 Saxophone' },
  { value: 'bass_wobble', label: '🔉 Bass Wobble' },
  { value: 'bass_808', label: '🔊 808 Bass' },
  { value: 'cello', label: '🎻 Cello' },
  { value: 'violin', label: '🎻 Violin' },
  { value: 'brass', label: '🎺 Brass' },
  { value: 'bells', label: '🔔 Bells' },
  { value: 'oud', label: '🪕 Oud' },
  { value: 'percussion', label: '🥁 Percussion' },
  { value: 'acoustic_guitar', label: '🎸 Acoustic Guitar' },
  { value: 'double_bass', label: '🎻 Double Bass' },
  { value: 'organ', label: '🎹 Organ' },
  { value: 'drums', label: '🥁 Drums' }
];

@Injectable({ providedIn: 'root' })
export class MusicTheoryService {
  
  compose(request: CompositionRequest): {
    melody: NoteEvent[];
    chords: NoteEvent[];
    bass: NoteEvent[];
    drums: NoteEvent[];
    totalBeats: number;
  } {
    const res = GenreEngine.generate(request.genre, request.key, request.bpm, request.numBars);
    
    // Add drums here since genre engine just handles pitched instruments
    const drums = this.generateDrums(res.totalBeats, res.bpm, GENRE_CONFIGS[res.genre]);

    return {
      melody: res.melody_events,
      chords: res.chord_events,
      bass: res.bass_events,
      drums,
      totalBeats: res.totalBeats,
    };
  }

  private generateDrums(totalBeats: number, _bpm: number, genre: GenreDefinition): NoteEvent[] {
    const beatsPerBar = RhythmLibrary.getBeatsPerBar(genre.display_name.split(' ')[1]?.toLowerCase() || 'pop');
    const numBars = Math.ceil(totalBeats / beatsPerBar);
    const genreKey = genre.display_name.toLowerCase().replace(/[^a-z]/g, '');
    let patternKey = 'pop';
    
    // Find matching drum pattern
    const availablePatterns = Object.keys(DrumLibrary.PATTERNS);
    for (const key of availablePatterns) {
      if (genreKey.includes(key.replace('_', ''))) {
        patternKey = key;
        break;
      }
    }

    return DrumLibrary.generate(patternKey, numBars, beatsPerBar, genre.swing);
  }

  midiToFreq(midi: number): number {
    return 440.0 * Math.pow(2, (midi - 69) / 12.0);
  }

  midiToName(midi: number): string {
    const name = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${name}${octave}`;
  }

  autoCompose(styleHint?: string): {
    config: CompositionRequest;
    melody: NoteEvent[];
    chords: NoteEvent[];
    bass: NoteEvent[];
    drums: NoteEvent[];
    totalBeats: number;
    instruments: { lead: string; pad: string; bass: string };
  } {
    const genreNames = Object.keys(GENRE_CONFIGS);
    const genre = (styleHint && GENRE_CONFIGS[styleHint])
      ? styleHint
      : genreNames[Math.floor(Math.random() * genreNames.length)];
    const gc = GENRE_CONFIGS[genre];

    const commonKeys = this.getCommonKeysForGenre(genre);
    const key = commonKeys[Math.floor(Math.random() * commonKeys.length)];

    const [bpmLow, bpmHigh] = gc.bpm_range;
    const bpm = Math.floor(bpmLow + Math.random() * (bpmHigh - bpmLow));

    const instruments = {
      lead: gc.lead_instrument,
      pad: gc.instruments[1] ?? 'synth_pad',
      bass: gc.instruments[2] ?? 'bass'
    };

    const config: CompositionRequest = {
      genre, key, bpm,
      numBars: 16,
      instrument: instruments.lead,
      temperature: gc.temperature,
      addEffects: true,
    };

    const result = this.compose(config);

    return { config, ...result, instruments };
  }

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
}
