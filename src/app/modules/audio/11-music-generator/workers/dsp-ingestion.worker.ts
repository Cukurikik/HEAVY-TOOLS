/**
 * DSP INGESTION WORKER
 * 
 * This Web Worker performs heavy offline DSP math on raw audio samples:
 *   1. Transient Onset Detection (spectral flux analysis)
 *   2. Zero-Crossing Safe Slicing (no pop/click artifacts)
 *   3. High-Pass Filter simulation (cut < 150Hz for vocals)
 *   4. Peak Normalization (target -0.1 dB)
 *   5. FFT-based Chromagram Pitch Detection (detect dominant Key: C, C#, D, etc.)
 *   6. BPM Detection via Autocorrelation
 * 
 * All math runs inside a Worker thread so the UI never freezes.
 * Porting concepts from Librosa (Python) to pure JavaScript.
 */

// --- CONSTANTS ---
const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MIN_SLICE_MS = 200;  // Minimum slice duration in ms (as per Kapten's spec)

// --- MESSAGE HANDLER ---
addEventListener('message', async ({ data }) => {
  switch (data.command) {
    case 'PROCESS_SAMPLE':
      await processSample(data.payload);
      break;
    case 'ANALYZE_ONLY':
      await analyzeSample(data.payload);
      break;
  }
});

// ============================================================
// MAIN PROCESSING PIPELINE
// ============================================================

interface ProcessPayload {
  id: string;
  audioData: ArrayBuffer;
  sampleRate: number;
  channels: number;
  category: string;
  style: string;
  source: string;
  originalFile: string;
  applyHpf: boolean;       // Apply High-Pass Filter (150Hz) for vocals
  sliceByTransients: boolean; // Auto-slice by transient detection
}

async function processSample(payload: ProcessPayload) {
  try {
    const pcmData = decodeRawPcm(payload.audioData, payload.channels);
    const sr = payload.sampleRate;

    postProgress(payload.id, 10, 'Analyzing audio spectrum...');

    // 1. Detect BPM
    const bpm = detectBpm(pcmData, sr);
    postProgress(payload.id, 25, `BPM detected: ${bpm}`);

    // 2. Detect Pitch/Key via Chromagram
    const key = detectKey(pcmData, sr);
    postProgress(payload.id, 40, `Key detected: ${key}`);

    // 3. Optional: High-Pass Filter (150Hz cutoff for vocals)
    let processedPcm = pcmData;
    if (payload.applyHpf) {
      processedPcm = applyHighPassFilter(processedPcm, sr, 150);
      postProgress(payload.id, 55, 'High-Pass Filter applied (150Hz cutoff)');
    }

    // 4. Peak Normalization to -0.1 dB
    processedPcm = normalizePeak(processedPcm, -0.1);
    postProgress(payload.id, 65, 'Normalized to -0.1 dB peak');

    // 5. Determine peak dB
    const peakDb = getPeakDb(processedPcm);

    // 6. Auto-Slice by Transients OR keep as one chunk
    let slices: Float32Array[];
    if (payload.sliceByTransients) {
      slices = sliceByTransients(processedPcm, sr);
      postProgress(payload.id, 80, `Sliced into ${slices.length} chunks at transient points`);
    } else {
      slices = [processedPcm];
    }

    // 7. Emit results back to main thread
    const results = slices.map((slice, i) => ({
      chunkIndex: i,
      audioBuffer: slice.buffer,
      metadata: {
        id: slices.length > 1 ? `${payload.id}_chunk_${i}` : payload.id,
        originalFile: payload.originalFile,
        category: payload.category,
        detectedKey: key,
        detectedBpm: bpm,
        durationMs: Math.round((slice.length / sr) * 1000),
        sampleRate: sr,
        channels: 1, // We work in mono internally
        style: payload.style,
        source: payload.source,
        peakDb: peakDb,
        createdAt: Date.now()
      }
    }));

    postMessage({
      type: 'PROCESS_COMPLETE',
      payload: {
        id: payload.id,
        chunks: results
      }
    }, results.map(r => r.audioBuffer) as unknown as Transferable[]);

  } catch (error) {
    postMessage({
      type: 'PROCESS_ERROR',
      payload: { id: payload.id, error: String(error) }
    });
  }
}

async function analyzeSample(payload: { id: string; audioData: ArrayBuffer; sampleRate: number; channels: number }) {
  try {
    const pcmData = decodeRawPcm(payload.audioData, payload.channels);
    const bpm = detectBpm(pcmData, payload.sampleRate);
    const key = detectKey(pcmData, payload.sampleRate);
    const peakDb = getPeakDb(pcmData);

    postMessage({
      type: 'ANALYZE_COMPLETE',
      payload: { id: payload.id, bpm, key, peakDb, durationMs: Math.round((pcmData.length / payload.sampleRate) * 1000) }
    });
  } catch (error) {
    postMessage({
      type: 'ANALYZE_ERROR',
      payload: { id: payload.id, error: String(error) }
    });
  }
}

// ============================================================
// DSP ALGORITHMS (Ported from Librosa/Python concepts)
// ============================================================

/**
 * Decode raw PCM from an AudioBuffer-like ArrayBuffer.
 * Downmix to mono if stereo.
 */
function decodeRawPcm(buffer: ArrayBuffer, channels: number): Float32Array {
  const view = new DataView(buffer);
  const sampleCount = buffer.byteLength / (channels * 2); // Assuming 16-bit PCM
  const mono = new Float32Array(sampleCount);

  for (let i = 0; i < sampleCount; i++) {
    let sum = 0;
    for (let ch = 0; ch < channels; ch++) {
      const byteOffset = (i * channels + ch) * 2;
      if (byteOffset + 1 < buffer.byteLength) {
        sum += view.getInt16(byteOffset, true) / 32768.0;
      }
    }
    mono[i] = sum / channels;
  }
  return mono;
}

/**
 * BPM DETECTION via Autocorrelation
 * Finds the periodicity in the energy envelope of the signal.
 */
function detectBpm(pcm: Float32Array, sr: number): number {
  // 1. Compute energy envelope (RMS in small windows)
  const hopSize = Math.floor(sr * 0.01); // 10ms hops
  const frameCount = Math.floor(pcm.length / hopSize);
  const envelope = new Float32Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    let sum = 0;
    const start = i * hopSize;
    const end = Math.min(start + hopSize, pcm.length);
    for (let j = start; j < end; j++) {
      sum += pcm[j] * pcm[j];
    }
    envelope[i] = Math.sqrt(sum / (end - start));
  }

  // 2. Autocorrelation of the envelope
  // Search for BPM range 60-200
  const minLag = Math.floor((60 / 200) * (sr / hopSize)); // 200 BPM
  const maxLag = Math.floor((60 / 60) * (sr / hopSize));   // 60 BPM
  
  let bestLag = minLag;
  let bestCorr = -Infinity;

  for (let lag = minLag; lag <= Math.min(maxLag, frameCount - 1); lag++) {
    let corr = 0;
    const n = Math.min(frameCount - lag, 500); // Limit computation
    for (let i = 0; i < n; i++) {
      corr += envelope[i] * envelope[i + lag];
    }
    if (corr > bestCorr) {
      bestCorr = corr;
      bestLag = lag;
    }
  }

  const bpm = Math.round(60 / (bestLag * hopSize / sr));
  return Math.max(60, Math.min(200, bpm)); // Clamp to sane range
}

/**
 * PITCH / KEY DETECTION via simplified Chromagram (FFT-based)
 * 
 * Porting concept from librosa.feature.chroma_cqt:
 *   1. Compute FFT of the signal
 *   2. Map FFT bins to the 12 chromatic pitch classes
 *   3. Sum energy per pitch class
 *   4. The pitch with highest energy is the detected key
 */
function detectKey(pcm: Float32Array, sr: number): string {
  // Use a chunk from the middle (more representative than start/end)
  const chunkSize = Math.min(pcm.length, sr * 4); // Max 4 seconds
  const startOffset = Math.max(0, Math.floor((pcm.length - chunkSize) / 2));
  const chunk = pcm.slice(startOffset, startOffset + chunkSize);

  // FFT size (must be power of 2)
  const fftSize = 4096;
  const chromaEnergy = new Float64Array(12);

  // Process in overlapping frames
  const hopSize = fftSize / 2;
  const numFrames = Math.floor((chunk.length - fftSize) / hopSize);

  for (let frame = 0; frame < numFrames; frame++) {
    const offset = frame * hopSize;
    const windowedFrame = new Float64Array(fftSize);

    // Apply Hann window
    for (let i = 0; i < fftSize; i++) {
      const hannValue = 0.5 * (1 - Math.cos(2 * Math.PI * i / (fftSize - 1)));
      windowedFrame[i] = (chunk[offset + i] || 0) * hannValue;
    }

    // Compute magnitude spectrum (simplified DFT for the frequency bins we care about)
    // We only need bins corresponding to musical pitches (27.5 Hz to 4186 Hz, A0 to C8)
    for (let pitchClass = 0; pitchClass < 12; pitchClass++) {
      // Sum energy from all octaves of this pitch class (octaves 1-7)
      for (let octave = 1; octave <= 7; octave++) {
        const freq = 440 * Math.pow(2, (pitchClass - 9) / 12 + (octave - 4));
        if (freq > sr / 2) continue; // Nyquist

        const bin = Math.round(freq * fftSize / sr);
        if (bin < fftSize / 2) {
          // Goertzel-like: compute magnitude at this specific bin
          let realPart = 0, imagPart = 0;
          const w = 2 * Math.PI * bin / fftSize;
          for (let n = 0; n < fftSize; n++) {
            realPart += windowedFrame[n] * Math.cos(w * n);
            imagPart -= windowedFrame[n] * Math.sin(w * n);
          }
          chromaEnergy[pitchClass] += Math.sqrt(realPart * realPart + imagPart * imagPart);
        }
      }
    }
  }

  // Find the pitch class with maximum energy
  let maxIndex = 0;
  let maxVal = chromaEnergy[0];
  for (let i = 1; i < 12; i++) {
    if (chromaEnergy[i] > maxVal) {
      maxVal = chromaEnergy[i];
      maxIndex = i;
    }
  }

  return PITCH_NAMES[maxIndex];
}

/**
 * HIGH-PASS FILTER (IIR Butterworth 1st order)
 * Cuts frequencies below cutoffHz (e.g., 150Hz for vocal cleaning)
 */
function applyHighPassFilter(pcm: Float32Array, sr: number, cutoffHz: number): Float32Array {
  const rc = 1.0 / (2 * Math.PI * cutoffHz);
  const dt = 1.0 / sr;
  const alpha = rc / (rc + dt);

  const filtered = new Float32Array(pcm.length);
  filtered[0] = pcm[0];

  for (let i = 1; i < pcm.length; i++) {
    filtered[i] = alpha * (filtered[i - 1] + pcm[i] - pcm[i - 1]);
  }

  return filtered;
}

/**
 * PEAK NORMALIZATION
 * Scales the entire signal so its peak reaches targetDb (e.g., -0.1 dB)
 */
function normalizePeak(pcm: Float32Array, targetDb: number): Float32Array {
  let peak = 0;
  for (const sample of pcm) {
    const abs = Math.abs(sample);
    if (abs > peak) peak = abs;
  }

  if (peak === 0) return pcm; // Silent file

  const targetLinear = Math.pow(10, targetDb / 20);
  const gain = targetLinear / peak;

  const normalized = new Float32Array(pcm.length);
  for (let i = 0; i < pcm.length; i++) {
    normalized[i] = pcm[i] * gain;
  }
  return normalized;
}

/**
 * Get peak amplitude in dB
 */
function getPeakDb(pcm: Float32Array): number {
  let peak = 0;
  for (const sample of pcm) {
    const abs = Math.abs(sample);
    if (abs > peak) peak = abs;
  }
  return peak > 0 ? 20 * Math.log10(peak) : -Infinity;
}

/**
 * TRANSIENT-BASED AUTO-SLICING with Zero-Crossing
 * 
 * Porting concept from librosa.onset.onset_detect with backtrack=True:
 *   1. Compute spectral flux (onset strength) over small frames
 *   2. Peak-pick the flux to find onset points
 *   3. Backtrack each onset to the nearest zero-crossing
 *   4. Ensure minimum slice duration (200ms)
 */
function sliceByTransients(pcm: Float32Array, sr: number): Float32Array[] {
  // 1. Compute onset strength (spectral flux approximation via energy difference)
  const hopSize = Math.floor(sr * 0.01); // 10ms
  const frameCount = Math.floor(pcm.length / hopSize);
  const energy = new Float32Array(frameCount);

  for (let i = 0; i < frameCount; i++) {
    let sum = 0;
    const start = i * hopSize;
    const end = Math.min(start + hopSize, pcm.length);
    for (let j = start; j < end; j++) {
      sum += pcm[j] * pcm[j];
    }
    energy[i] = sum;
  }

  // 2. Spectral flux (positive first-order difference of energy)
  const flux = new Float32Array(frameCount);
  for (let i = 1; i < frameCount; i++) {
    flux[i] = Math.max(0, energy[i] - energy[i - 1]);
  }

  // 3. Adaptive threshold for peak-picking
  const meanFlux = flux.reduce((a, b) => a + b, 0) / frameCount;
  const threshold = meanFlux * 2.5; // Only strong onsets

  // 4. Peak-pick with minimum distance enforcement
  const minDistFrames = Math.floor((MIN_SLICE_MS / 1000) * sr / hopSize);
  const onsetFrames: number[] = [];
  let lastOnsetFrame = -minDistFrames;

  for (let i = 1; i < frameCount - 1; i++) {
    if (flux[i] > threshold && flux[i] > flux[i - 1] && flux[i] >= flux[i + 1]) {
      if (i - lastOnsetFrame >= minDistFrames) {
        onsetFrames.push(i);
        lastOnsetFrame = i;
      }
    }
  }

  // 5. Convert frames to sample indices and backtrack to zero-crossing
  const onsetSamples = onsetFrames.map(frame => {
    let sampleIdx = frame * hopSize;
    // Backtrack to nearest zero-crossing (within 50 samples)
    for (let j = sampleIdx; j > Math.max(0, sampleIdx - 50); j--) {
      if (j > 0 && pcm[j] * pcm[j - 1] <= 0) {
        sampleIdx = j;
        break;
      }
    }
    return sampleIdx;
  });

  // 6. Create slices
  const slices: Float32Array[] = [];
  if (onsetSamples.length === 0) {
    // No transients found, return the whole thing
    return [pcm];
  }

  // First slice from beginning
  if (onsetSamples[0] > 0) {
    slices.push(pcm.slice(0, onsetSamples[0]));
  }

  for (let i = 0; i < onsetSamples.length; i++) {
    const start = onsetSamples[i];
    const end = i + 1 < onsetSamples.length ? onsetSamples[i + 1] : pcm.length;
    const slice = pcm.slice(start, end);

    // Only keep slices longer than minimum duration
    if ((slice.length / sr) * 1000 >= MIN_SLICE_MS) {
      slices.push(slice);
    }
  }

  return slices.length > 0 ? slices : [pcm];
}

// ============================================================
// UTILITY
// ============================================================

function postProgress(id: string, progress: number, message: string) {
  postMessage({
    type: 'PROGRESS',
    payload: { id, progress, message }
  });
}
