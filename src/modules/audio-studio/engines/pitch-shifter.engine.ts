export function buildPitchShifterArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const s=(opts.semitones as number)||0;const r=Math.pow(2,s/12);return["-i",input,"-af","asetrate=44100*"+r.toFixed(6)+",aresample=44100",output];}
export function getPitchShifterOutputName():string{return"output.mp3";}
export function getPitchShifterMimeType():string{return"audio/mpeg";}
