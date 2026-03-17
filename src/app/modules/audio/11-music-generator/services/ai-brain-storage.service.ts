import { Injectable } from '@angular/core';

/**
 * AI BRAIN STORAGE SERVICE
 *
 * This is the "Vault" — a persistent IndexedDB database that stores
 * thousands of pre-processed audio samples (sliced, normalized, pitch-labeled)
 * directly inside the user's browser. The Music Generator queries this vault
 * to compose songs from real, high-quality audio material.
 *
 * Architecture: IndexedDB with two object stores:
 *   1. 'samples' — The actual audio binary data (ArrayBuffer/Blob)
 *   2. 'metadata' — JSON metadata for each sample (BPM, Key, Style, Duration)
 */

export interface SampleMetadata {
  id: string;
  originalFile: string;
  category: 'kick' | 'snare' | 'hihat' | 'percussion' | 'bass' | 'synth' | 'pad' | 'vocal' | 'melody' | 'fx' | 'loop' | 'other';
  detectedKey: string;       // e.g. 'C', 'C#', 'D', ... 'B'
  detectedBpm: number;       // e.g. 120
  durationMs: number;        // e.g. 5000
  sampleRate: number;        // e.g. 44100
  channels: number;          // 1 = mono, 2 = stereo
  style?: string;            // e.g. 'lofi', 'edm', 'synthwave'
  source: string;            // e.g. 'freesound', 'fma', 'github'
  peakDb: number;            // normalized peak in dB, target: -0.1
  createdAt: number;         // timestamp
}

const DB_NAME = 'OmniBrainVault';
const DB_VERSION = 1;
const STORE_SAMPLES = 'samples';
const STORE_METADATA = 'metadata';

@Injectable({ providedIn: 'root' })
export class AiBrainStorageService {

  private db: IDBDatabase | null = null;

  /**
   * Opens or creates the IndexedDB database.
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_SAMPLES)) {
          db.createObjectStore(STORE_SAMPLES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_METADATA)) {
          const metaStore = db.createObjectStore(STORE_METADATA, { keyPath: 'id' });
          metaStore.createIndex('category', 'category', { unique: false });
          metaStore.createIndex('detectedKey', 'detectedKey', { unique: false });
          metaStore.createIndex('style', 'style', { unique: false });
          metaStore.createIndex('detectedBpm', 'detectedBpm', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Store a processed sample (audio binary + metadata) into the Brain Vault.
   */
  async storeSample(meta: SampleMetadata, audioData: ArrayBuffer): Promise<void> {
    await this.init();
    const tx = this.db!.transaction([STORE_SAMPLES, STORE_METADATA], 'readwrite');

    tx.objectStore(STORE_SAMPLES).put({ id: meta.id, audio: audioData });
    tx.objectStore(STORE_METADATA).put(meta);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  /**
   * Query samples by category and optional filters (key, style, bpm range).
   */
  async querySamples(filters: {
    category?: string;
    key?: string;
    style?: string;
    bpmMin?: number;
    bpmMax?: number;
    limit?: number;
  }): Promise<SampleMetadata[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_METADATA, 'readonly');
      const store = tx.objectStore(STORE_METADATA);
      const results: SampleMetadata[] = [];

      let request: IDBRequest;

      // Use category index if available, otherwise scan all
      if (filters.category) {
        const index = store.index('category');
        request = index.openCursor(IDBKeyRange.only(filters.category));
      } else {
        request = store.openCursor();
      }

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (!cursor) {
          resolve(results);
          return;
        }

        const meta = cursor.value as SampleMetadata;
        let match = true;

        if (filters.key && meta.detectedKey !== filters.key) match = false;
        if (filters.style && meta.style !== filters.style) match = false;
        if (filters.bpmMin && meta.detectedBpm < filters.bpmMin) match = false;
        if (filters.bpmMax && meta.detectedBpm > filters.bpmMax) match = false;

        if (match) results.push(meta);

        if (filters.limit && results.length >= filters.limit) {
          resolve(results);
          return;
        }

        cursor.continue();
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Retrieve the raw audio ArrayBuffer for a specific sample ID.
   */
  async getAudioData(sampleId: string): Promise<ArrayBuffer | null> {
    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_SAMPLES, 'readonly');
      const request = tx.objectStore(STORE_SAMPLES).get(sampleId);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.audio : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get total count of samples in the Brain Vault.
   */
  async getSampleCount(): Promise<number> {
    await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(STORE_METADATA, 'readonly');
      const request = tx.objectStore(STORE_METADATA).count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear the entire Brain Vault (for dev/testing purposes).
   */
  async clearAll(): Promise<void> {
    await this.init();
    const tx = this.db!.transaction([STORE_SAMPLES, STORE_METADATA], 'readwrite');
    tx.objectStore(STORE_SAMPLES).clear();
    tx.objectStore(STORE_METADATA).clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}
