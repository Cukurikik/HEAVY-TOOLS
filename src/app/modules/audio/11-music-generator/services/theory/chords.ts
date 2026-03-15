/**
 * Comprehensive Chord Library — All chord types for every genre.
 */

export class ChordLibrary {
  static readonly CHORD_TYPES: Record<string, number[]> = {
    // ── Triads ────────────────────────────────────
    'major':        [0, 4, 7],
    'minor':        [0, 3, 7],
    'diminished':   [0, 3, 6],
    'augmented':    [0, 4, 8],
    'sus2':         [0, 2, 7],
    'sus4':         [0, 5, 7],
    'power':        [0, 7],

    // ── Seventh Chords ────────────────────────────
    'maj7':         [0, 4, 7, 11],
    'min7':         [0, 3, 7, 10],
    'dom7':         [0, 4, 7, 10],
    'dim7':         [0, 3, 6, 9],
    'half_dim7':    [0, 3, 6, 10],
    'min_maj7':     [0, 3, 7, 11],
    'aug7':         [0, 4, 8, 10],
    'aug_maj7':     [0, 4, 8, 11],
    'dom7sus4':     [0, 5, 7, 10],
    'dom7sus2':     [0, 2, 7, 10],

    // ── Extended Chords ───────────────────────────
    'maj9':         [0, 4, 7, 11, 14],
    'min9':         [0, 3, 7, 10, 14],
    'dom9':         [0, 4, 7, 10, 14],
    'maj11':        [0, 4, 7, 11, 14, 17],
    'min11':        [0, 3, 7, 10, 14, 17],
    'dom11':        [0, 4, 7, 10, 14, 17],
    'maj13':        [0, 4, 7, 11, 14, 17, 21],
    'min13':        [0, 3, 7, 10, 14, 17, 21],
    'dom13':        [0, 4, 7, 10, 14, 17, 21],

    // ── Altered / Jazz ────────────────────────────
    'dom7b9':       [0, 4, 7, 10, 13],
    'dom7sharp9':   [0, 4, 7, 10, 15],
    'dom7b5':       [0, 4, 6, 10],
    'dom7sharp5':   [0, 4, 8, 10],
    'dom7b9b5':     [0, 4, 6, 10, 13],
    'dom7sharp9b5': [0, 4, 6, 10, 15],

    // ── Added Tone ────────────────────────────────
    'add9':         [0, 4, 7, 14],
    'min_add9':     [0, 3, 7, 14],
    'add11':        [0, 4, 7, 17],
    '6':            [0, 4, 7, 9],
    'min6':         [0, 3, 7, 9],
    '6_9':          [0, 4, 7, 9, 14],
  };

  // Roman numeral to scale degree mapping (0-indexed semitones)
  static readonly ROMAN_NUMERALS: Record<string, [number, string]> = {
    'I':    [0, 'major'],
    'ii':   [2, 'minor'],
    'iii':  [4, 'minor'],
    'IV':   [5, 'major'],
    'V':    [7, 'major'],
    'vi':   [9, 'minor'],
    'vii':  [11, 'diminished'],
    'i':    [0, 'minor'],
    'II':   [2, 'major'],
    'III':  [3, 'major'],
    'iv':   [5, 'minor'],
    'v':    [7, 'minor'],
    'VI':   [8, 'major'],
    'VII':  [10, 'major'],
    'bII':  [1, 'major'],
    'bIII': [3, 'major'],
    'bVI':  [8, 'major'],
    'bVII': [10, 'major'],
    '#IV':  [6, 'major'],
  };

  /** Get MIDI notes for a chord. */
  static getChordNotes(root: number, chordType: string, octave = 4): number[] {
    const intervals = this.CHORD_TYPES[chordType] || this.CHORD_TYPES['major'];
    const base = root < 12 ? root + (octave * 12) : root;
    return intervals.map(i => base + i).filter(n => n >= 0 && n <= 127);
  }

  /** Get chord notes from Roman numeral in a key. */
  static getChordFromRoman(roman: string, keyRoot: number, octave = 4): number[] {
    const tuple = this.ROMAN_NUMERALS[roman];
    if (tuple) {
      const [degree, quality] = tuple;
      const chordRoot = keyRoot + degree;
      return this.getChordNotes(chordRoot % 12, quality, octave);
    }
    return this.getChordNotes(keyRoot, 'major', octave);
  }
}
