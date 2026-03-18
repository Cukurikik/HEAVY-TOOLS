export function buildNormalizerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const t=(opts.targetLoudness as number)||-16;return["-i",input,"-af","loudnorm=I="+t+":TP=-1.5:LRA=11",output];}
export function getNormalizerOutputName():string{return"output.mp3";}
export function getNormalizerMimeType():string{return"audio/mpeg";}
