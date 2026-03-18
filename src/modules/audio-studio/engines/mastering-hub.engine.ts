export function buildMasteringHubArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const l=(opts.loudness as number)||-14;return["-i",input,"-af","acompressor=threshold=-20dB:ratio=4:attack=5:release=50,loudnorm=I="+l+":TP=-1.5:LRA=11",output];}
export function getMasteringHubOutputName():string{return"output.mp3";}
export function getMasteringHubMimeType():string{return"audio/mpeg";}
