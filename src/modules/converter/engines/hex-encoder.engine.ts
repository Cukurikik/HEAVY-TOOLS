import { ConverterTask } from '../types';

export const processHexEncoder = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  const direction = (task.options.direction as string) || "encode";
  let input = task.options.directInput as string || "";

  if (task.files && task.files.length > 0) {
    if (direction === "encode") {
      input = await task.files[0].text();
    } else {
      input = await task.files[0].text(); // hex string inside file
    }
  }

  if (!input) throw new Error("No input provided.");
  onProgress(60);

  let output = "";
  if (direction === "encode") {
    for (let i = 0; i < input.length; i++) {
      output += input.charCodeAt(i).toString(16).padStart(2, '0');
    }
  } else {
    const cleanInput = input.replace(/\s+/g, '');
    if (cleanInput.length % 2 !== 0) throw new Error("Invalid hex string length.");
    for (let i = 0; i < cleanInput.length; i += 2) {
      output += String.fromCharCode(parseInt(cleanInput.substr(i, 2), 16));
    }
  }

  onProgress(100);
  return output; // Returned as raw string
};
