import { Injectable } from '@angular/core';

export interface MusicGenerationConfig {
  mood: 'happy' | 'sad' | 'epic' | 'chill';
  genre: '8bit' | 'synthwave' | 'ambient' | 'lofi';
  durationSeconds: number;
  bpm: number;
}

/**
 * SAMPLE-BASED MUSIC GENERATOR SERVICE
 * 
 * Mixes procedural logic (Web Audio Nodes) with REAL audio samples 
 * fetched from public CDNs to create much higher quality music.
 */
@Injectable({ providedIn: 'root' })
export class ProceduralMusicService {

  // Public domain / free sample URLs (using highly reliable CDNs)
  private readonly SAMPLE_URLS = {
    kick: 'https://cdn.freesound.org/previews/171/171104_2394245-lq.mp3',
    snare: 'https://cdn.freesound.org/previews/387/387186_7255551-lq.mp3',
    hihat: 'https://cdn.freesound.org/previews/421/421944_6010041-lq.mp3',
    pianoChordC: 'https://cdn.freesound.org/previews/448/448600_9159316-lq.mp3',
    bassC: 'https://cdn.freesound.org/previews/413/413000_3342323-lq.mp3'
  };

  private audioBuffers = new Map<string, AudioBuffer>();
  private audioContext = new AudioContext(); // temporary context just for decoding

  /**
   * Pre-load all samples from the internet before generation
   */
  async preloadSamples(onProgress?: (msg: string) => void): Promise<void> {
    if (this.audioBuffers.size === Object.keys(this.SAMPLE_URLS).length) {
      return; // Already loaded
    }

    const entries = Object.entries(this.SAMPLE_URLS);
    for (const [name, url] of entries) {
      if (onProgress) onProgress(`Downloading ${name} sample...`);
      
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.audioBuffers.set(name, audioBuffer);
      } catch (err) {
        console.error(`Failed to load sample: ${name}`, err);
        // Fallback: we will just skip this sample or use synthetic fallback during render
      }
    }
  }

  /**
   * Generates a full procedural song using loaded samples and returns a Web Audio AudioBuffer.
   */
  async generateMusic(config: MusicGenerationConfig, onProgress?: (p: number, msg?: string) => void): Promise<AudioBuffer> {
    
    // 1. Preload samples first
    await this.preloadSamples((msg) => {
      if (onProgress) onProgress(10, msg);
    });

    if (onProgress) onProgress(20, 'Setting up Audio Engine...');

    const sampleRate = 44100;
    const length = sampleRate * config.durationSeconds;
    const offlineCtx = new OfflineAudioContext(2, length, sampleRate);

    // Apply global Mastering
    const masterCompressor = offlineCtx.createDynamicsCompressor();
    masterCompressor.threshold.value = -15;
    masterCompressor.ratio.value = 4;
    masterCompressor.attack.value = 0.005;
    masterCompressor.release.value = 0.1;
    masterCompressor.connect(offlineCtx.destination);

    const masterGain = offlineCtx.createGain();
    masterGain.gain.value = 0.8; 
    masterGain.connect(masterCompressor);

    if (onProgress) onProgress(40, 'Arranging Drum Patterns...');
    await this.renderDrums(offlineCtx, masterGain, config);

    if (onProgress) onProgress(60, 'Synthesizing Bassline...');
    await this.renderBass(offlineCtx, masterGain, config);

    if (onProgress) onProgress(80, 'Arranging Chords & Melodies...');
    await this.renderChordsAndMelody(offlineCtx, masterGain, config);

    if (onProgress) onProgress(90, 'Rendering Audio Buffer (this may take a few seconds)...');
    
    // Start rendering the buffer
    const renderedBuffer = await offlineCtx.startRendering();
    
    if (onProgress) onProgress(100, 'Done!');
    return renderedBuffer;
  }

  // ============================================================
  // SAMPLE PLAYBACK HELPERS
  // ============================================================

  private playSample(ctx: OfflineAudioContext, masterOut: AudioNode, sampleName: string, time: number, volume = 1.0, pitchRatio = 1.0) {
    const buffer = this.audioBuffers.get(sampleName);
    if (!buffer) return; // Silent fallback if download failed

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitchRatio;

    const gain = ctx.createGain();
    gain.gain.value = volume;

    source.connect(gain);
    gain.connect(masterOut);
    
    source.start(time);
  }

  // ============================================================
  // MUSICAL LOGIC & SCALES
  // ============================================================

  // Returns pitch multipliers relative to the root note C
  private getScaleRatios(mood: string): number[] {
    const baseScale = [
      1.0, // C
      Math.pow(2, 2/12),  // D
      Math.pow(2, 4/12),  // E
      Math.pow(2, 5/12),  // F
      Math.pow(2, 7/12),  // G
      Math.pow(2, 9/12),  // A
      Math.pow(2, 11/12), // B
    ];

    if (mood === 'sad' || mood === 'chill' || mood === 'lofi') {
      // Natural minor
      return [
        baseScale[0], baseScale[1], Math.pow(2, 3/12), baseScale[3],
        baseScale[4], Math.pow(2, 8/12), Math.pow(2, 10/12)
      ];
    }
    return baseScale;
  }

  private getChordProgression(mood: string): number[][] {
    const I = [0, 2, 4];
    const ii = [1, 3, 5];
    const IV = [3, 5, 7]; 
    const V = [4, 6, 8];
    const vi = [5, 7, 9];

    if (mood === 'happy') return [I, V, vi, IV];
    if (mood === 'sad') return [vi, IV, I, V];
    if (mood === 'epic') return [vi, IV, I, V]; // Epic 'four chords'
    if (mood === 'chill' || mood === 'lofi') return [ii, V, I, vi]; // Jazzy
    
    return [I, IV, V, I];
  }

  // ============================================================
  // DRUM MACHINE
  // ============================================================

  private async renderDrums(ctx: OfflineAudioContext, masterOut: AudioNode, config: MusicGenerationConfig) {
    const beatDuration = 60 / config.bpm;
    const totalBeats = Math.floor(config.durationSeconds / beatDuration);

    for (let i = 0; i < totalBeats; i++) {
      const time = i * beatDuration;

      // KICK: Beats 1 & 3 (sometimes 1, 2.5, 3 for Lofi)
      if (i % 4 === 0 || i % 4 === 2) {
        this.playSample(ctx, masterOut, 'kick', time, 1.0);
      } else if (config.genre === 'lofi' && i % 4 === 1 && Math.random() > 0.5) {
        this.playSample(ctx, masterOut, 'kick', time + beatDuration / 2, 0.7); // Ghost kick
      }

      // SNARE: Beats 2 & 4
      if (config.genre !== 'ambient' && (i % 4 === 1 || i % 4 === 3)) {
        this.playSample(ctx, masterOut, 'snare', time, 0.8);
      }

      // HI-HAT: 8th notes
      if (config.genre !== 'ambient') {
        const swing = config.genre === 'lofi' ? 0.05 : 0; // Swing feel for lofi
        this.playSample(ctx, masterOut, 'hihat', time, 0.6);
        this.playSample(ctx, masterOut, 'hihat', time + beatDuration / 2 + swing, 0.4);
      }
    }
  }

  // ============================================================
  // BASSLINE
  // ============================================================

  private async renderBass(ctx: OfflineAudioContext, masterOut: AudioNode, config: MusicGenerationConfig) {
    if (config.genre === 'ambient') return;

    const beatDuration = 60 / config.bpm;
    const barDuration = beatDuration * 4;
    const totalBars = Math.floor(config.durationSeconds / barDuration);
    
    const scaleRatios = this.getScaleRatios(config.mood);
    const progression = this.getChordProgression(config.mood);

    for (let bar = 0; bar < totalBars; bar++) {
      const chord = progression[bar % progression.length];
      const rootDegree = chord[0] % 7;
      const pitchRatio = scaleRatios[rootDegree]; 
      const startTime = bar * barDuration;

      // Sparse bassline for Lofi, driving bass for Synthwave
      const steps = config.genre === 'lofi' ? 4 : 8;
      const stepDuration = config.genre === 'lofi' ? beatDuration : beatDuration / 2;

      for (let i = 0; i < steps; i++) {
        // Skip some notes for syncopation
        if (config.genre === 'lofi' && Math.random() > 0.6) continue;

        const time = startTime + (i * stepDuration);
        
        // If sample is available, use it. Otherwise draw synthetic bass.
        if (this.audioBuffers.has('bassC') && config.genre === 'lofi') {
           this.playSample(ctx, masterOut, 'bassC', time, 0.8, pitchRatio);
        } else {
           this.syntheticBass(ctx, masterOut, time, stepDuration, pitchRatio * 65.41, config.genre);
        }
      }
    }
  }

  private syntheticBass(ctx: OfflineAudioContext, masterOut: AudioNode, time: number, dur: number, freq: number, genre: string) {
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = genre === '8bit' ? 'square' : 'sawtooth';
    osc.frequency.value = freq; // Drop 2 octaves

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(genre === 'synthwave' ? 800 : 400, time);
    filter.frequency.exponentialRampToValueAtTime(100, time + dur);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);

    osc.start(time);
    osc.stop(time + dur);
  }

  // ============================================================
  // CHORDS & MELODY
  // ============================================================

  private async renderChordsAndMelody(ctx: OfflineAudioContext, masterOut: AudioNode, config: MusicGenerationConfig) {
    const beatDuration = 60 / config.bpm;
    const barDuration = beatDuration * 4;
    const totalBars = Math.floor(config.durationSeconds / barDuration);
    
    const scaleRatios = this.getScaleRatios(config.mood);
    const progression = this.getChordProgression(config.mood);

    // Filter to make samples sound more cohesive (Lo-Fi effect)
    const masterFilter = ctx.createBiquadFilter();
    if (config.genre === 'lofi') {
      masterFilter.type = 'lowpass';
      masterFilter.frequency.value = 3000; // Muffled vinyl sound
    } else {
      masterFilter.type = 'allpass';
    }
    masterFilter.connect(masterOut);

    for (let bar = 0; bar < totalBars; bar++) {
      const chordIndices = progression[bar % progression.length];
      const startTime = bar * barDuration;

      // Play Chords
      for (const degree of chordIndices) {
        const scaleIndex = degree % 7;
        const octaveShift = Math.floor(degree / 7);
        const pitchRatio = scaleRatios[scaleIndex] * Math.pow(2, octaveShift); 

        if (this.audioBuffers.has('pianoChordC')) {
          // Play piano sample
          const time = startTime + (config.genre === 'lofi' ? beatDuration / 8 : 0); // Slight strum delay
          this.playSample(ctx, masterFilter, 'pianoChordC', time, 0.4, pitchRatio);
        } else {
          // Synthetic pad fallback
          this.syntheticPad(ctx, masterFilter, startTime, barDuration, pitchRatio * 261.63, config.genre);
        }
      }

      // Play Arp/Melody
      if (config.genre !== 'ambient') {
        let currentDegree = chordIndices[0] % 7;
        for (let b = 0; b < 4; b++) { // 4 beats
          if (Math.random() > 0.4) {
             const pitchRatio = scaleRatios[currentDegree] * 2; // Up an octave
             const time = startTime + (b * beatDuration);
             
             if (config.genre === 'lofi' && this.audioBuffers.has('pianoChordC')) {
               this.playSample(ctx, masterFilter, 'pianoChordC', time, 0.3, pitchRatio);
             } else {
               this.syntheticPluck(ctx, masterFilter, time, pitchRatio * 261.63, config.genre);
             }

             // walk melody
             currentDegree = (currentDegree + (Math.random()>0.5?1:-1) + 7) % 7;
          }
        }
      }
    }
  }

  private syntheticPad(ctx: OfflineAudioContext, masterOut: AudioNode, time: number, dur: number, freq: number, genre: string) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc.type = genre === '8bit' ? 'square' : 'sine';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.15, time + dur / 4);
    gain.gain.linearRampToValueAtTime(0, time + dur);
    
    filter.type = 'lowpass';
    filter.frequency.value = 1500;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterOut);
    
    osc.start(time);
    osc.stop(time + dur);
  }

  private syntheticPluck(ctx: OfflineAudioContext, masterOut: AudioNode, time: number, freq: number, genre: string) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = genre === '8bit' ? 'square' : 'sawtooth';
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    
    osc.connect(gain);
    gain.connect(masterOut);
    
    osc.start(time);
    osc.stop(time + 0.2);
  }

  // ============================================================
  // EXPORTER
  // ============================================================

  audioBufferToWavBlob(buffer: AudioBuffer): Blob {
    // ... same WAV exporter as before ...
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const out = new ArrayBuffer(length);
    const view = new DataView(out);
    const channels = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8);
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (let i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([out], { type: 'audio/wav' });

    function setUint16(data: number) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data: number) { view.setUint32(pos, data, true); pos += 4; }
  }
}
