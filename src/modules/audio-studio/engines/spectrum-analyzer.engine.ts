export function buildSpectrumAnalyzerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-c","copy",output];}
export function getSpectrumAnalyzerOutputName():string{return"output.mp3";}
export function getSpectrumAnalyzerMimeType():string{return"audio/mpeg";}
