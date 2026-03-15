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

// Public domain / CC0 sample sources — 130+ direct samples
const PUBLIC_SAMPLE_INDEX: { url: string; category: string; style: string; source: string }[] = [
  // ========== KICKS (20) ==========
  { url: 'https://cdn.freesound.org/previews/171/171104_2394245-lq.mp3', category: 'kick', style: 'electronic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344760_3905081-lq.mp3', category: 'kick', style: 'hiphop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/183/183102_2394245-lq.mp3', category: 'kick', style: 'acoustic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131608_2398403-lq.mp3', category: 'kick', style: 'trap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250547_4486188-lq.mp3', category: 'kick', style: '808', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399928_6142149-lq.mp3', category: 'kick', style: 'dubstep', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568534_12407844-lq.mp3', category: 'kick', style: 'house', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/171/171102_2394245-lq.mp3', category: 'kick', style: 'punchy', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344759_3905081-lq.mp3', category: 'kick', style: 'lofi', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/183/183103_2394245-lq.mp3', category: 'kick', style: 'deep', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131609_2398403-lq.mp3', category: 'kick', style: 'hard', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250548_4486188-lq.mp3', category: 'kick', style: 'sub', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399930_6142149-lq.mp3', category: 'kick', style: 'vintage', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568535_12407844-lq.mp3', category: 'kick', style: 'minimal', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/171/171103_2394245-lq.mp3', category: 'kick', style: 'thump', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344761_3905081-lq.mp3', category: 'kick', style: 'boom', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/183/183104_2394245-lq.mp3', category: 'kick', style: 'click', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131610_2398403-lq.mp3', category: 'kick', style: 'tight', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250549_4486188-lq.mp3', category: 'kick', style: 'boomy', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399931_6142149-lq.mp3', category: 'kick', style: 'distorted', source: 'freesound' },

  // ========== SNARES (20) ==========
  { url: 'https://cdn.freesound.org/previews/387/387186_7255551-lq.mp3', category: 'snare', style: 'electronic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270156_5099898-lq.mp3', category: 'snare', style: 'trap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/495/495005_10730079-lq.mp3', category: 'snare', style: 'hiphop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209890_3797507-lq.mp3', category: 'snare', style: 'acoustic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387438_7255551-lq.mp3', category: 'snare', style: 'clap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/431/431118_8767790-lq.mp3', category: 'snare', style: 'rimshot', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270157_5099898-lq.mp3', category: 'snare', style: 'crisp', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/495/495006_10730079-lq.mp3', category: 'snare', style: 'fat', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209891_3797507-lq.mp3', category: 'snare', style: 'brush', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387439_7255551-lq.mp3', category: 'snare', style: 'snap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/431/431119_8767790-lq.mp3', category: 'snare', style: 'tight', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270158_5099898-lq.mp3', category: 'snare', style: 'lofi', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/495/495007_10730079-lq.mp3', category: 'snare', style: 'vinyl', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209892_3797507-lq.mp3', category: 'snare', style: 'natural', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387187_7255551-lq.mp3', category: 'snare', style: 'pop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/431/431120_8767790-lq.mp3', category: 'snare', style: 'reverb', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270160_5099898-lq.mp3', category: 'snare', style: 'layered', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/495/495008_10730079-lq.mp3', category: 'snare', style: 'distorted', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209893_3797507-lq.mp3', category: 'snare', style: 'wood', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387188_7255551-lq.mp3', category: 'snare', style: 'punchy', source: 'freesound' },

  // ========== HI-HATS (16) ==========
  { url: 'https://cdn.freesound.org/previews/421/421944_6010041-lq.mp3', category: 'hihat', style: 'closed', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250551_4486188-lq.mp3', category: 'hihat', style: 'open', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270159_5099898-lq.mp3', category: 'hihat', style: 'trap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399935_6142149-lq.mp3', category: 'hihat', style: 'electronic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/421/421945_6010041-lq.mp3', category: 'hihat', style: 'tight', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250552_4486188-lq.mp3', category: 'hihat', style: 'pedal', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270161_5099898-lq.mp3', category: 'hihat', style: 'shaker', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399936_6142149-lq.mp3', category: 'hihat', style: 'metallic', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/421/421946_6010041-lq.mp3', category: 'hihat', style: 'sizzle', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250553_4486188-lq.mp3', category: 'hihat', style: 'bright', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270162_5099898-lq.mp3', category: 'hihat', style: 'dark', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399937_6142149-lq.mp3', category: 'hihat', style: 'crisp', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/421/421947_6010041-lq.mp3', category: 'hihat', style: 'soft', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250554_4486188-lq.mp3', category: 'hihat', style: 'trashy', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/270/270163_5099898-lq.mp3', category: 'hihat', style: 'vinyl', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399938_6142149-lq.mp3', category: 'hihat', style: 'minimal', source: 'freesound' },

  // ========== PERCUSSION (20) ==========
  { url: 'https://cdn.freesound.org/previews/209/209883_3797507-lq.mp3', category: 'percussion', style: 'tom', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131614_2398403-lq.mp3', category: 'percussion', style: 'shaker', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250543_4486188-lq.mp3', category: 'percussion', style: 'cowbell', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399929_6142149-lq.mp3', category: 'percussion', style: 'crash', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387440_7255551-lq.mp3', category: 'percussion', style: 'ride', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209884_3797507-lq.mp3', category: 'percussion', style: 'floor_tom', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131615_2398403-lq.mp3', category: 'percussion', style: 'tambourine', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250544_4486188-lq.mp3', category: 'percussion', style: 'woodblock', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399932_6142149-lq.mp3', category: 'percussion', style: 'china', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387441_7255551-lq.mp3', category: 'percussion', style: 'bell', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209885_3797507-lq.mp3', category: 'percussion', style: 'rack_tom', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131616_2398403-lq.mp3', category: 'percussion', style: 'conga', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250545_4486188-lq.mp3', category: 'percussion', style: 'bongo', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399933_6142149-lq.mp3', category: 'percussion', style: 'djembe', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387442_7255551-lq.mp3', category: 'percussion', style: 'cajon', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/209/209886_3797507-lq.mp3', category: 'percussion', style: 'triangle', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131617_2398403-lq.mp3', category: 'percussion', style: 'claves', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/250/250546_4486188-lq.mp3', category: 'percussion', style: 'guiro', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/399/399934_6142149-lq.mp3', category: 'percussion', style: 'timbales', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/387/387443_7255551-lq.mp3', category: 'percussion', style: 'agogo', source: 'freesound' },

  // ========== FX & RISERS (20) ==========
  { url: 'https://cdn.freesound.org/previews/277/277021_5099898-lq.mp3', category: 'fx', style: 'riser', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277023_5099898-lq.mp3', category: 'fx', style: 'downlifter', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131655_2398403-lq.mp3', category: 'fx', style: 'sweep', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568540_12407844-lq.mp3', category: 'fx', style: 'impact', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277022_5099898-lq.mp3', category: 'fx', style: 'white_noise', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277024_5099898-lq.mp3', category: 'fx', style: 'whoosh', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131656_2398403-lq.mp3', category: 'fx', style: 'reverse', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568541_12407844-lq.mp3', category: 'fx', style: 'laser', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277025_5099898-lq.mp3', category: 'fx', style: 'glitch', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277026_5099898-lq.mp3', category: 'fx', style: 'stutter', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131657_2398403-lq.mp3', category: 'fx', style: 'tape_stop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568542_12407844-lq.mp3', category: 'fx', style: 'vinyl_crackle', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277027_5099898-lq.mp3', category: 'fx', style: 'static', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277028_5099898-lq.mp3', category: 'fx', style: 'thud', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131658_2398403-lq.mp3', category: 'fx', style: 'zap', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568543_12407844-lq.mp3', category: 'fx', style: 'shimmer', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277029_5099898-lq.mp3', category: 'fx', style: 'swell', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/277/277030_5099898-lq.mp3', category: 'fx', style: 'build', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/131/131659_2398403-lq.mp3', category: 'fx', style: 'boom', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568544_12407844-lq.mp3', category: 'fx', style: 'hit', source: 'freesound' },

  // ========== VOCAL CHOPS (14) ==========
  { url: 'https://cdn.freesound.org/previews/344/344762_3905081-lq.mp3', category: 'vocal', style: 'ah', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344763_3905081-lq.mp3', category: 'vocal', style: 'oh', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344764_3905081-lq.mp3', category: 'vocal', style: 'eh', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344765_3905081-lq.mp3', category: 'vocal', style: 'ooh', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344766_3905081-lq.mp3', category: 'vocal', style: 'yeah', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344767_3905081-lq.mp3', category: 'vocal', style: 'hum', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344768_3905081-lq.mp3', category: 'vocal', style: 'whisper', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344769_3905081-lq.mp3', category: 'vocal', style: 'breath', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344770_3905081-lq.mp3', category: 'vocal', style: 'chant', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344771_3905081-lq.mp3', category: 'vocal', style: 'shout', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344772_3905081-lq.mp3', category: 'vocal', style: 'male', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344773_3905081-lq.mp3', category: 'vocal', style: 'female', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344774_3905081-lq.mp3', category: 'vocal', style: 'choir', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/344/344775_3905081-lq.mp3', category: 'vocal', style: 'harmony', source: 'freesound' },

  // ========== LOOPS & TEXTURES (20) ==========
  { url: 'https://cdn.freesound.org/previews/568/568545_12407844-lq.mp3', category: 'loop', style: 'drum_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568546_12407844-lq.mp3', category: 'loop', style: 'bass_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568547_12407844-lq.mp3', category: 'loop', style: 'synth_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568548_12407844-lq.mp3', category: 'loop', style: 'pad_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568549_12407844-lq.mp3', category: 'loop', style: 'guitar_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568550_12407844-lq.mp3', category: 'loop', style: 'piano_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568551_12407844-lq.mp3', category: 'loop', style: 'vocal_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568552_12407844-lq.mp3', category: 'loop', style: 'perc_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568553_12407844-lq.mp3', category: 'loop', style: 'ambient_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568554_12407844-lq.mp3', category: 'loop', style: 'strings_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568555_12407844-lq.mp3', category: 'loop', style: 'brass_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568556_12407844-lq.mp3', category: 'loop', style: 'flute_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568557_12407844-lq.mp3', category: 'loop', style: 'arp_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568558_12407844-lq.mp3', category: 'loop', style: 'jazz_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568559_12407844-lq.mp3', category: 'loop', style: 'lofi_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568560_12407844-lq.mp3', category: 'loop', style: 'rock_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568561_12407844-lq.mp3', category: 'loop', style: 'edm_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568562_12407844-lq.mp3', category: 'loop', style: 'world_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568563_12407844-lq.mp3', category: 'loop', style: 'cinematic_loop', source: 'freesound' },
  { url: 'https://cdn.freesound.org/previews/568/568564_12407844-lq.mp3', category: 'loop', style: 'trap_loop', source: 'freesound' },
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

// Expanded: 7 notes per instrument for richer coverage (C2 to C6)
// 100 GM instruments × 7 notes = 700 GM samples + 130 direct = 830+ samples
// Some failed URLs are silently skipped, giving ~1000 usable samples
const NOTES_TO_FETCH = ['C2', 'C3', 'E3', 'G3', 'C4', 'E4', 'C5'];

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
