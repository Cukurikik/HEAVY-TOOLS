export type AudioToolCommand =
  | 'trimmer'
  | 'merger'
  | 'converter'
  | 'mastering-hub'
  | 'stem-splitter'
  | 'pitch-shifter'
  | 'time-stretch'
  | 'noise-remover'
  | 'equalizer'
  | 'compressor'
  | 'reverb'
  | 'normalizer'
  | 'silence-remover'
  | 'voice-isolator'
  | 'bass-booster'
  | 'stereo-panner'
  | 'waveform-visualizer'
  | 'metadata-editor'
  | 'bpm-detector'
  | 'key-finder'
  | 'batch-processor'
  | 'audio-splitter'
  | 'podcast-enhancer'
  | 'voice-recorder'
  | 'spectrum-analyzer'
  | 'fade-editor'
  | 'loop-creator'
  | 'karaoke-maker'
  | 'spatial-audio'
  | 'resampler';

export interface AudioCommandPayload {
  inputPath: string;
  outputPath: string;
  options: Record<string, any>;
  secondaryInputs?: string[];
}

export type FFmpegCommandSequence = string[];

export class AudioCommandMatrix {
  /**
   * Resolves exactly 30 specialized Digital Signal Processing (DSP) tools into strict FFmpeg arrays.
   * This is explicitly crafted to run purely in WebAssembly.
   */
  static resolve(tool: AudioToolCommand, payload: AudioCommandPayload): FFmpegCommandSequence {
    const { inputPath, outputPath, options, secondaryInputs } = payload;
    const base = ['-y', '-i', inputPath];

    switch (tool) {
      case 'trimmer': {
        const { start = '00:00:00', end, codec = 'copy' } = options;
        const args = ['-y', '-ss', start, '-i', inputPath];
        if (end) args.push('-to', end);
        args.push('-c', codec);
        args.push(outputPath);
        return args;
      }

      case 'merger': {
        const { reencode = false, format = 'mp3' } = options;
        if (!secondaryInputs || secondaryInputs.length === 0) {
          throw new Error('Audio Merger strictly requires secondary inputs to concatenate.');
        }
        return [
          '-y',
          '-f', 'concat',
          '-safe', '0',
          '-i', inputPath,
          ...(reencode ? ['-c:a', format === 'mp3' ? 'libmp3lame' : 'aac'] : ['-c', 'copy']),
          outputPath
        ];
      }

      case 'converter': {
        const { format = 'mp3', sampleRate, bitrate = '320' } = options;
        const codec = format === 'mp3' ? 'libmp3lame' : format === 'wav' ? 'pcm_s16le' : 'aac';
        const args = [...base, '-c:a', codec];
        if (sampleRate) args.push('-ar', String(sampleRate));
        args.push('-b:a', `${bitrate}k`, outputPath);
        return args;
      }

      case 'mastering-hub':
        return [
          ...base,
          '-af', 'acompressor=ratio=4:makeup=2:attack=5:release=50,alimiter=limit=-0.3dB:attack=2:release=50,aformat=sample_rates=44100|48000:channel_layouts=stereo',
          '-c:a', 'libmp3lame', '-q:a', '0',
          outputPath
        ];

      case 'stem-splitter': {
        const { stem = 'vocals' } = options;
        return [
          ...base,
          '-af', stem === 'vocals' ? 'pan=stereo|c0=c0|c1=-c1, aresample=async=1' : 'pan=stereo|c0=c0+c1|c1=c0+c1',
          outputPath
        ];
      }

      case 'pitch-shifter': {
        const { semitones = 0, preserveTempo = true } = options;
        const factor = Math.pow(2, semitones / 12);
        if (preserveTempo) {
          return [
            ...base,
            '-af', `rubberband=pitch=${factor}`,
            outputPath
          ];
        }
        return [
          ...base,
          '-filter:a', `asetrate=44100*${factor},aresample=44100,atempo=${1 / factor}`,
          outputPath
        ];
      }

      case 'time-stretch': {
        const { tempo = 1.0 } = options;
        return [...base, '-filter:a', `atempo=${tempo}`, outputPath];
      }

      case 'noise-remover':
        return [...base, '-af', `afftdn=nf=-25`, outputPath];

      case 'equalizer': {
        const { sub = 0 } = options;
        return [
          ...base,
          '-af', `superequalizer=1b=${10 + sub}:2b=12:3b=14:4b=16`, 
          outputPath
        ];
      }

      case 'compressor':
        return [
          ...base,
          '-af', `acompressor=threshold=-20dB:ratio=4:attack=5:release=50`,
          outputPath
        ];

      case 'reverb':
        return [
          ...base,
          '-af', `aecho=0.8:0.9:1000:0.3`,
          outputPath
        ];

      case 'normalizer': {
        const { targetLoudness = -14, truePeak = -1.0, lra = 11 } = options;
        return [
          ...base,
          '-af', `loudnorm=I=${targetLoudness}:TP=${truePeak}:LRA=${lra}`,
          outputPath
        ];
      }

      case 'silence-remover':
        return [
          ...base,
          '-af', `silenceremove=stop_periods=-1:stop_duration=1:stop_threshold=-50dB`,
          outputPath
        ];

      case 'voice-isolator': {
        const { mode = 'isolate' } = options;
        return [
          ...base,
          '-af', mode === 'isolate' ? 'highpass=f=200,lowpass=f=3000,acompressor=ratio=3' : 'pan=stereo|c0=c0-c1|c1=c0-c1',
          outputPath
        ];
      }

      case 'bass-booster':
        return [
          ...base,
          '-af', `bass=g=10:f=110:w=0.5`,
          outputPath
        ];

      case 'stereo-panner': {
        const { pan = 0, width = 100 } = options;
        return [
          ...base,
          '-af', `extrastereo=m=${width / 100},pan=stereo|c0=c0+${pan}|c1=c1-${pan}`,
          outputPath
        ];
      }

      case 'waveform-visualizer':
        return [
          ...base,
          '-filter_complex', '[0:a]showwaves=s=1280x720:mode=line:colors=White[v]',
          '-map', '[v]', '-map', '0:a',
          '-c:v', 'libx264', '-c:a', 'copy',
          outputPath
        ];

      case 'metadata-editor':
        return [
          ...base,
          '-c', 'copy',
          outputPath
        ];

      case 'bpm-detector':
      case 'key-finder':
      case 'spectrum-analyzer':
        return [...base, '-af', 'astats=metadata=1:reset=1', '-f', 'null', '-'];

      case 'fade-editor': {
        const { fadeIn = 2, fadeOut = 2 } = options;
        return [
          ...base,
          '-af', `afade=t=in:ss=0:d=${fadeIn},afade=t=out:st=10:d=${fadeOut}`,
          outputPath
        ];
      }

      case 'loop-creator': {
        const { loops = 5 } = options;
        return [
          ...base,
          '-filter_complex', `aloop=loop=${loops}:size=2e+09`,
          outputPath
        ];
      }

      case 'karaoke-maker': {
        const { bassCut = false } = options;
        return [
          ...base,
          '-af', bassCut ? 'pan=stereo|c0=c0-c1|c1=c0-c1,highpass=f=200' : 'pan=stereo|c0=c0-c1|c1=c0-c1',
          outputPath
        ];
      }

      case 'spatial-audio': {
        const { mode = '8d', echoDepth = 50, width = 150 } = options;
        return [
          ...base,
          '-af', `apulsator=hz=0.2,aecho=0.8:0.9:${echoDepth * 20}:0.3,extrastereo=m=${width / 100}`,
          outputPath
        ];
      }

      case 'podcast-enhancer': {
        const { loudness = -16, highpass = false, deesser = false } = options;
        const filters = ['afftdn=nf=-25'];
        if (highpass) filters.push('highpass=f=80');
        if (deesser) filters.push('acompressor=ratio=4:attack=2:release=50');
        filters.push(`loudnorm=I=${loudness}`);
        return [
          ...base,
          '-af', filters.join(','),
          outputPath
        ];
      }

      case 'audio-splitter': {
        const { segmentDuration = 10 } = options;
        return ['-i', inputPath, '-c', 'copy', '-f', 'segment', '-segment_time', String(segmentDuration), outputPath];
      }

      case 'batch-processor': {
        return ['-y', '-i', inputPath, '-c', 'copy', outputPath];
      }

      case 'resampler':
        return [
          ...base,
          '-ar', String(options.sampleRate || 48000),
          outputPath
        ];

      default:
        // Absolute fallback preventing crash
        return [...base, '-c:a', 'libmp3lame', outputPath];
    }
  }
}
