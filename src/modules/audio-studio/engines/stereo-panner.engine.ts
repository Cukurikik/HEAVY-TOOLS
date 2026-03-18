export function buildStereoPannerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const p=(opts.pan as number)||0;return["-i",input,"-af","stereotools=mpan="+p,output];}
export function getStereoPannerOutputName():string{return"output.mp3";}
export function getStereoPannerMimeType():string{return"audio/mpeg";}
