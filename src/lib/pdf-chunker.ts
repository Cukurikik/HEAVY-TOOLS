/**
 * 49. Chunking Utility Server-side
 * Memecah ekstraksi teks raksasa (ribuan halaman) menjadi ukuran kecil (chunks) 
 * berkisar batas context window LLM yang aman.
 */
export function chunkDocumentText(text: string, maxTokensPerChunk: number = 8000): string[] {
  // Rough estimate: 1 token ~ 4 characters
  const chunkSizeChars = maxTokensPerChunk * 4;
  
  if (!text || text.length === 0) return [];
  if (text.length <= chunkSizeChars) return [text];

  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let nextPos = currentPos + chunkSizeChars;
    
    // Ensure we don't break in the middle of a word or sentence if possible
    if (nextPos < text.length) {
      const lastPeriod = text.lastIndexOf('.', nextPos);
      if (lastPeriod > currentPos && lastPeriod > nextPos - 500) {
        nextPos = lastPeriod + 1;
      }
    }
    
    chunks.push(text.slice(currentPos, nextPos).trim());
    currentPos = nextPos;
  }

  return chunks;
}
