export function buildNoiseRemoverArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const n=(opts.noiseReduction as number)||12;return["-i",input,"-af","afftdn=nf=-"+n,output];}
export function getNoiseRemoverOutputName():string{return"output.mp3";}
export function getNoiseRemoverMimeType():string{return"audio/mpeg";}
