export function buildMetadataEditorArgs(input:string,output:string,opts:Record<string,unknown>):string[]{const t=(opts.title as string)||"";const a=(opts.artist as string)||"";const al=(opts.album as string)||"";const ar=["-i",input];if(t)ar.push("-metadata","title="+t);if(a)ar.push("-metadata","artist="+a);if(al)ar.push("-metadata","album="+al);ar.push("-c","copy",output);return ar;}
export function getMetadataEditorOutputName():string{return"output.mp3";}
export function getMetadataEditorMimeType():string{return"audio/mpeg";}
