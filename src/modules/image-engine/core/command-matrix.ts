/**
 * Omni-Tool Image Engine Core: Command Matrix (Phase 23 Enterprise Architecture)
 * 
 * SANGAT FUNDAMENTAL & ENTERPRISE GRADE:
 * This mapping transforms 30 Image GUI options into explicit FFmpeg filter chains.
 * It leverages the exact same WebAssembly isolation core used by Video-Engine for memory safety.
 *
 * NOTE: Tools like b64-encoder, color-picker, or ONNX upscalers are routed directly
 * to native Web APIs / ONNX pipelines in the useImageStore orchestrator.
 */

export type ImageCommandBuilder = (inputPath: string, outputPath: string, options: any) => string[];

export const ImageCommandMatrix: Record<string, ImageCommandBuilder> = {

  // 1. CONVERTER: Seamless translation of PNG -> WEBP, JPG -> AVIF, etc.
  'converter': (input, output, { format = 'webp', quality = 90 }) => {
    return ['-i', input, '-q:v', String(Math.floor((100 - quality) / 2)), output]; 
  },

  // 2. COMPRESSOR: Lossy or Lossless weight reduction via specific codecs
  'compressor': (input, output, { level = 80 }) => {
    // level 80 means roughly qscale ~5 
    return ['-i', input, '-q:v', String(Math.floor((100 - level) / 3)), '-lossless', '0', output];
  },

  // 3. CROPPER: Smart crop X/Y dimensions
  'cropper': (input, output, { w = 500, h = 500, x = 0, y = 0 }) => {
    return ['-i', input, '-vf', `crop=${w}:${h}:${x}:${y}`, output];
  },

  // 4. RESIZER: Absolute dimensions or percentage scalars
  'resizer': (input, output, { width = -1, height = 1080 }) => {
    return ['-i', input, '-vf', `scale=${width}:${height}:flags=lanczos`, output];
  },

  // 5. WATERMARK: Alpha-blended overlay matrix
  'watermark': (input, output, { logoFile = 'logo.png', position = 'W-w-10:H-h-10', opacity = 0.5 }) => {
    return ['-i', input, '-i', logoFile, '-filter_complex', `[1]format=rgba,colorchannelmixer=aa=${opacity}[logo];[0][logo]overlay=${position}`, output];
  },

  // 6. BACKGROUND REMOVER: (Handled by ONNX Engine. Placeholder for FFmpeg pass-through)
  'background-remover': (input, output) => {
    return ['-i', input, output];
  },

  // 7. UPSCALER: (Handled by ONNX RealESRGAN. Placeholder for FFmpeg spline upscale)
  'upscaler': (input, output, { scale = 2 }) => {
    return ['-i', input, '-vf', `scale=iw*${scale}:ih*${scale}:flags=lanczos`, output];
  },

  // 8. FILTERS: Color grading arrays
  'filters': (input, output, { type = 'sepia' }) => {
    const filterMap: Record<string, string> = {
      'sepia': 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
      'vintage': 'curves=vintage',
      'negative': 'negate',
      'warm': 'colorbalance=rs=.2',
      'cool': 'colorbalance=bs=.2'
    };
    return ['-i', input, '-vf', filterMap[type] || filterMap['sepia'], output];
  },

  // 9. METADATA: EXIF injection or stripping
  'metadata': (input, output, { strip = true, copyright = '' }) => {
    if (strip) return ['-i', input, '-map_metadata', '-1', output];
    return ['-i', input, '-metadata', `copyright=${copyright}`, output];
  },

  // 10. COLOR PICKER: (Pure Native/Canvas tool. Fallback passthrough)
  'color-picker': (i, o) => ['-i', i, o],

  // 11. BLUR: Heavy gaussian pixel manipulation
  'blur': (input, output, { radius = 10 }) => {
    return ['-i', input, '-vf', `gblur=sigma=${radius}`, output];
  },

  // 12. SHARPEN: Unsharp masking matrix
  'sharpen': (input, output, { amount = 1.5 }) => {
    return ['-i', input, '-vf', `unsharp=5:5:${amount}:5:5:0.0`, output];
  },

  // 13. NOISE REDUCTION: Hqdn3D smoothing pass
  'noise-reduction': (input, output, { strength = 4 }) => {
    return ['-i', input, '-vf', `hqdn3d=${strength}:${strength}:5:5`, output];
  },

  // 14. BLACK AND WHITE: Total saturation wipe
  'black-and-white': (input, output) => {
    return ['-i', input, '-vf', 'format=gray', output];
  },

  // 15. COLLAGE: Grid formation (Assume 2 inputs statically for this matrix signature)
  'collage': (input, output, { input2 = 'image2.png' }) => {
    return ['-i', input, '-i', input2, '-filter_complex', 'hstack', output];
  },

  // 16. SPRITESHEET: Tile sequence grid
  'spritesheet': (input, output, { grid = '4x4' }) => {
    return ['-i', input, '-vf', `tile=${grid}`, output];
  },

  // 17. GIF MAKER: Palette optimization for sequence to GIF
  'gif-maker': (input, output, { fps = 15 }) => {
    return ['-i', input, '-vf', `fps=${fps},split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, output];
  },

  // 18. ICO CONVERTER: Multi-res Favicons
  'ico-converter': (input, output, { sizes = '16,32,64' }) => {
    return ['-i', input, '-vf', `scale=256:256`, output]; // FFmpeg handles ICO scaling automatically depending on format
  },

  // 19. B64 ENCODER: (Native Browser API logic. Passthrough)
  'b64-encoder': (i, o) => ['-i', i, o],

  // 20. SVG OPTIMIZER: (Native svgo logic. Passthrough)
  'svg-optimizer': (i, o) => ['-i', i, o],

  // 21. PDF TO IMAGE: (Often handled natively using PDF.js. FFmpeg fallback)
  'pdf-to-image': (i, o) => ['-i', i, o],

  // 22. IMAGE TO PDF: Direct mapping into generic PDF container
  'image-to-pdf': (i, o) => ['-i', i, o],

  // 23. COLOR REPLACE: Chomakey extraction + recoloring
  'color-replace': (input, output, { hexTarget = '#00FF00', similarity = 0.1 }) => {
    return ['-i', input, '-vf', `chromakey=${hexTarget}:${similarity}:0.2`, output];
  },

  // 24. MEME GENERATOR: Drawtext layout
  'meme-generator': (input, output, { topText = 'TOP', bottomText = 'BOTTOM' }) => {
    return ['-i', input, '-vf', `drawtext=text='${topText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=10:borderw=2:bordercolor=black,drawtext=text='${bottomText}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=h-th-10:borderw=2:bordercolor=black`, output];
  },

  // 25. SPLIT: Crop mapping into tiles (Returns primary tile if unsupported)
  'split': (input, output, { parts = 2 }) => {
    return ['-i', input, '-vf', `crop=iw/${parts}:ih:0:0`, output]; 
  },

  // 26. ROTATE FLIP: Hard orientation reset
  'rotate-flip': (input, output, { angle = 90 }) => {
    const rot = angle === 90 ? '1' : angle === 180 ? '1,1' : '2';
    return ['-i', input, '-vf', `transpose=${rot}`, output];
  },

  // 27. HDR: Curves lifting
  'hdr': (input, output) => {
    return ['-i', input, '-vf', 'curves=m=0/0 0.5/0.8 1/1', output];
  },

  // 28. GLITCH: RGB split databending logic
  'glitch': (input, output, { offset = 10 }) => {
    return ['-i', input, '-filter_complex', `split=3[r][g][b];[r]lutrgb=g=0:b=0,crop=iw-${offset}:ih:0:0,pad=iw+${offset}:ih:${offset}:0[r2];[g]lutrgb=r=0:b=0[g2];[b]lutrgb=r=0:g=0,crop=iw-${offset}:ih:${offset}:0,pad=iw+${offset}:ih:0:0[b2];[r2][g2]blend=all_mode='addition'[rg];[rg][b2]blend=all_mode='addition'`, output];
  },

  // 29. PIXELATE: Safe downscale/upscale without interpolation
  'pixelate': (input, output, { size = 10 }) => {
    return ['-i', input, '-vf', `scale=iw/${size}:-1,scale=iw*${size}:-1:flags=neighbor`, output];
  },

  // 30. BATCH RENAME: (Native logic. Passthrough)
  'batch-rename': (i, o) => ['-i', i, o]

};
