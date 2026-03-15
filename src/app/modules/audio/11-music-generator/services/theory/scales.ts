/**
 * Comprehensive Scale Library — Every scale used across all 25+ genres.
 */

export class ScaleLibrary {
  static readonly SCALES: Record<string, number[]> = {
    // ── Western Diatonic ──────────────────────────
    'major':                [0, 2, 4, 5, 7, 9, 11],
    'natural_minor':        [0, 2, 3, 5, 7, 8, 10],
    'harmonic_minor':       [0, 2, 3, 5, 7, 8, 11],
    'melodic_minor':        [0, 2, 3, 5, 7, 9, 11],

    // ── Modes ─────────────────────────────────────
    'dorian':               [0, 2, 3, 5, 7, 9, 10],
    'phrygian':             [0, 1, 3, 5, 7, 8, 10],
    'lydian':               [0, 2, 4, 6, 7, 9, 11],
    'mixolydian':           [0, 2, 4, 5, 7, 9, 10],
    'aeolian':              [0, 2, 3, 5, 7, 8, 10],
    'locrian':              [0, 1, 3, 5, 6, 8, 10],

    // ── Pentatonic ────────────────────────────────
    'pentatonic_major':     [0, 2, 4, 7, 9],
    'pentatonic_minor':     [0, 3, 5, 7, 10],

    // ── Blues ─────────────────────────────────────
    'blues':                [0, 3, 5, 6, 7, 10],
    'blues_major':          [0, 2, 3, 4, 7, 9],

    // ── Jazz ──────────────────────────────────────
    'bebop_dominant':       [0, 2, 4, 5, 7, 9, 10, 11],
    'bebop_major':          [0, 2, 4, 5, 7, 8, 9, 11],
    'altered':              [0, 1, 3, 4, 6, 8, 10],
    'whole_tone':           [0, 2, 4, 6, 8, 10],
    'diminished':           [0, 2, 3, 5, 6, 8, 9, 11],
    'half_whole_diminished':[0, 1, 3, 4, 6, 7, 9, 10],
    'lydian_dominant':      [0, 2, 4, 6, 7, 9, 10],

    // ── World / Ethnic ────────────────────────────
    'phrygian_dominant':    [0, 1, 4, 5, 7, 8, 10],
    'double_harmonic':      [0, 1, 4, 5, 7, 8, 11],
    'hungarian_minor':      [0, 2, 3, 6, 7, 8, 11],
    'arabic':               [0, 1, 4, 5, 7, 8, 11],
    'japanese':             [0, 1, 5, 7, 8],
    'hirajoshi':            [0, 2, 3, 7, 8],
    'chinese':              [0, 4, 6, 7, 11],
    'indian_raga':          [0, 1, 4, 5, 7, 8, 11],
    'balinese':             [0, 1, 3, 7, 8],
    'egyptian':             [0, 2, 5, 7, 10],
    'persian':              [0, 1, 4, 5, 6, 8, 11],

    // ── Experimental ──────────────────────────────
    'chromatic':            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    'tritone':              [0, 1, 4, 6, 7, 10],
    'prometheus':           [0, 2, 4, 6, 9, 10],
    'enigmatic':            [0, 1, 4, 6, 8, 10, 11],
    'augmented':            [0, 3, 4, 7, 8, 11],
  };

  /** Get scale intervals by name. */
  static getScale(name: string): number[] {
    return this.SCALES[name] || this.SCALES['major'];
  }

  /** Get all MIDI notes for a scale within a range. */
  static getAllNotes(root: number, scaleName: string, low = 0, high = 127): number[] {
    const intervals = this.getScale(scaleName);
    const notes = new Set<number>();
    const rootPitchClass = root % 12;

    for (let octave = 0; octave < 11; octave++) {
      for (const interval of intervals) {
        const note = rootPitchClass + (octave * 12) + interval;
        if (note >= low && note <= high) {
          notes.add(note);
        }
      }
    }
    return Array.from(notes).sort((a, b) => a - b);
  }

  /** Check if a MIDI note belongs to a scale. */
  static noteInScale(note: number, root: number, scaleName: string): boolean {
    const intervals = this.getScale(scaleName);
    const relative = (note % 12 - root % 12 + 12) % 12;
    return intervals.includes(relative);
  }

  /** Snap a note to the nearest note in a scale. */
  static snapToScale(note: number, root: number, scaleName: string): number {
    const intervals = this.getScale(scaleName);
    const pc = note % 12;
    const rootPc = root % 12;
    const relative = (pc - rootPc + 12) % 12;

    if (intervals.includes(relative)) return note;

    let bestDist = 999;
    let bestNote = note;

    for (const interval of intervals) {
      const dist = Math.min(Math.abs(relative - interval), 12 - Math.abs(relative - interval));
      if (dist < bestDist) {
        bestDist = dist;
        let candidate = note - relative + interval;
        if (candidate < 0) candidate += 12;
        if (candidate > 127) candidate -= 12;
        bestNote = candidate;
      }
    }
    return bestNote;
  }
}
