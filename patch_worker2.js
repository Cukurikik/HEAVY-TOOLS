const fs = require('fs');

const code = `/// <reference lib="webworker" />

function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

async function loadSample(url: string): Promise<Float32Array> {
    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();

        // Very basic WAV parser (assumes 44100 16-bit Mono, which we generated)
        const view = new DataView(buffer);
        // Find data chunk
        let offset = 12;
        while (offset < view.byteLength) {
            const chunkId = String.fromCharCode(view.getUint8(offset), view.getUint8(offset+1), view.getUint8(offset+2), view.getUint8(offset+3));
            const chunkSize = view.getUint32(offset + 4, true);
            if (chunkId === 'data') {
                const dataOffset = offset + 8;
                const numSamples = chunkSize / 2;
                const samples = new Float32Array(numSamples);
                for (let i=0; i<numSamples; i++) {
                    const int16 = view.getInt16(dataOffset + i*2, true);
                    samples[i] = int16 / 32768.0;
                }
                return samples;
            }
            offset += 8 + chunkSize;
        }
    } catch(e) {
        console.error("Failed to load sample", url, e);
    }
    return new Float32Array(0);
}

async function synthesizeMusic(prompt: string, durationSec: number, genre: string, onProgress: (p: number) => void): Promise<Uint8Array> {
  const sampleRate = 44100;
  const numChannels = 2;
  const totalSamples = sampleRate * durationSec;
  const outBuf = new Float32Array(totalSamples * numChannels);

  let seed = hashString(prompt + genre);

  onProgress(15);

  // Load sample packs
  const baseUrl = location.origin.includes('localhost') || location.origin.includes('0.0.0.0') ? location.origin : '';
  const [kickBuf, snareBuf, hihatBuf, bassBuf, chordBuf] = await Promise.all([
      loadSample(baseUrl + '/samples/drums/kick.wav'),
      loadSample(baseUrl + '/samples/drums/snare.wav'),
      loadSample(baseUrl + '/samples/drums/hihat.wav'),
      loadSample(baseUrl + '/samples/bass/bass.wav'),
      loadSample(baseUrl + '/samples/synths/chord.wav')
  ]);

  onProgress(30);

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
    const notes = [];
    const numBeats = Math.floor(durationSec / secondsPerBeat);
    let trackSeed = seed + trackIdx * 1234;

    for(let b=0; b < numBeats; b++) {
      if (trackIdx === 0) { // Drums
        if (genre === 'electronic' || b % 2 === 0 || seededRandom(trackSeed++) > 0.7) {
            notes.push({ start: b * samplesPerBeat, buf: kickBuf, type: 'kick', amp: 0.8, rate: 1.0 });
        }
        if (b % 2 !== 0 && seededRandom(trackSeed++) > 0.3) {
            notes.push({ start: b * samplesPerBeat, buf: snareBuf, type: 'snare', amp: 0.7, rate: 1.0 });
        }
        if (seededRandom(trackSeed++) > 0.4) {
            notes.push({ start: Math.floor((b + 0.5) * samplesPerBeat), buf: hihatBuf, type: 'hihat', amp: 0.5, rate: 1.0 });
        }
      } else if (trackIdx === 1) { // Bass
         if (b % 4 === 0 || seededRandom(trackSeed++) > 0.5) {
             notes.push({ start: b * samplesPerBeat, buf: bassBuf, type: 'bass', amp: 0.8, rate: 1.0 });
         }
      } else if (trackIdx === 2) { // Chords
         if (b % 4 === 0 || (b % 2 === 0 && seededRandom(trackSeed++) > 0.5)) {
             notes.push({ start: b * samplesPerBeat, buf: chordBuf, type: 'chord', amp: 0.5, rate: 1.0 });
         }
      } else if (trackIdx === 3) { // Melody (reusing synth/chord pitched via scale)
         if (seededRandom(trackSeed++) > 0.5) {
             const noteIdx = Math.floor(seededRandom(trackSeed++) * scale.length);
             const semitones = scale[noteIdx] + 12; // One octave up
             const rate = Math.pow(2, semitones / 12);
             notes.push({ start: b * samplesPerBeat, buf: chordBuf, type: 'melody', amp: 0.6, rate });
         }
      }
    }

    // Render track
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        if (!note.buf || note.buf.length === 0) continue;

        const rate = note.rate || 1.0;
        const durationSamples = Math.floor(note.buf.length / rate);

        for (let s = 0; s < durationSamples; s++) {
            const sampleIdx = note.start + s;
            if (sampleIdx >= totalSamples) break;

            // Linear interpolation for pitch shifting
            const pos = s * rate;
            const i1 = Math.floor(pos);
            const i2 = i1 + 1;
            const frac = pos - i1;

            if (i1 >= note.buf.length) break;

            let val = note.buf[i1];
            if (i2 < note.buf.length) {
                val = val * (1 - frac) + note.buf[i2] * frac;
            }
            val *= note.amp;

            // Pan based on track
            let panL = 0.5; let panR = 0.5;
            if (trackIdx === 2) { panL = 0.3; panR = 0.7; }
            if (trackIdx === 3) { panL = 0.6; panR = 0.4; }

            outBuf[sampleIdx * 2] += val * panL;
            outBuf[sampleIdx * 2 + 1] += val * panR;
        }

        if (i % 20 === 0) {
            const overallProg = 30 + ((trackIdx / numTracks) * 50) + ((i / notes.length) * (50/numTracks));
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

    const wavData = await synthesizeMusic(prompt, duration, genre, (p) => {
        postMessage({ type: 'progress', value: Math.round(p) });
    });

    postMessage({ type: 'progress', value: 100 });

    const blob = new Blob([wavData.buffer as ArrayBuffer], { type: 'audio/wav' });
    postMessage({ type: 'complete', data: blob });

  } catch (err: unknown) {
    postMessage({ type: 'error', errorCode: 'GENERATION_FAILED', message: String(err) });
  }
});
`;

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.worker.ts', code);
