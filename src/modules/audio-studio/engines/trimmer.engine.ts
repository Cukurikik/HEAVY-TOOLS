export function buildTrimmerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const s=(opts.start as string)||"00:00:00";const e=(opts.end as string)||"00:00:10";return["-i",input,"-ss",s,"-to",e,"-c","copy",output];}
export function getTrimmerOutputName():string{return"output.mp3";}
export function getTrimmerMimeType():string{return"audio/mpeg";}
