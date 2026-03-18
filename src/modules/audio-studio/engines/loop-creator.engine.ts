export function buildLoopCreatorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const l=(opts.loops as number)||3;return["-stream_loop",(l-1).toString(),"-i",input,"-c","copy",output];}
export function getLoopCreatorOutputName():string{return"output.mp3";}
export function getLoopCreatorMimeType():string{return"audio/mpeg";}
