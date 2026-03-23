import { ConverterTask } from '../types';
import Papa from 'papaparse';

export const processCsvJson = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(10);
  
  let inputText = task.options.directInput as string;
  if (task.files && task.files.length > 0) {
    inputText = await task.files[0].text();
  }

  if (!inputText) throw new Error("No input provided.");

  const direction = (task.options.direction as string) || "csv-to-json";
  onProgress(50);

  let outputText = "";
  if (direction === "csv-to-json") {
    try {
      const parsed = Papa.parse(inputText, { header: true, skipEmptyLines: true });
      if (parsed.errors.length > 0) throw new Error(parsed.errors[0].message);
      outputText = JSON.stringify(parsed.data, null, 2);
    } catch (e: any) {
      throw new Error("Invalid CSV input format: " + e.message);
    }
  } else {
    try {
      const parsed = JSON.parse(inputText);
      outputText = Papa.unparse(parsed);
    } catch (e: any) {
      throw new Error("Invalid JSON input format. Ensure it is an array of objects.");
    }
  }

  onProgress(100);
  const type = direction === "csv-to-json" ? "application/json" : "text/csv";
  return new Blob([outputText], { type });
};
