import { ConverterTask } from '../types';
import convert from 'xml-js';

export const processXmlJson = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(10);
  
  let inputText = task.options.directInput as string;
  if (task.files && task.files.length > 0) {
    inputText = await task.files[0].text();
  }

  if (!inputText) throw new Error("No input provided.");

  const direction = (task.options.direction as string) || "xml-to-json";
  onProgress(50);

  let outputText = "";
  if (direction === "xml-to-json") {
    try {
      outputText = convert.xml2json(inputText, { compact: true, spaces: 2 });
    } catch (e: any) {
      throw new Error("Invalid XML input format.");
    }
  } else {
    try {
      // Must ensure input is JSON string
      if (typeof JSON.parse(inputText) !== 'object') throw new Error();
      outputText = convert.json2xml(inputText, { compact: true, spaces: 2 });
    } catch (e: any) {
      throw new Error("Invalid JSON input format.");
    }
  }

  onProgress(100);
  const type = direction === "xml-to-json" ? "application/json" : "application/xml";
  return new Blob([outputText], { type });
};
