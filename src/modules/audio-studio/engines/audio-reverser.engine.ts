export function buildAudioReverserArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-af","areverse",output];}
export function getAudioReverserOutputName():string{return"output.mp3";}
export function getAudioReverserMimeType():string{return"audio/mpeg";}
