export function buildWaveformVisualizerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-c","copy",output];}
export function getWaveformVisualizerOutputName():string{return"output.mp3";}
export function getWaveformVisualizerMimeType():string{return"audio/mpeg";}
