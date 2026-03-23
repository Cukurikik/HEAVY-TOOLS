/**
 * 55. FFmpeg Parameter Mapper (GCP)
 * Translates UI settings (Zod options) into specific instructions for the
 * FFmpeg instances running inside Firebase Cloud Functions.
 */
export function mapToFirebaseParams(operation: string, options: any) {
  const params: any = {
    taskType: operation,
    crf: options?.crf || 23,
    preset: options?.preset || 'fast'
  };

  if (operation === 'compressor') {
    params.targetBitrate = options?.bitrate || '1M';
  } else if (operation === 'converter') {
    params.targetFormat = options?.format || 'mp4';
    params.videoCodec = options?.codec || 'libx264';
    params.audioCodec = options?.audioCodec || 'aac';
  } else if (operation === 'audio-extractor') {
    params.targetFormat = 'mp3';
    params.audioBitrate = options?.audioBitrate || '192k';
  }

  return params;
}
