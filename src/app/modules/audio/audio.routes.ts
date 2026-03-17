// ============================================================
// AUDIO ROUTES — All 30 features registered
// File: src/app/modules/audio/audio.routes.ts
// ============================================================

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';

export const AUDIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./audio.component').then(m => m.AudioComponent),
    title: 'Audio Studio — Omni-Tool'
  },
  { 
    path: 'recorder', 
    loadComponent: () => import('./01-recorder/recorder.component').then(m => m.RecorderComponent),
    providers: [provideState(import('./01-recorder').then(m => m.recorderFeature))],
    title: 'Audio Recorder — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'trimmer', 
    loadComponent: () => import('./02-trimmer/trimmer.component').then(m => m.TrimmerComponent),
    providers: [provideState(import('./02-trimmer').then(m => m.trimmerFeature))],
    title: 'Audio Trimmer — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'merger', 
    loadComponent: () => import('./03-merger/merger.component').then(m => m.MergerComponent),
    providers: [provideState(import('./03-merger').then(m => m.mergerFeature))],
    title: 'Audio Merger — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'converter', 
    loadComponent: () => import('./04-converter/converter.component').then(m => m.AudioConverterComponent),
    providers: [provideState(import('./04-converter').then(m => m.audioConverterFeature))],
    title: 'Format Converter — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'compressor', 
    loadComponent: () => import('./05-compressor/compressor.component').then(m => m.DynamicsCompressorComponent),
    providers: [provideState(import('./05-compressor').then(m => m.compressorFeature))],
    title: 'Dynamics Compressor — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'equalizer', 
    loadComponent: () => import('./06-equalizer/equalizer.component').then(m => m.EqualizerComponent),
    providers: [provideState(import('./06-equalizer').then(m => m.equalizerFeature))],
    title: 'Equalizer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'pitch-shifter', 
    loadComponent: () => import('./07-pitch-shifter/pitch-shifter.component').then(m => m.PitchShifterComponent),
    providers: [provideState(import('./07-pitch-shifter').then(m => m.pitchShifterFeature))],
    title: 'Pitch Shifter — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'time-stretch', 
    loadComponent: () => import('./08-time-stretch/time-stretch.component').then(m => m.TimeStretchComponent),
    providers: [provideState(import('./08-time-stretch').then(m => m.timeStretchFeature))],
    title: 'Time Stretcher — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'normalizer', 
    loadComponent: () => import('./09-normalizer/normalizer.component').then(m => m.NormalizerComponent),
    providers: [provideState(import('./09-normalizer').then(m => m.normalizerFeature))],
    title: 'Audio Normalizer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'reverb', 
    loadComponent: () => import('./10-reverb/reverb.component').then(m => m.ReverbComponent),
    providers: [provideState(import('./10-reverb').then(m => m.reverbFeature))],
    title: 'Reverb & Room Sim — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'noise-remover', 
    loadComponent: () => import('./11-noise-remover/noise-remover.component').then(m => m.NoiseRemoverComponent),
    providers: [provideState(import('./11-noise-remover').then(m => m.noiseRemoverFeature))],
    title: 'Noise Remover — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'splitter', 
    loadComponent: () => import('./12-splitter/splitter.component').then(m => m.AudioSplitterComponent),
    providers: [provideState(import('./12-splitter').then(m => m.audioSplitterFeature))],
    title: 'Audio Splitter — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'metadata', 
    loadComponent: () => import('./13-metadata/metadata.component').then(m => m.AudioMetadataComponent),
    providers: [provideState(import('./13-metadata').then(m => m.audioMetadataFeature))],
    title: 'Metadata Editor — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'batch', 
    loadComponent: () => import('./14-batch/batch.component').then(m => m.AudioBatchComponent),
    providers: [provideState(import('./14-batch').then(m => m.audioBatchFeature))],
    title: 'Batch Processor — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'analyser', 
    loadComponent: () => import('./15-analyser/analyser.component').then(m => m.AudioAnalyserComponent),
    providers: [provideState(import('./15-analyser').then(m => m.audioAnalyserFeature))],
    title: 'Audio Analyser — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'reverser', 
    loadComponent: () => import('./16-reverser/reverser.component').then(m => m.AudioReverserComponent),
    providers: [provideState(import('./16-reverser').then(m => m.audioReverserFeature))],
    title: 'Audio Reverser — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'mixer', 
    loadComponent: () => import('./17-mixer/mixer.component').then(m => m.AudioMixerComponent),
    providers: [provideState(import('./17-mixer').then(m => m.audioMixerFeature))],
    title: 'Multi-track Mixer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'fade', 
    loadComponent: () => import('./18-fade/fade.component').then(m => m.AudioFadeComponent),
    providers: [provideState(import('./18-fade').then(m => m.audioFadeFeature))],
    title: 'Fade In/Out — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'looper', 
    loadComponent: () => import('./19-looper/looper.component').then(m => m.AudioLooperComponent),
    providers: [provideState(import('./19-looper').then(m => m.audioLooperFeature))],
    title: 'Loop Creator — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'channel-mixer', 
    loadComponent: () => import('./20-channel-mixer/channel-mixer.component').then(m => m.ChannelMixerComponent),
    providers: [provideState(import('./20-channel-mixer').then(m => m.channelMixerFeature))],
    title: 'Channel Mixer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'silence-remover',
    loadComponent: () => import('./21-silence-remover/silence-remover.component').then(m => m.SilenceRemoverComponent),
    providers: [provideState(import('./21-silence-remover').then(m => m.silenceRemoverFeature))],
    title: 'Silence Remover — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'speed', 
    loadComponent: () => import('./22-speed/speed.component').then(m => m.AudioSpeedComponent),
    providers: [provideState(import('./22-speed').then(m => m.audioSpeedFeature))],
    title: 'Speed Changer — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'limiter', 
    loadComponent: () => import('./23-limiter/limiter.component').then(m => m.LimiterComponent),
    providers: [provideState(import('./23-limiter').then(m => m.limiterFeature))],
    title: 'Limiter & Maximizer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'stereo-widener', 
    loadComponent: () => import('./24-stereo-widener/stereo-widener.component').then(m => m.StereoWidenerComponent),
    providers: [provideState(import('./24-stereo-widener').then(m => m.stereoWidenerFeature))],
    title: 'Stereo Widener — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'voice-changer', 
    loadComponent: () => import('./25-voice-changer/voice-changer.component').then(m => m.VoiceChangerComponent),
    providers: [provideState(import('./25-voice-changer').then(m => m.voiceChangerFeature))],
    title: 'Voice Changer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'karaoke', 
    loadComponent: () => import('./26-karaoke/karaoke.component').then(m => m.KaraokeComponent),
    providers: [provideState(import('./26-karaoke').then(m => m.karaokeFeature))],
    title: 'Karaoke / Vocal Remover — Omni-Tool', 
    data: { category: 'ai' } 
  },
  { 
    path: 'visualizer', 
    loadComponent: () => import('./27-visualizer/visualizer.component').then(m => m.AudioVisualizerComponent),
    providers: [provideState(import('./27-visualizer').then(m => m.audioVisualizerFeature))],
    title: 'Spectrum Visualizer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'transcriber', 
    loadComponent: () => import('./28-transcriber/transcriber.component').then(m => m.TranscriberComponent),
    providers: [provideState(import('./28-transcriber').then(m => m.transcriberFeature))],
    title: 'Audio Transcriber — Omni-Tool', 
    data: { category: 'ai' } 
  },
  { 
    path: 'watermark', 
    loadComponent: () => import('./29-watermark/watermark.component').then(m => m.AudioWatermarkComponent),
    providers: [provideState(import('./29-watermark').then(m => m.audioWatermarkFeature))],
    title: 'Audio Watermark — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'stem-splitter', 
    loadComponent: () => import('./30-stem-splitter/stem-splitter.component').then(m => m.StemSplitterComponent),
    providers: [provideState(import('./30-stem-splitter').then(m => m.stemSplitterFeature))],
    title: 'AI Stem Splitter — Omni-Tool', 
    data: { category: 'ai' } 
  }
];

