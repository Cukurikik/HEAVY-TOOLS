import { ConverterTask } from '../types';

export const processNumberSystem = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  const inputBase = parseInt((task.options.inputBase as string) || "10");
  const outputBase = parseInt((task.options.outputBase as string) || "2");
  const input = task.options.directInput as string;

  if (!input) throw new Error("No input number provided.");
  onProgress(60);

  // Split spaces for multiple numbers support
  const numbers = input.trim().split(/\s+/);
  const results = numbers.map(num => {
    // Parse using input base
    const parsed = parseInt(num, inputBase);
    if (isNaN(parsed)) return `[Invalid in base ${inputBase}]`;
    // Convert to output base
    return parsed.toString(outputBase).toUpperCase();
  });

  onProgress(100);
  return results.join(" ");
};
