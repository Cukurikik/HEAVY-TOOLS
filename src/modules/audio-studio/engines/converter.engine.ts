export function buildConverterArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const f=(opts.format as string)||"mp3";return["-i",input,"-acodec",f==="mp3"?"libmp3lame":"pcm_s16le","output."+f];}
export function getConverterOutputName():string{return"output.mp3";}
export function getConverterMimeType():string{return"audio/mpeg";}
