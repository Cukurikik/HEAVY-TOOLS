export function buildAudioSplitterArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const d=(opts.segmentDuration as number)||30;return["-i",input,"-f","segment","-segment_time",d.toString(),"-c","copy","segment_%03d.mp3"];}
export function getAudioSplitterOutputName():string{return"output.mp3";}
export function getAudioSplitterMimeType():string{return"audio/mpeg";}
