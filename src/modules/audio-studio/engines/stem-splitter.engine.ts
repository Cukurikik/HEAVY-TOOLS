export function buildStemSplitterArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-af","pan=stereo|c0=c0-c1|c1=c1-c0",output];}
export function getStemSplitterOutputName():string{return"output.mp3";}
export function getStemSplitterMimeType():string{return"audio/mpeg";}
