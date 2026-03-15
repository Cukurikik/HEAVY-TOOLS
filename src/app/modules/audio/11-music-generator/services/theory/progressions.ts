/**
 * Chord Progression Library — Genre-specific chord progressions.
 */

export class ProgressionLibrary {
  static readonly PROGRESSIONS: Record<string, string[][]> = {
    // ── Pop ───────────────────────────────────────
    'pop': [
        ['I', 'V', 'vi', 'IV'],
        ['I', 'IV', 'V', 'V'],
        ['vi', 'IV', 'I', 'V'],
        ['I', 'vi', 'IV', 'V'],
        ['I', 'IV', 'vi', 'V'],
        ['IV', 'I', 'V', 'vi'],
    ],

    // ── Rock ──────────────────────────────────────
    'rock': [
        ['I', 'IV', 'V', 'I'],
        ['I', 'bVII', 'IV', 'I'],
        ['I', 'V', 'bVII', 'IV'],
        ['I', 'IV', 'bVII', 'IV'],
        ['I', 'III', 'IV', 'I'],
    ],

    // ── Blues ─────────────────────────────────────
    'blues': [
        ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V'],
        ['I', 'IV', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'I'],
    ],

    // ── Jazz ──────────────────────────────────────
    'jazz': [
        ['ii', 'V', 'I', 'I'],
        ['ii', 'V', 'I', 'vi'],
        ['I', 'vi', 'ii', 'V'],
        ['iii', 'vi', 'ii', 'V'],
        ['I', 'IV', 'iii', 'vi', 'ii', 'V', 'I', 'I'],
    ],

    // ── Classical ─────────────────────────────────
    'classical': [
        ['I', 'IV', 'V', 'I'],
        ['I', 'vi', 'IV', 'V'],
        ['I', 'IV', 'I', 'V', 'I'],
        ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
    ],

    // ── Electronic / EDM ──────────────────────────
    'electronic': [
        ['i', 'III', 'VII', 'VI'],
        ['i', 'iv', 'VI', 'V'],
        ['i', 'VII', 'VI', 'VII'],
        ['i', 'i', 'iv', 'iv'],
    ],

    // ── Ambient ───────────────────────────────────
    'ambient': [
        ['I', 'III', 'IV', 'I'],
        ['I', 'V', 'IV', 'I'],
        ['I', 'I', 'IV', 'IV'],
        ['vi', 'IV', 'I', 'I'],
    ],

    // ── R&B / Soul ────────────────────────────────
    'rnb': [
        ['I', 'vi', 'IV', 'V'],
        ['ii', 'V', 'I', 'vi'],
        ['I', 'iii', 'vi', 'IV'],
        ['vi', 'ii', 'V', 'I'],
    ],

    // ── Hip Hop ───────────────────────────────────
    'hiphop': [
        ['i', 'iv', 'i', 'iv'],
        ['i', 'VII', 'VI', 'VII'],
        ['i', 'iv', 'VII', 'III'],
        ['i', 'i', 'iv', 'V'],
    ],

    // ── Country ───────────────────────────────────
    'country': [
        ['I', 'IV', 'V', 'I'],
        ['I', 'V', 'I', 'IV', 'V', 'I'],
        ['I', 'IV', 'I', 'V'],
    ],

    // ── Reggae ────────────────────────────────────
    'reggae': [
        ['I', 'IV', 'V', 'I'],
        ['I', 'V', 'vi', 'IV'],
        ['I', 'IV', 'I', 'V'],
    ],

    // ── Latin / Bossa Nova ────────────────────────
    'latin': [
        ['I', 'vi', 'ii', 'V'],
        ['I', 'IV', 'ii', 'V'],
        ['i', 'iv', 'V', 'i'],
    ],

    // ── Metal ─────────────────────────────────────
    'metal': [
        ['i', 'bII', 'v', 'i'],
        ['i', 'bVI', 'bIII', 'bVII'],
        ['i', 'iv', 'bVI', 'v'],
        ['i', 'bII', 'bVII', 'i'],
    ],

    // ── Funk ──────────────────────────────────────
    'funk': [
        ['I', 'IV', 'I', 'IV'],
        ['I', 'I', 'IV', 'I'],
        ['i', 'iv', 'i', 'iv'],
    ],

    // ── Gospel ────────────────────────────────────
    'gospel': [
        ['I', 'IV', 'V', 'I'],
        ['I', 'vi', 'ii', 'V'],
        ['I', 'iii', 'IV', 'V'],
    ],

    // ── Celtic / Folk ─────────────────────────────
    'celtic': [
        ['I', 'V', 'vi', 'IV'],
        ['I', 'IV', 'V', 'I'],
        ['i', 'VII', 'VI', 'VII'],
    ],

    // ── Middle Eastern ────────────────────────────
    'middle_eastern': [
        ['i', 'bII', 'i', 'bII'],
        ['i', 'iv', 'V', 'i'],
        ['i', 'bII', 'v', 'i'],
    ],

    // ── Cinematic / Epic ──────────────────────────
    'cinematic': [
        ['I', 'III', 'IV', 'iv'],
        ['vi', 'IV', 'I', 'V'],
        ['I', 'bVI', 'bIII', 'bVII'],
        ['i', 'VI', 'III', 'VII'],
    ],

    // ── Lo-Fi ─────────────────────────────────────
    'lofi': [
        ['ii', 'V', 'I', 'vi'],
        ['I', 'vi', 'ii', 'V'],
        ['iii', 'vi', 'ii', 'V'],
    ],

    // ── Trap ──────────────────────────────────────
    'trap': [
        ['i', 'i', 'iv', 'iv'],
        ['i', 'VII', 'VI', 'V'],
        ['i', 'iv', 'VII', 'VI'],
    ],

    // ── Synthwave / Retrowave ─────────────────────
    'synthwave': [
        ['I', 'V', 'vi', 'IV'],
        ['I', 'III', 'vi', 'IV'],
        ['vi', 'IV', 'I', 'V'],
    ],

    // ── Disco ─────────────────────────────────────
    'disco': [
        ['I', 'IV', 'V', 'I'],
        ['vi', 'ii', 'V', 'I'],
        ['I', 'V', 'vi', 'IV'],
    ],

    // ── Bossa Nova ────────────────────────────────
    'bossa_nova': [
        ['I', 'ii', 'iii', 'vi', 'ii', 'V', 'I', 'I'],
        ['I', 'vi', 'ii', 'V'],
    ],

    // ── Waltz ─────────────────────────────────────
    'waltz': [
        ['I', 'IV', 'V', 'I'],
        ['I', 'V', 'I', 'IV'],
    ],

    // ── Flamenco ──────────────────────────────────
    'flamenco': [
        ['i', 'bII', 'bIII', 'bII'],
        ['i', 'bVII', 'bVI', 'V'],
    ],

    // ── Drum and Bass ─────────────────────────────
    'dnb': [
        ['i', 'iv', 'VII', 'III'],
        ['i', 'VII', 'VI', 'VII'],
    ],

    // ── Dubstep ───────────────────────────────────
    'dubstep': [
        ['i', 'iv', 'i', 'iv'],
        ['i', 'bVI', 'bVII', 'i'],
    ],
  };

  /** Get a random chord progression for a genre. */
  static getProgression(genre: string): string[] {
    const progs = this.PROGRESSIONS[genre] || this.PROGRESSIONS['pop'];
    return progs[Math.floor(Math.random() * progs.length)];
  }
}
