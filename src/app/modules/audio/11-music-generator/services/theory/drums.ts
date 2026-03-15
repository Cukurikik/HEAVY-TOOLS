import { NoteEvent } from '../genres/genre-engine';

/**
 * Drum Pattern Library — 17 unique genre-specific drum patterns.
 * Defines kick, snare, and hihat rhythms.
 */
export class DrumLibrary {
  // MIDI standard drum notes
  static readonly KICK = 36;
  static readonly SNARE = 38;
  static readonly HIHAT = 42;
  static readonly OPEN_HIHAT = 46;
  static readonly CLAP = 39;

  // Patterns per genre. Arrays of [beat_offset, velocity].
  static readonly PATTERNS: Record<string, Record<string, [number, number][]>> = {
    'pop': {
      'kick': [[0, 100], [2, 100], [2.5, 70]], 
      'snare': [[1, 90], [3, 90]], 
      'hihat': [[0, 70], [0.5, 50], [1, 70], [1.5, 50], [2, 70], [2.5, 50], [3, 70], [3.5, 50]]
    },
    'rock': {
      'kick': [[0, 110], [1.5, 90], [2, 110]], 
      'snare': [[1, 100], [3, 100]], 
      'hihat': [[0, 80], [0.5, 60], [1, 80], [1.5, 60], [2, 80], [2.5, 60], [3, 80], [3.5, 60]]
    },
    'electronic': { // 4 on the floor
      'kick': [[0, 110], [1, 110], [2, 110], [3, 110]], 
      'snare': [[1, 95], [3, 95]], 
      'hihat': [[0.5, 80], [1.5, 80], [2.5, 80], [3.5, 80]] // Offbeat
    },
    'hiphop': {
      'kick': [[0, 110], [1.5, 90], [2.5, 100]], 
      'snare': [[1, 100], [3, 100]], 
      'hihat': [[0, 70], [0.5, 60], [1, 70], [1.5, 60], [2, 70], [2.5, 60], [3, 70], [3.5, 60]]
    },
    'trap': { // Half time, frantic hats
      'kick': [[0, 120], [2.5, 100]], 
      'snare': [[2, 110]], 
      'hihat': [[0,70],[0.25,60],[0.5,70],[0.75,60],[1,70],[1.25,60],[1.5,70],[1.75,60],[2,70],[2.25,60],[2.5,70],[2.75,60],[3,70],[3.25,60],[3.5,70],[3.75,60]]
    },
    'rnb': {
      'kick': [[0, 90], [1.5, 70], [2, 90]], 
      'snare': [[1, 80], [3, 80]], 
      'hihat': [[0, 60], [1, 60], [2, 60], [3, 60]] // Sparse
    },
    'jazz': { // Swing patterns (handled by swing engine, but basic placement here)
      'kick': [[0, 60], [2, 60]], 
      'snare': [[1, 50], [3, 50], [3.66, 40]], 
      'hihat': [[1, 70], [2, 70], [2.66, 50], [3, 70], [3.66, 50]] // Ride replacement
    },
    'funk': {
      'kick': [[0, 100], [0.75, 80], [2, 100]], 
      'snare': [[1, 90], [3, 90], [3.75, 70]], // Ghost notes
      'hihat': [[0, 70], [0.25, 50], [0.5, 70], [0.75, 50], [1, 70], [1.25, 50], [1.5, 70], [1.75, 50], [2, 70], [2.25, 50], [2.5, 70], [2.75, 50], [3, 70], [3.25, 50], [3.5, 70], [3.75, 50]]
    },
    'metal': { // Double kick
      'kick': [[0,110],[0.25,90],[0.5,110],[0.75,90],[1,110],[1.25,90],[1.5,110],[1.75,90],[2,110],[2.25,90],[2.5,110],[2.75,90],[3,110],[3.25,90],[3.5,110],[3.75,90]], 
      'snare': [[1, 110], [3, 110]], 
      'hihat': [[0, 80], [1, 80], [2, 80], [3, 80]] // Crash/Ride heavy usually
    },
    'reggae': { // One drop
      'kick': [[2, 100]], 
      'snare': [[2, 100] /* cross-stick */], 
      'hihat': [[0, 70], [0.5, 50], [1, 70], [1.5, 50], [2, 70], [2.5, 50], [3, 70], [3.5, 50]]
    },
    'latin': { // Clave/Cascara
      'kick': [[0, 90], [1.5, 90], [2.5, 90]], 
      'snare': [[1, 80], [2, 80], [3.5, 80]], 
      'hihat': [[0,70],[0.5,70],[1,70],[1.5,70],[2,70],[2.5,70],[3,70],[3.5,70]]
    },
    'bossa_nova': {
      'kick': [[0, 80], [0.5, 60], [2, 80], [2.5, 60]], 
      'snare': [[0, 80], [1.5, 80], [2.5, 80]], // Rimshot clave
      'hihat': [[0,50],[0.5,50],[1,50],[1.5,50],[2,50],[2.5,50],[3,50],[3.5,50]]
    },
    'disco': { // 4 on floor + 16th hats
      'kick': [[0, 110], [1, 110], [2, 110], [3, 110]], 
      'snare': [[1, 95], [3, 95]], 
      'hihat': [[0,70],[0.25,50],[0.5,80] /* open */,[0.75,50],[1,70],[1.25,50],[1.5,80],[1.75,50],[2,70],[2.25,50],[2.5,80],[2.75,50],[3,70],[3.25,50],[3.5,80],[3.75,50]]
    },
    'dnb': { // 170 BPM breakbeat
      'kick': [[0, 110], [1.5, 100]], 
      'snare': [[1, 100], [3, 100], [2.75, 80]], 
      'hihat': [[0,70],[0.5,70],[1,70],[1.5,70],[2,70],[2.5,70],[3,70],[3.5,70]]
    },
    'dubstep': { // Half time heavy
      'kick': [[0, 120], [2.5, 120]], 
      'snare': [[2, 120]], 
      'hihat': [[0,70],[0.5,70],[1,70],[1.5,70],[2,70],[2.5,70],[3,70],[3.5,70]]
    },
    'lofi': { // Sparse, dusty
      'kick': [[0, 80], [2.5, 60]], 
      'snare': [[1, 80], [3, 80]], 
      'hihat': [[0,60],[0.5,40],[1,60],[1.5,40],[2,60],[2.5,40],[3,60],[3.5,40]]
    },
    'waltz': { // 3/4
      'kick': [[0, 90]], 
      'snare': [[1, 70], [2, 70]], 
      'hihat': [[0,50],[1,60],[2,60]]
    }
  };

  /** Generate drum sequence for a number of bars */
  static generate(genre: string, numBars: number, beatsPerBar: number, swing: number): NoteEvent[] {
    const events: NoteEvent[] = [];
    const patternGroup = this.PATTERNS[genre] || this.PATTERNS['pop'];

    for (let bar = 0; bar < numBars; bar++) {
      const barStart = bar * beatsPerBar;
      
      // Kicks
      for (const [offset, vel] of patternGroup['kick'] || []) {
        if (offset < beatsPerBar) {
          const isOffbeat = (offset * 10) % 10 !== 0; // if it's not a whole number beat
          events.push({ note: this.KICK, velocity: vel, durationBeats: 0.25, startBeat: barStart + offset + (isOffbeat ? swing : 0), layer: 'drums' });
        }
      }

      // Snares
      for (const [offset, vel] of patternGroup['snare'] || []) {
         if (offset < beatsPerBar) {
          const isOffbeat = (offset * 10) % 10 !== 0; 
          events.push({ note: this.SNARE, velocity: vel + Math.random()*10 - 5, durationBeats: 0.25, startBeat: barStart + offset + (isOffbeat ? swing : 0), layer: 'drums' });
        }
      }

      // Hihats
      for (const [offset, vel] of patternGroup['hihat'] || []) {
        if (offset < beatsPerBar) {
          const isOffbeat = (offset * 10) % 10 !== 0; 
          events.push({ note: this.HIHAT, velocity: vel + Math.random()*15 - 7, durationBeats: 0.125, startBeat: barStart + offset + (isOffbeat ? swing : 0), layer: 'drums' });
        }
      }
    }

    return events;
  }
}
