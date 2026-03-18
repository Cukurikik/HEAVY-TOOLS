export function buildKaraokeMakerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-af","pan=stereo|c0=c0-c1|c1=c1-c0",output];}
export function getKaraokeMakerOutputName():string{return"output.mp3";}
export function getKaraokeMakerMimeType():string{return"audio/mpeg";}
