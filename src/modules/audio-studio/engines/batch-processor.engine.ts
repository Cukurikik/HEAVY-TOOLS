export function buildBatchProcessorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const op=(opts.batchOperation as string)||"normalize";if(op==="normalize")return["-i",input,"-af","loudnorm=I=-16:TP=-1.5:LRA=11",output];return["-i",input,"-acodec","libmp3lame","-q:a","2",output];}
export function getBatchProcessorOutputName():string{return"output.mp3";}
export function getBatchProcessorMimeType():string{return"audio/mpeg";}
