export function buildVoiceIsolatorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-af","pan=stereo|c0=c0-c1|c1=c1-c0",output];}
export function getVoiceIsolatorOutputName():string{return"output.mp3";}
export function getVoiceIsolatorMimeType():string{return"audio/mpeg";}
