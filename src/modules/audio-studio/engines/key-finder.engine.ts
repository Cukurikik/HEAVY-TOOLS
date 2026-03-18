export function buildKeyFinderArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-c","copy",output];}
export function getKeyFinderOutputName():string{return"output.mp3";}
export function getKeyFinderMimeType():string{return"audio/mpeg";}
