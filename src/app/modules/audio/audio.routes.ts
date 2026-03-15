// ============================================================
// AUDIO ROUTES — All 30 features registered
// File: src/app/modules/audio/audio.routes.ts
// ============================================================

import { Routes } from '@angular/router';

export const AUDIO_ROUTES: Routes = [
  { path: 'recorder',       loadComponent: () => import('./01-recorder/recorder.component').then(m => m.RecorderComponent),              title: 'Audio Recorder — Omni-Tool',       data: { category: 'basic' } },
  { path: 'trimmer',        loadComponent: () => import('./02-trimmer/trimmer.component').then(m => m.TrimmerComponent),                  title: 'Audio Trimmer — Omni-Tool',        data: { category: 'basic' } },
  { path: 'merger',         loadComponent: () => import('./03-merger/merger.component').then(m => m.MergerComponent),                     title: 'Audio Merger — Omni-Tool',         data: { category: 'basic' } },
  { path: 'converter',      loadComponent: () => import('./04-converter/converter.component').then(m => m.AudioConverterComponent),       title: 'Format Converter — Omni-Tool',     data: { category: 'basic' } },
  { path: 'compressor',     loadComponent: () => import('./05-compressor/compressor.component').then(m => m.DynamicsCompressorComponent), title: 'Dynamics Compressor — Omni-Tool',  data: { category: 'advanced' } },
  { path: 'equalizer',      loadComponent: () => import('./06-equalizer/equalizer.component').then(m => m.EqualizerComponent),            title: 'Equalizer — Omni-Tool',            data: { category: 'advanced' } },
  { path: 'pitch-shifter',  loadComponent: () => import('./07-pitch-shifter/pitch-shifter.component').then(m => m.PitchShifterComponent), title: 'Pitch Shifter — Omni-Tool',        data: { category: 'advanced' } },
  { path: 'time-stretch',   loadComponent: () => import('./08-time-stretch/time-stretch.component').then(m => m.TimeStretchComponent),    title: 'Time Stretcher — Omni-Tool',       data: { category: 'advanced' } },
  { path: 'normalizer',     loadComponent: () => import('./09-normalizer/normalizer.component').then(m => m.NormalizerComponent),         title: 'Audio Normalizer — Omni-Tool',     data: { category: 'advanced' } },
  { path: 'reverb',         loadComponent: () => import('./10-reverb/reverb.component').then(m => m.ReverbComponent),                    title: 'Reverb & Room Sim — Omni-Tool',    data: { category: 'pro' } },
  { path: 'music-generator',loadComponent: () => import('./11-music-generator/music-generator.component').then(m => m.MusicGeneratorComponent), title: 'Music Generator — Omni-Tool',    data: { category: 'ai' } },
  { path: 'noise-remover',  loadComponent: () => import('./11-noise-remover/noise-remover.component').then(m => m.NoiseRemoverComponent), title: 'Noise Remover — Omni-Tool',        data: { category: 'pro' } },
  { path: 'splitter',       loadComponent: () => import('./12-splitter/splitter.component').then(m => m.AudioSplitterComponent),          title: 'Audio Splitter — Omni-Tool',       data: { category: 'advanced' } },
  { path: 'metadata',       loadComponent: () => import('./13-metadata/metadata.component').then(m => m.AudioMetadataComponent),         title: 'Metadata Editor — Omni-Tool',      data: { category: 'pro' } },
  { path: 'batch',          loadComponent: () => import('./14-batch/batch.component').then(m => m.AudioBatchComponent),                  title: 'Batch Processor — Omni-Tool',      data: { category: 'pro' } },
  { path: 'analyser',       loadComponent: () => import('./15-analyser/analyser.component').then(m => m.AudioAnalyserComponent),         title: 'Audio Analyser — Omni-Tool',       data: { category: 'advanced' } },
  { path: 'reverser',       loadComponent: () => import('./16-reverser/reverser.component').then(m => m.AudioReverserComponent),         title: 'Audio Reverser — Omni-Tool',       data: { category: 'basic' } },
  { path: 'mixer',          loadComponent: () => import('./17-mixer/mixer.component').then(m => m.AudioMixerComponent),                  title: 'Multi-track Mixer — Omni-Tool',    data: { category: 'pro' } },
  { path: 'fade',           loadComponent: () => import('./18-fade/fade.component').then(m => m.AudioFadeComponent),                     title: 'Fade In/Out — Omni-Tool',          data: { category: 'basic' } },
  { path: 'looper',         loadComponent: () => import('./19-looper/looper.component').then(m => m.AudioLooperComponent),               title: 'Loop Creator — Omni-Tool',         data: { category: 'advanced' } },
  { path: 'channel-mixer',  loadComponent: () => import('./20-channel-mixer/channel-mixer.component').then(m => m.ChannelMixerComponent), title: 'Channel Mixer — Omni-Tool',       data: { category: 'advanced' } },
  { path: 'silence-remover',loadComponent: () => import('./21-silence-remover/silence-remover.component').then(m => m.SilenceRemoverComponent), title: 'Silence Remover — Omni-Tool', data: { category: 'basic' } },
  { path: 'speed',          loadComponent: () => import('./22-speed/speed.component').then(m => m.AudioSpeedComponent),                  title: 'Speed Changer — Omni-Tool',        data: { category: 'basic' } },
  { path: 'limiter',        loadComponent: () => import('./23-limiter/limiter.component').then(m => m.LimiterComponent),                 title: 'Limiter & Maximizer — Omni-Tool',  data: { category: 'pro' } },
  { path: 'stereo-widener', loadComponent: () => import('./24-stereo-widener/stereo-widener.component').then(m => m.StereoWidenerComponent), title: 'Stereo Widener — Omni-Tool',  data: { category: 'advanced' } },
  { path: 'voice-changer',  loadComponent: () => import('./25-voice-changer/voice-changer.component').then(m => m.VoiceChangerComponent), title: 'Voice Changer — Omni-Tool',       data: { category: 'pro' } },
  { path: 'karaoke',        loadComponent: () => import('./26-karaoke/karaoke.component').then(m => m.KaraokeComponent),                 title: 'Karaoke / Vocal Remover — Omni-Tool', data: { category: 'ai' } },
  { path: 'visualizer',     loadComponent: () => import('./27-visualizer/visualizer.component').then(m => m.AudioVisualizerComponent),   title: 'Spectrum Visualizer — Omni-Tool',  data: { category: 'pro' } },
  { path: 'transcriber',    loadComponent: () => import('./28-transcriber/transcriber.component').then(m => m.TranscriberComponent),      title: 'Audio Transcriber — Omni-Tool',    data: { category: 'ai' } },
  { path: 'watermark',      loadComponent: () => import('./29-watermark/watermark.component').then(m => m.AudioWatermarkComponent),      title: 'Audio Watermark — Omni-Tool',      data: { category: 'pro' } },
  { path: 'stem-splitter',  loadComponent: () => import('./30-stem-splitter/stem-splitter.component').then(m => m.StemSplitterComponent), title: 'AI Stem Splitter — Omni-Tool',     data: { category: 'ai' } },
  { path: '', redirectTo: 'recorder', pathMatch: 'full' }
];
