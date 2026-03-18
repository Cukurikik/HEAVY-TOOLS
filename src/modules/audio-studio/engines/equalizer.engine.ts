export function buildEqualizerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const b=(opts.bass as number)||0;const m=(opts.mid as number)||0;const t=(opts.treble as number)||0;return["-i",input,"-af","equalizer=f=100:t=h:width=200:g="+b+",equalizer=f=1000:t=h:width=500:g="+m+",equalizer=f=8000:t=h:width=2000:g="+t,output];}
export function getEqualizerOutputName():string{return"output.mp3";}
export function getEqualizerMimeType():string{return"audio/mpeg";}
