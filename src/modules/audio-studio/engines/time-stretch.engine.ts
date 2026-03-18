export function buildTimeStretchArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const t=(opts.tempo as number)||1.0;return["-i",input,"-af","atempo="+Math.min(Math.max(t,0.5),2.0),output];}
export function getTimeStretchOutputName():string{return"output.mp3";}
export function getTimeStretchMimeType():string{return"audio/mpeg";}
