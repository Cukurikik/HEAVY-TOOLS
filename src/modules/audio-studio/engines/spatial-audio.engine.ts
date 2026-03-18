export function buildSpatialAudioArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const m=(opts.mode as string)||"surround";if(m==="surround")return["-i",input,"-af","aecho=0.8:0.88:40:0.3,stereotools=mode=ms>lr",output];return["-i",input,"-af","stereotools=mode=lr>ms",output];}
export function getSpatialAudioOutputName():string{return"output.mp3";}
export function getSpatialAudioMimeType():string{return"audio/mpeg";}
