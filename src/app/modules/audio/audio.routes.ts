// ============================================================
// AUDIO ROUTES — All 30 features registered
// File: src/app/modules/audio/audio.routes.ts
// ============================================================

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { recorderFeature } from './01-recorder';
import { trimmerFeature } from './02-trimmer';
import { mergerFeature } from './03-merger';
import { audioConverterFeature } from './04-converter';
import { dynamicsCompressorFeature } from './05-compressor';
import { equalizerFeature } from './06-equalizer';
import { pitchShifterFeature } from './07-pitch-shifter';
import { timeStretchFeature } from './08-time-stretch';
import { normalizerFeature } from './09-normalizer';
import { reverbFeature } from './10-reverb';
import { noiseRemoverFeature } from './11-noise-remover';
import { audioSplitterFeature } from './12-splitter';
import { audioMetadataFeature } from './13-metadata';
import { audioBatchFeature } from './14-batch';
import { audioAnalyserFeature } from './15-analyser';
import { audioReverserFeature } from './16-reverser';
import { audioMixerFeature } from './17-mixer';
import { audioFadeFeature } from './18-fade';
import { audioLooperFeature } from './19-looper';
import { channelMixerFeature } from './20-channel-mixer';
import { silenceRemoverFeature } from './21-silence-remover';
import { audioSpeedFeature } from './22-speed';
import { limiterFeature } from './23-limiter';
import { stereoWidenerFeature } from './24-stereo-widener';
import { voiceChangerFeature } from './25-voice-changer';
import { karaokeFeature } from './26-karaoke';
import { audioVisualizerFeature } from './27-visualizer';
import { transcriberFeature } from './28-transcriber';
import { audioWatermarkFeature } from './29-watermark';
import { stemSplitterFeature } from './30-stem-splitter';

export const AUDIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./audio.component').then(m => m.AudioComponent),
    title: 'Audio Studio — Omni-Tool'
  },
  { 
    path: 'recorder', 
    loadComponent: () => import('./01-recorder/recorder.component').then(m => m.RecorderComponent),
    providers: [provideState(recorderFeature)],
    title: 'Audio Recorder — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'trimmer', 
    loadComponent: () => import('./02-trimmer/trimmer.component').then(m => m.TrimmerComponent),
    providers: [provideState(trimmerFeature)],
    title: 'Audio Trimmer — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'merger', 
    loadComponent: () => import('./03-merger/merger.component').then(m => m.MergerComponent),
    providers: [provideState(mergerFeature)],
    title: 'Audio Merger — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'converter', 
    loadComponent: () => import('./04-converter/converter.component').then(m => m.AudioConverterComponent),
    providers: [provideState(audioConverterFeature)],
    title: 'Format Converter — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'compressor', 
    loadComponent: () => import('./05-compressor/compressor.component').then(m => m.DynamicsCompressorComponent),
    providers: [provideState(dynamicsCompressorFeature)],
    title: 'Dynamics Compressor — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'equalizer', 
    loadComponent: () => import('./06-equalizer/equalizer.component').then(m => m.EqualizerComponent),
    providers: [provideState(equalizerFeature)],
    title: 'Equalizer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'pitch-shifter', 
    loadComponent: () => import('./07-pitch-shifter/pitch-shifter.component').then(m => m.PitchShifterComponent),
    providers: [provideState(pitchShifterFeature)],
    title: 'Pitch Shifter — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'time-stretch', 
    loadComponent: () => import('./08-time-stretch/time-stretch.component').then(m => m.TimeStretchComponent),
    providers: [provideState(timeStretchFeature)],
    title: 'Time Stretcher — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'normalizer', 
    loadComponent: () => import('./09-normalizer/normalizer.component').then(m => m.NormalizerComponent),
    providers: [provideState(normalizerFeature)],
    title: 'Audio Normalizer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'reverb', 
    loadComponent: () => import('./10-reverb/reverb.component').then(m => m.ReverbComponent),
    providers: [provideState(reverbFeature)],
    title: 'Reverb & Room Sim — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'noise-remover', 
    loadComponent: () => import('./11-noise-remover/noise-remover.component').then(m => m.NoiseRemoverComponent),
    providers: [provideState(noiseRemoverFeature)],
    title: 'Noise Remover — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'splitter', 
    loadComponent: () => import('./12-splitter/splitter.component').then(m => m.AudioSplitterComponent),
    providers: [provideState(audioSplitterFeature)],
    title: 'Audio Splitter — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'metadata', 
    loadComponent: () => import('./13-metadata/metadata.component').then(m => m.AudioMetadataComponent),
    providers: [provideState(audioMetadataFeature)],
    title: 'Metadata Editor — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'batch', 
    loadComponent: () => import('./14-batch/batch.component').then(m => m.AudioBatchComponent),
    providers: [provideState(audioBatchFeature)],
    title: 'Batch Processor — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'analyser', 
    loadComponent: () => import('./15-analyser/analyser.component').then(m => m.AudioAnalyserComponent),
    providers: [provideState(audioAnalyserFeature)],
    title: 'Audio Analyser — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'reverser', 
    loadComponent: () => import('./16-reverser/reverser.component').then(m => m.AudioReverserComponent),
    providers: [provideState(audioReverserFeature)],
    title: 'Audio Reverser — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'mixer', 
    loadComponent: () => import('./17-mixer/mixer.component').then(m => m.AudioMixerComponent),
    providers: [provideState(audioMixerFeature)],
    title: 'Multi-track Mixer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'fade', 
    loadComponent: () => import('./18-fade/fade.component').then(m => m.AudioFadeComponent),
    providers: [provideState(audioFadeFeature)],
    title: 'Fade In/Out — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'looper', 
    loadComponent: () => import('./19-looper/looper.component').then(m => m.AudioLooperComponent),
    providers: [provideState(audioLooperFeature)],
    title: 'Loop Creator — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'channel-mixer', 
    loadComponent: () => import('./20-channel-mixer/channel-mixer.component').then(m => m.ChannelMixerComponent),
    providers: [provideState(channelMixerFeature)],
    title: 'Channel Mixer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'silence-remover',
    loadComponent: () => import('./21-silence-remover/silence-remover.component').then(m => m.SilenceRemoverComponent),
    providers: [provideState(silenceRemoverFeature)],
    title: 'Silence Remover — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'speed', 
    loadComponent: () => import('./22-speed/speed.component').then(m => m.AudioSpeedComponent),
    providers: [provideState(audioSpeedFeature)],
    title: 'Speed Changer — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'limiter', 
    loadComponent: () => import('./23-limiter/limiter.component').then(m => m.LimiterComponent),
    providers: [provideState(limiterFeature)],
    title: 'Limiter & Maximizer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'stereo-widener', 
    loadComponent: () => import('./24-stereo-widener/stereo-widener.component').then(m => m.StereoWidenerComponent),
    providers: [provideState(stereoWidenerFeature)],
    title: 'Stereo Widener — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'voice-changer', 
    loadComponent: () => import('./25-voice-changer/voice-changer.component').then(m => m.VoiceChangerComponent),
    providers: [provideState(voiceChangerFeature)],
    title: 'Voice Changer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'karaoke', 
    loadComponent: () => import('./26-karaoke/karaoke.component').then(m => m.KaraokeComponent),
    providers: [provideState(karaokeFeature)],
    title: 'Karaoke / Vocal Remover — Omni-Tool', 
    data: { category: 'ai' } 
  },
  { 
    path: 'visualizer', 
    loadComponent: () => import('./27-visualizer/visualizer.component').then(m => m.AudioVisualizerComponent),
    providers: [provideState(audioVisualizerFeature)],
    title: 'Spectrum Visualizer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'transcriber', 
    loadComponent: () => import('./28-transcriber/transcriber.component').then(m => m.TranscriberComponent),
    providers: [provideState(transcriberFeature)],
    title: 'Audio Transcriber — Omni-Tool', 
    data: { category: 'ai' } 
  },
  { 
    path: 'watermark', 
    loadComponent: () => import('./29-watermark/watermark.component').then(m => m.AudioWatermarkComponent),
    providers: [provideState(audioWatermarkFeature)],
    title: 'Audio Watermark — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'stem-splitter', 
    loadComponent: () => import('./30-stem-splitter/stem-splitter.component').then(m => m.StemSplitterComponent),
    providers: [provideState(stemSplitterFeature)],
    title: 'AI Stem Splitter — Omni-Tool', 
    data: { category: 'ai' } 
  }
];

