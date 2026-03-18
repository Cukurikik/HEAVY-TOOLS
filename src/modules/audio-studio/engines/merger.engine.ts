export function buildMergerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-c","copy",output];}
export function getMergerOutputName():string{return"output.mp3";}
export function getMergerMimeType():string{return"audio/mpeg";}
