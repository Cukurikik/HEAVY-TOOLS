import { ConverterTask } from '../types';

export const processTimezoneConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  const inputStr = task.options.directInput as string; // E.g., ISO string or "now"
  if (!inputStr) throw new Error("No time provided.");
  
  const targetTz = (task.options.timezone as string) || "America/New_York";

  onProgress(60);
  
  let dateObj = new Date();
  if (inputStr !== "now") {
    dateObj = new Date(inputStr);
    if (isNaN(dateObj.getTime())) throw new Error("Invalid date string provided.");
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTz,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'long'
    });
    
    const output = formatter.format(dateObj);
    onProgress(100);
    return `In ${targetTz}: ${output}`;
  } catch (e) {
    throw new Error("Invalid Timezone identifier.");
  }
};
