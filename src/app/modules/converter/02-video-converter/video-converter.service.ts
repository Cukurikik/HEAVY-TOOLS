import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VideoConverterService {
  buildFFmpegArgs(config: { outputFormat: string; crf: number; encodingSpeed: string; resolution: string }): string[] {
    const args = ['-i', 'input'];
    if (config.outputFormat === 'webm') {
      args.push('-c:v', 'libvpx-vp9', '-c:a', 'libopus');
    } else if (config.outputFormat === 'gif') {
      args.push('-vf', 'fps=10,scale=320:-1');
    } else {
      args.push('-c:v', 'libx264', '-c:a', 'aac', '-preset', config.encodingSpeed, '-crf', String(config.crf));
    }
    if (config.resolution && config.resolution !== 'original') {
      args.push('-vf', `scale=${config.resolution}`);
    }
    args.push(`output.${config.outputFormat}`);
    return args;
  }

  estimateOutputSize(durationSec: number, bitrate: number): number {
    return (durationSec * bitrate) / 8 / 1_048_576;
  }

  parseFFmpegProgress(stderr: string, totalFrames: number): number {
    const match = stderr.match(/frame=\s*(\d+)/);
    if (match && totalFrames > 0) return Math.min(100, (parseInt(match[1], 10) / totalFrames) * 100);
    return 0;
  }
}
