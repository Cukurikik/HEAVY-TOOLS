export function buildBassBoosterArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const g=(opts.gain as number)||10;const f=(opts.frequency as number)||100;return["-i",input,"-af","bass=g="+g+":f="+f,output];}
export function getBassBoosterOutputName():string{return"output.mp3";}
export function getBassBoosterMimeType():string{return"audio/mpeg";}
