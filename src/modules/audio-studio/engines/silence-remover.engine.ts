export function buildSilenceRemoverArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const th=(opts.threshold as number)||-40;return["-i",input,"-af","silenceremove=start_periods=1:start_threshold="+th+"dB:detection=peak",output];}
export function getSilenceRemoverOutputName():string{return"output.mp3";}
export function getSilenceRemoverMimeType():string{return"audio/mpeg";}
