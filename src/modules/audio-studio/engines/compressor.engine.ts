export function buildCompressorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const th=(opts.threshold as number)||-20;const r=(opts.ratio as number)||4;return["-i",input,"-af","acompressor=threshold="+th+"dB:ratio="+r+":attack=5:release=50",output];}
export function getCompressorOutputName():string{return"output.mp3";}
export function getCompressorMimeType():string{return"audio/mpeg";}
