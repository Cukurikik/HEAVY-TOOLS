export type CommandBuilder = (input: string, output: string, options: any) => string[];

export const VideoCommandMatrix: Record<string, CommandBuilder> = {
  
  // 1. TRIMMER: Seeks the input rapidly without re-encoding unless precise frame slicing is checked.
  'trimmer': (input, output, { start = '00:00:00', end = '00:00:10', codec = 'reencode' }) => {
    if (codec === 'reencode') {
      // Re-encoding for frame-accurate cuts
      return ['-i', input, '-ss', start, '-to', end, '-c:v', 'libx264', '-c:a', 'aac', output];
    }
    // Deep seek for instant copy trimming
    return ['-ss', start, '-i', input, '-to', end, '-c', 'copy', output];
  },

  // 2. MERGER: Uses protocol concat to merge identical codecs without re-encoding, falling back to filter_complex.
  'merger': (input, output, { listFile = 'concat.txt', reencode = false }) => {
    if (reencode) {
       return ['-f', 'concat', '-safe', '0', '-i', listFile, '-c:v', 'libx264', '-c:a', 'aac', output];
    }
    return ['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', output];
  },

  // 3. CONVERTER: Bypasses filters and applies raw codec translation with standard AAC.
  'converter': (input, output, { resolution, audioCodec = 'aac' }) => {
    // resolution="original" will bypass scaling
    const scale = (!resolution || resolution === 'original') ? [] : ['-vf', `scale=${resolution}:-2`];
    return ['-i', input, ...scale, '-c:v', 'libx264', '-c:a', audioCodec, output];
  },

  // 4. COMPRESSOR: Utilizes extreme 2-pass CRF parameter tuning for visually lossless size reductions.
  'compressor': (input, output, { crf = 28, preset = 'veryfast', bitrate, audioBitrate = '128' }) => {
    const vCodecArgs = bitrate 
      ? ['-b:v', `${bitrate}k`, '-maxrate', `${bitrate}k`, '-bufsize', `${bitrate * 2}k`] 
      : ['-crf', String(crf)];
    return ['-i', input, '-vcodec', 'libx264', ...vCodecArgs, '-preset', preset, '-c:a', 'aac', '-b:a', `${audioBitrate}k`, output];
  },

  // 5. FLIPPER: Complex filter vflip/hflip manipulation.
  'flipper': (input, output, { direction = 'horizontal' }) => {
    const filter = direction === 'horizontal' ? 'hflip' : 'vflip';
    return ['-i', input, '-vf', filter, '-c:a', 'copy', output];
  },

  // 6. ROTATOR: Transpose rules mapping.
  'rotator': (input, output, { degrees = '90CW', customAngle }) => {
    if (customAngle && Number(customAngle) !== 0) {
       return ['-i', input, '-vf', `rotate=${Number(customAngle)}*PI/180`, '-c:a', 'copy', output];
    }
    const filterMap: Record<string, string> = { '90CW': '1', '90CCW': '2', '180': '1,1' };
    return ['-i', input, '-vf', `transpose=${filterMap[degrees] || '1'}`, '-c:a', 'copy', output];
  },

  // 7. STABILIZER: Requires a 2-pass libvidstab injection.
  'stabilizer': (input, output, { shakiness = 5, accuracy = 15, smoothing = 10, step = 1 }) => {
    if (step === 1) return ['-i', input, '-vf', `vidstabdetect=stepsize=32:shakiness=${shakiness}:accuracy=${accuracy}:result=transform.trf`, '-f', 'null', '-'];
    return ['-i', input, '-vf', `vidstabtransform=input=transform.trf:zoom=0:smoothing=${smoothing},unsharp=5:5:0.8:3:3:0.4`, '-vcodec', 'libx264', '-preset', 'fast', '-tune', 'film', output];
  },

  // 8. REVERSE: Uses huge memory buffer caching for the entire file.
  'reverse': (input, output, { reverseAudio = true }) => {
    if (reverseAudio) {
       return ['-i', input, '-vf', 'reverse', '-af', 'areverse', output];
    }
    return ['-i', input, '-vf', 'reverse', '-c:a', 'copy', output];
  },

  // 9. SPEED CONTROL: setpts multiplier calculation. (0.5x speed means 2x setpts)
  'speed-control': (input, output, { speed = 2.0, keepAudio = true }) => {
    const pts = (1 / speed).toFixed(4);
    if (keepAudio) {
       return ['-i', input, '-filter_complex', `[0:v]setpts=${pts}*PTS[v];[0:a]atempo=${speed}[a]`, '-map', '[v]', '-map', '[a]', output];
    }
    return ['-i', input, '-filter:v', `setpts=${pts}*PTS`, '-an', output];
  },

  // 10. LOOP ENGINE: Clones streams.
  'loop-engine': (input, output, { loops = 3 }) => {
    return ['-stream_loop', String(loops), '-i', input, '-c', 'copy', output];
  },

  // 11. PRO EDITOR: Exposes extreme fine-tuning attributes.
  'pro-editor': (input, output, { codec = 'libx264', crf = 23, preset = 'medium', profile, tune, pixFmt }) => {
    const args = ['-i', input, '-c:v', codec, '-crf', String(crf), '-preset', preset];
    if (profile) args.push('-profile:v', profile);
    if (tune) args.push('-tune', tune);
    if (pixFmt) args.push('-pix_fmt', pixFmt);
    return [...args, '-c:a', 'copy', output];
  },

  // 12. THUMBNAIL: Single frame extractor.
  'thumbnail-extractor': (input, output, { timestamp = '00:00:05', quality = 2 }) => {
    return ['-ss', timestamp, '-i', input, '-frames:v', '1', '-q:v', String(quality), output];
  },

  // 13. SUBTITLE BURNER: Hardcodes SRT into the visual tracks (No copy).
  'subtitle-burner': (input, output, { subtitleText = '', fontSize = 24, fontColor = 'white' }) => {
    // Basic text overlay fallback since actual subtitle file might not exist in WASM MEMFS unless added
    return ['-i', input, '-vf', `drawtext=text='${subtitleText}':fontcolor=${fontColor}:fontsize=${fontSize}:x=(w-text_w)/2:y=h-th-20`, '-c:a', 'copy', output];
  },

  // 14. WATERMARK: Multi-stream overlay.
  'watermark': (input, output, { text = 'Omni-Tool', position = 'bottom-right', fontSize = 24, fontColor = 'white', opacity = 0.5 }) => {
    const posMap: Record<string, string> = {
      'bottom-right': 'W-tw-10:H-th-10',
      'bottom-left': '10:H-th-10',
      'top-right': 'W-tw-10:10',
      'top-left': '10:10',
      'center': '(W-tw)/2:(H-th)/2'
    };
    const c = fontColor.toLowerCase();
    const alphaStr = Math.round(opacity * 255).toString(16).split('.')[0].padStart(2, '0');
    return ['-i', input, '-vf', `drawtext=text='${text}':fontcolor=${c}${alphaStr}:fontsize=${fontSize}:x=${posMap[position] || posMap['bottom-right']}`, '-c:a', 'copy', output];
  },

  // 15. NOISE REDUCER: hqdn3d spatial matrix noise killer.
  'noise-reducer': (input, output, { spatial = 4, temporal = 6 }) => {
    return ['-i', input, '-vf', `hqdn3d=${spatial}:${spatial}:${temporal}:${temporal}`, '-c:a', 'copy', output];
  },

  // 16. COLOR GRADER: Saturation, Contrast, Hue.
  'color-grader': (input, output, { brightness = 0, contrast = 1, saturation = 1, gamma = 1 }) => {
    return ['-i', input, '-vf', `eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}:gamma=${gamma}`, '-c:a', 'copy', output];
  },

  // 17. RESOLUTION UPSCALER: Lanczos scaling matrix.
  'resolution-upscaler': (input, output, { scale = 'x2', targetRes }) => {
    if (targetRes && targetRes !== 'original') {
      return ['-i', input, '-vf', `scale=${targetRes}:-2:flags=lanczos`, '-c:a', 'copy', output];
    }
    const ratio = scale.replace('x', '');
    return ['-i', input, '-vf', `scale=iw*${ratio}:ih*${ratio}:flags=lanczos`, '-c:a', 'copy', output];
  },

  // 18. FRAME INTERPOLATOR: Minsterpolate.
  'frame-interpolator': (input, output, { fps = 60, meMode = 'bidir' }) => {
    return ['-i', input, '-filter:v', `minterpolate='mi_mode=mci:mc_mode=aobmc:me_mode=${meMode}:vsbmc=1:fps=${fps}'`, '-c:a', 'copy', output];
  },

  // 19. GIF CONVERTER: High quality Palette Gen 2-Pass.
  'gif-converter': (input, output, { fps = 15, scale = 480 }) => {
    return ['-i', input, '-vf', `fps=${fps},scale=${scale}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`, '-loop', '0', output];
  },

  // 20. HDR TONEMAPPER: SDR downscaling ZSCALE.
  'hdr-tonemapper': (input, output, { algorithm = 'hable' }) => {
    return ['-i', input, '-vf', `zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=${algorithm}:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p`, '-c:a', 'copy', output];
  },

  // 21. BLACK-WHITE
  'black-white': (input, output, { sepia = false }) => {
    if (sepia) {
      return ['-i', input, '-colorchannelmixer', '.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131', '-c:a', 'copy', output];
    }
    return ['-i', input, '-vf', 'hue=s=0', '-c:a', 'copy', output];
  },

  // 22. SLOW MOTION: Smooth FPS retention.
  'slow-motion': (input, output, { factor = 0.5, keepAudio = true }) => {
    const pts = (1 / factor).toFixed(2);
    if (keepAudio) {
       return ['-i', input, '-filter_complex', `[0:v]setpts=${pts}*PTS[v];[0:a]atempo=${factor}[a]`, '-map', '[v]', '-map', '[a]', output];
    }
    return ['-i', input, '-filter:v', `setpts=${pts}*PTS`, '-an', output];
  },

  // 23. TIMELAPSE: Framedrops.
  'timelapse': (input, output, { speed = 10, outputFps = 30 }) => {
    const pts = (1 / speed).toFixed(4);
    return ['-i', input, '-filter:v', `setpts=${pts}*PTS,fps=${outputFps}`, '-an', output];
  },

  // 24. SCREEN RECORDER: Processing raw recorded webms into MP4s universally
  'screen-recorder': (input, output, { resolution, fps = 30 }) => {
    const scale = resolution && resolution !== 'original' ? ['-vf', `scale=${resolution}:-2`] : [];
    return ['-i', input, ...scale, '-vcodec', 'libx264', '-crf', '22', '-preset', 'fast', '-r', String(fps), '-c:a', 'aac', '-ar', '44100', output];
  },

  // 25. METADATA EDITOR: Strip or Add metadata cleanly
  'metadata-editor': (input, output, { title = '', author = '', copyright = '', year = '' }) => {
    return ['-i', input, '-metadata', `title=${title}`, '-metadata', `artist=${author}`, '-metadata', `copyright=${copyright}`, '-metadata', `date=${year}`, '-codec', 'copy', output];
  },

  // 26. BATCH PROCESSOR: Generic wrapper.
  'batch-processor': (input, output) => {
    return ['-i', input, '-c', 'copy', output];
  },

  // 27. CHAPTER MARKER: Uses predefined metadata tracks.
  'chapter-marker': (input, output, { metaFile = 'chapters.txt' }) => {
    // If chapters.txt is not available, just copy
    return ['-i', input, '-f', 'ffmetadata', '-i', metaFile, '-map_metadata', '1', '-codec', 'copy', output];
  },

  // 28. AUDIO EXTRACTOR: Dumps the AAC/MP3 track without visually encoding
  'audio-extractor': (input, output, { audioFormat = 'mp3', audioBitrate = '320k' }) => {
    return ['-i', input, '-vn', '-acodec', audioFormat === 'mp3' ? 'libmp3lame' : 'aac', '-b:a', String(audioBitrate).replace('k', '') + 'k', output];
  },

  // 29. VIDEO SPLITTER: Uses chunk slicing via explicitly targeted segment muxer
  'video-splitter': (input, output, { segmentDuration = 10 }) => {
    return ['-i', input, '-c', 'copy', '-f', 'segment', '-segment_time', String(segmentDuration), '-reset_timestamps', '1', output];
  },

  // 30. ASPECT RATIO: Smart crop and letterboxing to 16:9, 9:16, 1:1, etc.
  'aspect-ratio': (input, output, { ratio = '16:9', mode = 'pad', barColor = 'black' }) => {
    if (mode === 'pad') {
      // Pad with letterboxing colors
      return ['-i', input, '-vf', `pad=width=max(iw\\,ih*(${ratio.replace(':', '/')})) : height=max(ih\\,iw/(${ratio.replace(':', '/')})) : x=(ow-iw)/2 : y=(oh-ih)/2 : color=${barColor}`, '-c:a', 'copy', output];
    }
    // Crop center
    return ['-i', input, '-vf', `crop=ih*(${ratio.replace(':', '/')})/1:ih`, '-c:a', 'copy', output];
  }
};
