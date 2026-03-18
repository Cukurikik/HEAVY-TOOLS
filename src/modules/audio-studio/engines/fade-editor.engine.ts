export function buildFadeEditorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const fi=(opts.fadeIn as number)||2;const fo=(opts.fadeOut as number)||3;return["-i",input,"-af","afade=t=in:st=0:d="+fi+",afade=t=out:st=999:d="+fo,output];}
export function getFadeEditorOutputName():string{return"output.mp3";}
export function getFadeEditorMimeType():string{return"audio/mpeg";}
