export function buildBpmDetectorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-c","copy",output];}
export function getBpmDetectorOutputName():string{return"output.mp3";}
export function getBpmDetectorMimeType():string{return"audio/mpeg";}
