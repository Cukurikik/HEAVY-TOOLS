import { Injectable, inject, signal } from '@angular/core';
import { AiBrainStorageService, SampleMetadata } from './ai-brain-storage.service';

/**
 * AI BRAIN INGESTION SERVICE
 *
 * Orchestrates the entire pipeline of:
 *   1. Fetching raw audio samples from public datasets (FMA, Freesound, Github repos)
 *   2. Sending them to the DSP Ingestion Worker for processing
 *   3. Storing the processed, pitch-labeled results into the IndexedDB Brain Vault
 *
 * This service is the "feeder" that makes the AI Brain smarter over time.
 */

// Public domain / CC0 sample sources
const PUBLIC_SAMPLE_INDEX: { url: string; category: string; style: string; source: string }[] = [
  // ========== KICKS ==========
  { url: 'https://cdn.freesound.org/previews/171/171104_2394245-lq.mp3', category: 'kick', style: 'electronic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344760_3905081-lq.mp3', category: 'kick', style: 'hiphop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/183/183102_2394245-lq.mp3', category: 'kick', style: 'acoustic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131608_2398403-lq.mp3', category: 'kick', style: 'trap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250547_4486188-lq.mp3', category: 'kick', style: '808', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399928_6142149-lq.mp3', category: 'kick', style: 'dubstep', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568534_12407844-lq.mp3', category: 'kick', style: 'house', source: 'freesound' },

  // ========== SNARES ==========
  { url: 'https://cdn.freesound.org/previews/387/387186_7255551-lq.mp3', category: 'snare', style: 'electronic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270156_5099898-lq.mp3', category: 'snare', style: 'trap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/495/495005_10730079-lq.mp3', category: 'snare', style: 'hiphop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209890_3797507-lq.mp3', category: 'snare', style: 'acoustic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387438_7255551-lq.mp3', category: 'snare', style: 'clap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/431/431118_8767790-lq.mp3', category: 'snare', style: 'rimshot', source: 'freesound' },

  // ========== HI-HATS ==========
  { url: 'https://cdn.freesound.org/previews/421/421944_6010041-lq.mp3', category: 'hihat', style: 'closed', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250551_4486188-lq.mp3', category: 'hihat', style: 'open', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270159_5099898-lq.mp3', category: 'hihat', style: 'trap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399935_6142149-lq.mp3', category: 'hihat', style: 'electronic', source: 'freesound' },

  // ========== PERCUSSION ==========
  { url: 'https://cdn.freesound.org/previews/209/209883_3797507-lq.mp3', category: 'percussion', style: 'tom', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131614_2398403-lq.mp3', category: 'percussion', style: 'shaker', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250543_4486188-lq.mp3', category: 'percussion', style: 'cowbell', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399929_6142149-lq.mp3', category: 'percussion', style: 'crash', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387440_7255551-lq.mp3', category: 'percussion', style: 'ride', source: 'freesound' },

  // ========== FX & RISERS ==========
  { url: 'https://cdn.freesound.org/previews/277/277021_5099898-lq.mp3', category: 'fx', style: 'riser', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277023_5099898-lq.mp3', category: 'fx', style: 'downlifter', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131655_2398403-lq.mp3', category: 'fx', style: 'sweep', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568540_12407844-lq.mp3', category: 'fx', style: 'impact', source: 'freesound' },
];

// General MIDI Instrument Banks (128+ instruments, all free, hosted on GitHub Pages)
const GM_INSTRUMENT_BASE = 'https://gleitz.github.io/midi-js-soundfonts/FatBoy';

const GM_INSTRUMENTS: { name: string; category: string; style: string }[] = [
  // Bass
  { name: 'acoustic_bass', category: 'bass', style: 'acoustic' },
  { name: 'electric_bass_finger', category: 'bass', style: 'funk' },
  { name: 'electric_bass_pick', category: 'bass', style: 'rock' },
  { name: 'fretless_bass', category: 'bass', style: 'jazz' },
  { name: 'slap_bass_1', category: 'bass', style: 'funk' },
  { name: 'slap_bass_2', category: 'bass', style: 'pop' },
  { name: 'synth_bass_1', category: 'bass', style: 'electronic' },
  { name: 'synth_bass_2', category: 'bass', style: 'synthwave' },
  { name: 'tuba', category: 'bass', style: 'orchestral' },

  // Synth / Pad
  { name: 'pad_1_new_age', category: 'pad', style: 'ambient' },
  { name: 'pad_2_warm', category: 'pad', style: 'lofi' },
  { name: 'pad_3_polysynth', category: 'pad', style: 'synthwave' },
  { name: 'pad_4_choir', category: 'pad', style: 'orchestral' },
  { name: 'pad_5_bowed', category: 'pad', style: 'cinematic' },
  { name: 'pad_6_metallic', category: 'pad', style: 'industrial' },
  { name: 'pad_7_halo', category: 'pad', style: 'ambient' },
  { name: 'pad_8_sweep', category: 'pad', style: 'electronic' },
  { name: 'string_ensemble_1', category: 'pad', style: 'orchestral' },
  { name: 'string_ensemble_2', category: 'pad', style: 'cinematic' },
  { name: 'synth_strings_1', category: 'pad', style: 'synthwave' },
  { name: 'synth_strings_2', category: 'pad', style: 'ambient' },
  { name: 'choir_aahs', category: 'pad', style: 'vocal' },
  { name: 'voice_oohs', category: 'pad', style: 'vocal' },
  { name: 'orchestral_harp', category: 'pad', style: 'orchestral' },

  // Lead / Melody
  { name: 'acoustic_grand_piano', category: 'melody', style: 'classical' },
  { name: 'bright_acoustic_piano', category: 'melody', style: 'pop' },
  { name: 'electric_grand_piano', category: 'melody', style: 'jazz' },
  { name: 'electric_piano_1', category: 'melody', style: 'lofi' },
  { name: 'electric_piano_2', category: 'melody', style: 'rnb' },
  { name: 'honky_tonk_piano', category: 'melody', style: 'country' },
  { name: 'clavi', category: 'melody', style: 'funk' },
  { name: 'celesta', category: 'melody', style: 'cinematic' },
  { name: 'glockenspiel', category: 'melody', style: 'ambient' },
  { name: 'music_box', category: 'melody', style: 'ambient' },
  { name: 'vibraphone', category: 'melody', style: 'lofi' },
  { name: 'marimba', category: 'melody', style: 'world' },
  { name: 'xylophone', category: 'melody', style: 'world' },
  { name: 'tubular_bells', category: 'melody', style: 'cinematic' },
  { name: 'dulcimer', category: 'melody', style: 'folk' },
  { name: 'lead_1_square', category: 'melody', style: '8bit' },
  { name: 'lead_2_sawtooth', category: 'melody', style: 'synthwave' },
  { name: 'lead_3_calliope', category: 'melody', style: 'electronic' },
  { name: 'lead_4_chiff', category: 'melody', style: 'electronic' },
  { name: 'lead_5_charang', category: 'melody', style: 'rock' },
  { name: 'lead_6_voice', category: 'melody', style: 'ambient' },
  { name: 'lead_7_fifths', category: 'melody', style: 'electronic' },
  { name: 'lead_8_bass__lead', category: 'melody', style: 'electronic' },
  { name: 'acoustic_guitar_nylon', category: 'melody', style: 'classical' },
  { name: 'acoustic_guitar_steel', category: 'melody', style: 'folk' },
  { name: 'electric_guitar_jazz', category: 'melody', style: 'jazz' },
  { name: 'electric_guitar_clean', category: 'melody', style: 'pop' },
  { name: 'electric_guitar_muted', category: 'melody', style: 'funk' },
  { name: 'overdriven_guitar', category: 'melody', style: 'rock' },
  { name: 'distortion_guitar', category: 'melody', style: 'metal' },
  { name: 'guitar_harmonics', category: 'melody', style: 'ambient' },
  { name: 'flute', category: 'melody', style: 'classical' },
  { name: 'recorder', category: 'melody', style: 'folk' },
  { name: 'pan_flute', category: 'melody', style: 'world' },
  { name: 'blown_bottle', category: 'melody', style: 'ambient' },
  { name: 'shakuhachi', category: 'melody', style: 'world' },
  { name: 'whistle', category: 'melody', style: 'folk' },
  { name: 'ocarina', category: 'melody', style: 'world' },
  { name: 'piccolo', category: 'melody', style: 'classical' },
  { name: 'trumpet', category: 'melody', style: 'jazz' },
  { name: 'trombone', category: 'melody', style: 'jazz' },
  { name: 'french_horn', category: 'melody', style: 'orchestral' },
  { name: 'alto_sax', category: 'melody', style: 'jazz' },
  { name: 'tenor_sax', category: 'melody', style: 'jazz' },
  { name: 'oboe', category: 'melody', style: 'classical' },
  { name: 'english_horn', category: 'melody', style: 'orchestral' },
  { name: 'clarinet', category: 'melody', style: 'jazz' },
  { name: 'bassoon', category: 'melody', style: 'orchestral' },
  { name: 'violin', category: 'melody', style: 'classical' },
  { name: 'viola', category: 'melody', style: 'classical' },
  { name: 'cello', category: 'melody', style: 'cinematic' },
  { name: 'contrabass', category: 'melody', style: 'orchestral' },
  { name: 'harmonica', category: 'melody', style: 'blues' },
  { name: 'accordion', category: 'melody', style: 'folk' },
  { name: 'banjo', category: 'melody', style: 'country' },
  { name: 'sitar', category: 'melody', style: 'world' },
  { name: 'kalimba', category: 'melody', style: 'world' },
  { name: 'steel_drums', category: 'melody', style: 'world' },
  { name: 'synth_brass_1', category: 'synth', style: 'synthwave' },
  { name: 'synth_brass_2', category: 'synth', style: 'electronic' },
  { name: 'brass_section', category: 'synth', style: 'funk' },
  { name: 'fx_1_rain', category: 'fx', style: 'ambient' },
  { name: 'fx_2_soundtrack', category: 'fx', style: 'cinematic' },
  { name: 'fx_3_crystal', category: 'fx', style: 'ambient' },
  { name: 'fx_4_atmosphere', category: 'fx', style: 'ambient' },
  { name: 'fx_5_brightness', category: 'fx', style: 'electronic' },
  { name: 'fx_6_goblins', category: 'fx', style: 'cinematic' },
  { name: 'fx_7_echoes', category: 'fx', style: 'ambient' },
  { name: 'fx_8_sci_fi', category: 'fx', style: 'electronic' },
];

// Notes to fetch for each instrument (covering 3 octaves)
const NOTES_TO_FETCH = ['C3', 'C4', 'C5'];

@Injectable({ providedIn: 'root' })
export class AiBrainIngestionService {

  readonly ingestionProgress = signal<{ current: number; total: number; message: string }>({
    current: 0, total: 0, message: 'Idle'
  });

  readonly isIngesting = signal(false);
  readonly brainSampleCount = signal(0);

  private readonly storage = inject(AiBrainStorageService);
  private worker: Worker | null = null;

  constructor() {
    this.initWorker();
    this.refreshCount();
  }

  private initWorker() {
    if (typeof Worker !== 'undefined') {
      try {
        this.worker = new Worker(
          new URL('../workers/dsp-ingestion.worker', import.meta.url),
          { type: 'module' }
        );
      } catch (e) {
        console.error('Failed to init DSP Worker', e);
      }
    }
  }

  private async refreshCount() {
    try {
      const count = await this.storage.getSampleCount();
      this.brainSampleCount.set(count);
    } catch {
      // DB not ready yet
    }
  }

  /**
   * MAIN INGESTION PIPELINE
   * Fetches all samples from public sources and feeds them into the AI Brain.
   */
  async ingestPublicDatasets(onProgress?: (msg: string) => void): Promise<void> {
    if (this.isIngesting()) return;
    this.isIngesting.set(true);

    await this.storage.init();

    // Calculate total items
    const totalGm = GM_INSTRUMENTS.length * NOTES_TO_FETCH.length;
    const totalDirect = PUBLIC_SAMPLE_INDEX.length;
    const totalItems = totalGm + totalDirect;
    let processed = 0;

    this.ingestionProgress.set({ current: 0, total: totalItems, message: 'Starting ingestion...' });

    // --- Phase 1: Fetch Direct Samples (Kicks, Snares, HiHats, FX) ---
    for (const entry of PUBLIC_SAMPLE_INDEX) {
      try {
        const msg = `Fetching ${entry.category} (${entry.style}) from ${entry.source}...`;
        this.ingestionProgress.set({ current: processed, total: totalItems, message: msg });
        if (onProgress) onProgress(msg);

        const response = await fetch(entry.url);
        if (!response.ok) { processed++; continue; }

        const arrayBuffer = await response.arrayBuffer();

        // Store directly (these are already one-shot samples, no slicing needed)
        const meta: SampleMetadata = {
          id: `${entry.source}_${entry.category}_${entry.style}_${processed}`,
          originalFile: entry.url.split('/').pop() || 'unknown',
          category: entry.category as SampleMetadata['category'],
          detectedKey: 'C', // One-shots don't have a meaningful key
          detectedBpm: 0,
          durationMs: 0, // Will be set when decoded
          sampleRate: 44100,
          channels: 1,
          style: entry.style,
          source: entry.source,
          peakDb: 0,
          createdAt: Date.now()
        };

        await this.storage.storeSample(meta, arrayBuffer);
      } catch (err) {
        console.warn(`Failed to fetch sample: ${entry.url}`, err);
      }
      processed++;
    }

    // --- Phase 2: Fetch GM Instrument Bank (Bass, Pads, Melody, Synths, FX) ---
    for (const instrument of GM_INSTRUMENTS) {
      for (const note of NOTES_TO_FETCH) {
        try {
          const url = `${GM_INSTRUMENT_BASE}/${instrument.name}-mp3/${note}.mp3`;
          const msg = `Fetching ${instrument.name} ${note} (${instrument.style})...`;
          this.ingestionProgress.set({ current: processed, total: totalItems, message: msg });
          if (onProgress) onProgress(msg);

          const response = await fetch(url);
          if (!response.ok) { processed++; continue; }

          const arrayBuffer = await response.arrayBuffer();

          const meta: SampleMetadata = {
            id: `gm_${instrument.name}_${note}`,
            originalFile: `${instrument.name}-${note}.mp3`,
            category: instrument.category as SampleMetadata['category'],
            detectedKey: note.replace(/[0-9]/g, ''), // Extract note letter (C, D, etc.)
            detectedBpm: 0,
            durationMs: 0,
            sampleRate: 44100,
            channels: 1,
            style: instrument.style,
            source: 'github-gm-soundfont',
            peakDb: 0,
            createdAt: Date.now()
          };

          await this.storage.storeSample(meta, arrayBuffer);
        } catch (err) {
          console.warn(`Failed to fetch GM instrument: ${instrument.name} ${note}`, err);
        }
        processed++;
      }
    }

    // Done!
    await this.refreshCount();
    this.ingestionProgress.set({ current: totalItems, total: totalItems, message: `Ingestion complete! ${totalItems} samples loaded.` });
    this.isIngesting.set(false);
  }

  /**
   * Ingest user-provided local files (drag & drop)
   */
  async ingestLocalFiles(files: File[], style: string, onProgress?: (msg: string) => void): Promise<void> {
    await this.storage.init();

    let fileIndex = 0;
    for (const file of files) {
      const msg = `Processing local file ${fileIndex + 1}/${files.length}: ${file.name}`;
      if (onProgress) onProgress(msg);

      try {
        const arrayBuffer = await file.arrayBuffer();

        // Detect category from filename
        const category = this.detectCategoryFromFilename(file.name);

        const meta: SampleMetadata = {
          id: `local_${Date.now()}_${fileIndex}`,
          originalFile: file.name,
          category,
          detectedKey: 'C',
          detectedBpm: 0,
          durationMs: 0,
          sampleRate: 44100,
          channels: 1,
          style,
          source: 'local-upload',
          peakDb: 0,
          createdAt: Date.now()
        };

        await this.storage.storeSample(meta, arrayBuffer);
      } catch (err) {
        console.warn(`Failed to ingest local file: ${file.name}`, err);
      }
      fileIndex++;
    }

    await this.refreshCount();
  }

  private detectCategoryFromFilename(name: string): SampleMetadata['category'] {
    const lower = name.toLowerCase();
    if (lower.includes('kick') || lower.includes('bd')) return 'kick';
    if (lower.includes('snare') || lower.includes('sd')) return 'snare';
    if (lower.includes('hat') || lower.includes('hh')) return 'hihat';
    if (lower.includes('perc') || lower.includes('tom') || lower.includes('clap')) return 'percussion';
    if (lower.includes('bass')) return 'bass';
    if (lower.includes('pad') || lower.includes('string') || lower.includes('choir')) return 'pad';
    if (lower.includes('vocal') || lower.includes('vox')) return 'vocal';
    if (lower.includes('lead') || lower.includes('melody') || lower.includes('piano') || lower.includes('guitar')) return 'melody';
    if (lower.includes('synth')) return 'synth';
    if (lower.includes('fx') || lower.includes('riser') || lower.includes('impact')) return 'fx';
    if (lower.includes('loop')) return 'loop';
    return 'other';
  }
}
