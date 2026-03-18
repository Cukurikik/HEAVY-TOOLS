export function buildReverbArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const d=(opts.delay as number)||60;const dc=(opts.decay as number)||0.4;return["-i",input,"-af","aecho=0.8:0.88:"+d+":"+dc,output];}
export function getReverbOutputName():string{return"output.mp3";}
export function getReverbMimeType():string{return"audio/mpeg";}
