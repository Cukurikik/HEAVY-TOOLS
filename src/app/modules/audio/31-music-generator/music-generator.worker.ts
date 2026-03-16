/// <reference lib="webworker" />

// Simple procedurally generated music synthesis to mimic an AI generator
// Since we can't run a full transformer locally in browser efficiently,
// this generates a multi-track composition procedurally based on the prompt's seed.

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate an AudioBuffer
function synthesizeMusic(prompt: string, durationSec: number, genre: string, onProgress: (p: number) => void): Uint8Array {
  const sampleRate = 44100;
  const numChannels = 2;
  const totalSamples = sampleRate * durationSec;
  const outBuf = new Float32Array(totalSamples * numChannels);

  let seed = hashString(prompt + genre);

  // Basic constraints based on genre
  let tempo = 120; // BPM
  let scale = [0, 2, 4, 5, 7, 9, 11]; // Major
  if (genre === 'lofi' || prompt.toLowerCase().includes('lofi') || prompt.toLowerCase().includes('chill')) {
    tempo = 80 + seededRandom(seed++) * 20;
    scale = [0, 2, 3, 5, 7, 8, 10]; // Minor
  } else if (genre === 'electronic' || prompt.toLowerCase().includes('techno') || prompt.toLowerCase().includes('edm')) {
    tempo = 125 + seededRandom(seed++) * 15;
    scale = [0, 2, 3, 5, 7, 8, 10]; // Minor
  } else if (genre === 'ambient' || prompt.toLowerCase().includes('ambient') || prompt.toLowerCase().includes('drone')) {
    tempo = 60 + seededRandom(seed++) * 30;
    scale = [0, 2, 4, 7, 9]; // Pentatonic Major
  } else if (genre === 'rock' || prompt.toLowerCase().includes('metal')) {
      tempo = 110 + seededRandom(seed++) * 60;
      scale = [0, 3, 5, 6, 7, 10]; // Blues scale
  }

  const secondsPerBeat = 60.0 / tempo;
  const samplesPerBeat = Math.floor(secondsPerBeat * sampleRate);

  // Generate tracks
  const numTracks = 4; // Kick, Bass, Chords, Melody

  for (let trackIdx = 0; trackIdx < numTracks; trackIdx++) {
    // Generate track notes
    const notes = [];
    const numBeats = Math.floor(durationSec / secondsPerBeat);

    // Seed track generation
    let trackSeed = seed + trackIdx * 1234;

    for(let b=0; b < numBeats; b++) {
      if (trackIdx === 0) { // Kick/Drums
        // 4 on the floor usually for electronic
        if (genre === 'electronic' || b % 2 === 0 || seededRandom(trackSeed++) > 0.7) {
            notes.push({ start: b * samplesPerBeat, dur: sampleRate * 0.1, freq: 50, type: 'kick', amp: 0.8 });
        }
      } else if (trackIdx === 1) { // Bass
         if (b % 4 === 0 || seededRandom(trackSeed++) > 0.5) {
             const rootNoteIdx = Math.floor(seededRandom(trackSeed++) * scale.length);
             const freq = 55 * Math.pow(1.059463, scale[rootNoteIdx]);
             notes.push({ start: b * samplesPerBeat, dur: samplesPerBeat, freq: freq, type: 'bass', amp: 0.6 });
         }
      } else if (trackIdx === 2) { // Chords
         if (b % 4 === 0 || (b % 2 === 0 && seededRandom(trackSeed++) > 0.5)) {
             const rootNoteIdx = Math.floor(seededRandom(trackSeed++) * scale.length);
             const freq = 110 * Math.pow(1.059463, scale[rootNoteIdx]);
             notes.push({ start: b * samplesPerBeat, dur: samplesPerBeat * 2, freq: freq, type: 'chord', amp: 0.3 });
         }
      } else if (trackIdx === 3) { // Melody
         if (seededRandom(trackSeed++) > 0.3) {
             const rootNoteIdx = Math.floor(seededRandom(trackSeed++) * scale.length);
             const octave = Math.floor(seededRandom(trackSeed++) * 2) + 1; // higher octaves
             const freq = 220 * Math.pow(1.059463, scale[rootNoteIdx] + (octave*12));
             notes.push({ start: b * samplesPerBeat, dur: samplesPerBeat / 2, freq: freq, type: 'melody', amp: 0.4 });
         }
      }
    }

    // Render track
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        for (let s = 0; s < note.dur; s++) {
            const sampleIdx = note.start + s;
            if (sampleIdx >= totalSamples) break;

            let val = 0;
            let env = 1.0;
            const t = s / sampleRate;

            if (note.type === 'kick') {
                const pitchEnv = Math.exp(-t * 20);
                env = Math.exp(-t * 10);
                val = Math.sin(2 * Math.PI * (note.freq * pitchEnv) * t);
            } else if (note.type === 'bass') {
                env = Math.exp(-t * 2);
                val = Math.sin(2 * Math.PI * note.freq * t);
                // add some saw for bass
                val += (2 * (t * note.freq - Math.floor(t * note.freq + 0.5))) * 0.5;
                val *= 0.5;
            } else if (note.type === 'chord') {
                // simple pad
                env = Math.sin(Math.PI * (s/note.dur));
                val = Math.sin(2 * Math.PI * note.freq * t) * 0.5 + Math.sin(2 * Math.PI * note.freq * 1.5 * t) * 0.25;
            } else if (note.type === 'melody') {
                env = t < 0.05 ? t / 0.05 : Math.exp(-(t-0.05) * 5); // Attack/decay
                val = Math.sin(2 * Math.PI * note.freq * t);
                // add some FM
                val *= Math.sin(2 * Math.PI * (note.freq * 2) * t);
            }

            const outVal = val * env * note.amp;

            // Pan based on track
            let panL = 0.5; let panR = 0.5;
            if (trackIdx === 2) { panL = 0.3; panR = 0.7; }
            if (trackIdx === 3) { panL = 0.6; panR = 0.4; }

            outBuf[sampleIdx * 2] += outVal * panL;
            outBuf[sampleIdx * 2 + 1] += outVal * panR;
        }

        // report progress every 10 notes to keep worker responsive
        if (i % 10 === 0) {
            const overallProg = 5 + ((trackIdx / numTracks) * 80) + ((i / notes.length) * (80/numTracks));
            onProgress(overallProg);
        }
    }
  }

  onProgress(85);

  // Soft Clip / Limiter
  for (let i = 0; i < outBuf.length; i++) {
      outBuf[i] = Math.tanh(outBuf[i]);
  }

  onProgress(90);

  // Encode to WAV
  const outWav = new ArrayBuffer(44 + outBuf.length * 2);
  const view = new DataView(outWav);
  const writeStr = (o: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(o + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + outBuf.length * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * 2, true); // byte rate
  view.setUint16(32, numChannels * 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, outBuf.length * 2, true);

  let offset = 44;
  for (const bufValue of outBuf) {
      const s = Math.max(-1, Math.min(1, bufValue));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
  }

  onProgress(99);

  return new Uint8Array(outWav);
}

addEventListener('message', async (e: MessageEvent) => {
  const { prompt, duration, genre } = e.data.config;

  try {
    postMessage({ type: 'progress', value: 10 });

    // Slight artificial delay to simulate AI thinking time
    await new Promise(r => setTimeout(r, 1000));

    const wavData = synthesizeMusic(prompt, duration, genre, (p) => {
        postMessage({ type: 'progress', value: Math.round(p) });
    });

    postMessage({ type: 'progress', value: 100 });

    const blob = new Blob([wavData.buffer as ArrayBuffer], { type: 'audio/wav' });
    postMessage({ type: 'complete', data: blob });

  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'GENERATION_FAILED', message: String(err) });
  }
});