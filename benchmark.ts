async function fetchFile(file: any) {
  return new Promise(resolve => setTimeout(() => resolve(new Uint8Array(1024)), 10));
}

const ffmpeg = {
  writeFile: async (name: string, data: any) => {
    return new Promise(resolve => setTimeout(resolve, 5));
  }
};

const images = Array.from({ length: 50 }, (_, i) => ({ file: `test${i}` }));
const durationPerImage = 3;

async function benchmark() {
  console.log("Starting benchmark...");

  // Original
  const startOriginal = performance.now();
  let listContent1 = '';
  for (let i = 0; i < images.length; i++) {
    const name = `img${i}.jpg`;
    await ffmpeg.writeFile(name, await fetchFile(images[i].file || images[i]));
    listContent1 += `file '${name}'\nduration ${durationPerImage}\n`;
  }
  const endOriginal = performance.now();
  console.log(`Original: ${endOriginal - startOriginal} ms`);

  // Optimized
  const startOptimized = performance.now();

  await Promise.all(images.map(async (img, i) => {
    const name = `img${i}.jpg`;
    await ffmpeg.writeFile(name, await fetchFile(img.file || img));
  }));

  let listContent2 = '';
  for (let i = 0; i < images.length; i++) {
    const name = `img${i}.jpg`;
    listContent2 += `file '${name}'\nduration ${durationPerImage}\n`;
  }
  const endOptimized = performance.now();
  console.log(`Optimized: ${endOptimized - startOptimized} ms`);
}

benchmark();
