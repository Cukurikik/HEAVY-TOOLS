export function buildPodcastEnhancerArgs(input:string,output:string,opts:Record<string,unknown>):string[]{return["-i",input,"-af","highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=10:release=100,loudnorm=I=-16:TP=-1.5:LRA=11",output];}
export function getPodcastEnhancerOutputName():string{return"output.mp3";}
export function getPodcastEnhancerMimeType():string{return"audio/mpeg";}
