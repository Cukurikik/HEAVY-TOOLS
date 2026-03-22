/// <reference lib="webworker" />
import heic2any from 'heic2any';

self.onmessage = async (e: MessageEvent) => {
  const { id, file, targetFormat = 'image/jpeg', quality = 0.9 } = e.data;
  
  try {
    self.postMessage({ id, type: 'PROGRESS', progress: 10 });
    
    // heic2any returns a Blob or Blob[]
    const result = await heic2any({
      blob: file,
      toType: targetFormat,
      quality: quality
    });
    
    self.postMessage({ id, type: 'PROGRESS', progress: 100 });
    
    const outputBlob = Array.isArray(result) ? result[0] : result;
    const outputUrl = URL.createObjectURL(outputBlob);
    
    self.postMessage({ 
      id, 
      type: 'DONE', 
      payload: { blob: outputBlob, url: outputUrl } 
    });
  } catch (error) {
    self.postMessage({ 
      id, 
      type: 'ERROR', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};
