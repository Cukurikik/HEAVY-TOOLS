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
    loadChildren: () => Promise.all([
      import('./01-recorder/recorder.component'),
      import('./01-recorder')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.RecorderComponent,
        providers: [provideState(s.recorderFeature)]
      }
    ]),
    title: 'Audio Recorder — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'trimmer', 
    loadChildren: () => Promise.all([
      import('./02-trimmer/trimmer.component'),
      import('./02-trimmer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TrimmerComponent,
        providers: [provideState(s.trimmerFeature)]
      }
    ]),
    title: 'Audio Trimmer — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'merger', 
    loadChildren: () => Promise.all([
      import('./03-merger/merger.component'),
      import('./03-merger')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.MergerComponent,
        providers: [provideState(s.mergerFeature)]
      }
    ]),
    title: 'Audio Merger — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'converter', 
    loadChildren: () => Promise.all([
      import('./04-converter/converter.component'),
      import('./04-converter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioConverterComponent,
        providers: [provideState(s.audioConverterFeature)]
      }
    ]),
    title: 'Format Converter — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'compressor', 
    loadChildren: () => Promise.all([
      import('./05-compressor/compressor.component'),
      import('./05-compressor')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.DynamicsCompressorComponent,
        providers: [provideState(s.dynamicsCompressorFeature)]
      }
    ]),
    title: 'Dynamics Compressor — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'equalizer', 
    loadChildren: () => Promise.all([
      import('./06-equalizer/equalizer.component'),
      import('./06-equalizer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.EqualizerComponent,
        providers: [provideState(s.equalizerFeature)]
      }
    ]),
    title: 'Equalizer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'pitch-shifter', 
    loadChildren: () => Promise.all([
      import('./07-pitch-shifter/pitch-shifter.component'),
      import('./07-pitch-shifter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.PitchShifterComponent,
        providers: [provideState(s.pitchShifterFeature)]
      }
    ]),
    title: 'Pitch Shifter — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'time-stretch', 
    loadChildren: () => Promise.all([
      import('./08-time-stretch/time-stretch.component'),
      import('./08-time-stretch')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TimeStretchComponent,
        providers: [provideState(s.timeStretchFeature)]
      }
    ]),
    title: 'Time Stretcher — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'normalizer', 
    loadChildren: () => Promise.all([
      import('./09-normalizer/normalizer.component'),
      import('./09-normalizer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.NormalizerComponent,
        providers: [provideState(s.normalizerFeature)]
      }
    ]),
    title: 'Audio Normalizer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'reverb', 
    loadChildren: () => Promise.all([
      import('./10-reverb/reverb.component'),
      import('./10-reverb')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ReverbComponent,
        providers: [provideState(s.reverbFeature)]
      }
    ]),
    title: 'Reverb & Room Sim — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'noise-remover', 
    loadChildren: () => Promise.all([
      import('./11-noise-remover/noise-remover.component'),
      import('./11-noise-remover')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.NoiseRemoverComponent,
        providers: [provideState(s.noiseRemoverFeature)]
      }
    ]),
    title: 'Noise Remover — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'splitter', 
    loadChildren: () => Promise.all([
      import('./12-splitter/splitter.component'),
      import('./12-splitter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioSplitterComponent,
        providers: [provideState(s.audioSplitterFeature)]
      }
    ]),
    title: 'Audio Splitter — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'metadata', 
    loadChildren: () => Promise.all([
      import('./13-metadata/metadata.component'),
      import('./13-metadata')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioMetadataComponent,
        providers: [provideState(s.audioMetadataFeature)]
      }
    ]),
    title: 'Metadata Editor — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'batch', 
    loadChildren: () => Promise.all([
      import('./14-batch/batch.component'),
      import('./14-batch')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioBatchComponent,
        providers: [provideState(s.audioBatchFeature)]
      }
    ]),
    title: 'Batch Processor — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'analyser', 
    loadChildren: () => Promise.all([
      import('./15-analyser/analyser.component'),
      import('./15-analyser')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioAnalyserComponent,
        providers: [provideState(s.audioAnalyserFeature)]
      }
    ]),
    title: 'Audio Analyser — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'reverser', 
    loadChildren: () => Promise.all([
      import('./16-reverser/reverser.component'),
      import('./16-reverser')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioReverserComponent,
        providers: [provideState(s.audioReverserFeature)]
      }
    ]),
    title: 'Audio Reverser — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'mixer', 
    loadChildren: () => Promise.all([
      import('./17-mixer/mixer.component'),
      import('./17-mixer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioMixerComponent,
        providers: [provideState(s.audioMixerFeature)]
      }
    ]),
    title: 'Multi-track Mixer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'fade', 
    loadChildren: () => Promise.all([
      import('./18-fade/fade.component'),
      import('./18-fade')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioFadeComponent,
        providers: [provideState(s.audioFadeFeature)]
      }
    ]),
    title: 'Fade In/Out — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'looper', 
    loadChildren: () => Promise.all([
      import('./19-looper/looper.component'),
      import('./19-looper')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioLooperComponent,
        providers: [provideState(s.audioLooperFeature)]
      }
    ]),
    title: 'Loop Creator — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'channel-mixer', 
    loadChildren: () => Promise.all([
      import('./20-channel-mixer/channel-mixer.component'),
      import('./20-channel-mixer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.ChannelMixerComponent,
        providers: [provideState(s.channelMixerFeature)]
      }
    ]),
    title: 'Channel Mixer — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'silence-remover',
    loadChildren: () => Promise.all([
      import('./21-silence-remover/silence-remover.component'),
      import('./21-silence-remover')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.SilenceRemoverComponent,
        providers: [provideState(s.silenceRemoverFeature)]
      }
    ]),
    title: 'Silence Remover — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'speed', 
    loadChildren: () => Promise.all([
      import('./22-speed/speed.component'),
      import('./22-speed')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioSpeedComponent,
        providers: [provideState(s.audioSpeedFeature)]
      }
    ]),
    title: 'Speed Changer — Omni-Tool', 
    data: { category: 'basic' } 
  },
  { 
    path: 'limiter', 
    loadChildren: () => Promise.all([
      import('./23-limiter/limiter.component'),
      import('./23-limiter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.LimiterComponent,
        providers: [provideState(s.limiterFeature)]
      }
    ]),
    title: 'Limiter & Maximizer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'stereo-widener', 
    loadChildren: () => Promise.all([
      import('./24-stereo-widener/stereo-widener.component'),
      import('./24-stereo-widener')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.StereoWidenerComponent,
        providers: [provideState(s.stereoWidenerFeature)]
      }
    ]),
    title: 'Stereo Widener — Omni-Tool', 
    data: { category: 'advanced' } 
  },
  { 
    path: 'voice-changer', 
    loadChildren: () => Promise.all([
      import('./25-voice-changer/voice-changer.component'),
      import('./25-voice-changer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.VoiceChangerComponent,
        providers: [provideState(s.voiceChangerFeature)]
      }
    ]),
    title: 'Voice Changer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'karaoke', 
    loadChildren: () => Promise.all([
      import('./26-karaoke/karaoke.component'),
      import('./26-karaoke')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.KaraokeComponent,
        providers: [provideState(s.karaokeFeature)]
      }
    ]),
    title: 'Karaoke / Vocal Remover — Omni-Tool', 
    data: { category: 'ai' } 
  },
  { 
    path: 'visualizer', 
    loadChildren: () => Promise.all([
      import('./27-visualizer/visualizer.component'),
      import('./27-visualizer')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioVisualizerComponent,
        providers: [provideState(s.audioVisualizerFeature)]
      }
    ]),
    title: 'Spectrum Visualizer — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'transcriber', 
    loadChildren: () => Promise.all([
      import('./28-transcriber/transcriber.component'),
      import('./28-transcriber')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.TranscriberComponent,
        providers: [provideState(s.transcriberFeature)]
      }
    ]),
    title: 'Audio Transcriber — Omni-Tool', 
    data: { category: 'ai' } 
  },
  { 
    path: 'watermark', 
    loadChildren: () => Promise.all([
      import('./29-watermark/watermark.component'),
      import('./29-watermark')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.AudioWatermarkComponent,
        providers: [provideState(s.audioWatermarkFeature)]
      }
    ]),
    title: 'Audio Watermark — Omni-Tool', 
    data: { category: 'pro' } 
  },
  { 
    path: 'stem-splitter', 
    loadChildren: () => Promise.all([
      import('./30-stem-splitter/stem-splitter.component'),
      import('./30-stem-splitter')
    ]).then(([c, s]) => [
      {
        path: '',
        component: c.StemSplitterComponent,
        providers: [provideState(s.stemSplitterFeature)]
      }
    ]),
    title: 'AI Stem Splitter — Omni-Tool', 
    data: { category: 'ai' } 
  }
];

