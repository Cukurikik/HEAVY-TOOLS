import { ConverterTask } from '../types';

export const processBase64 = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string | Blob> => {
  onProgress(20);
  
  const direction = (task.options.direction as string) || "encode";
  
  if (direction === "encode") {
    if (task.files && task.files.length > 0) {
      // Encode file to base64 Data URI
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          onProgress(100);
          resolve(reader.result as string); // Returns the actual base64 string
        };
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(task.files[0]);
      });
    } else {
      // Encode text
      const input = task.options.directInput as string;
      if (!input) throw new Error("No input provided");
      onProgress(100);
      return btoa(unescape(encodeURIComponent(input)));
    }
  } else {
    // Decode (assuming string input)
    const input = task.options.directInput as string;
    if (!input) throw new Error("No input provided");
    if (input.startsWith('data:')) {
      // Decode data URI back to Blob
      const arr = input.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : '';
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      onProgress(100);
      return new Blob([u8arr], { type: mime });
    } else {
      // Decode regular text base64
      try {
        onProgress(100);
        return decodeURIComponent(escape(atob(input)));
      } catch (e) {
        throw new Error("Invalid base64 string layout.");
      }
    }
  }
};
