import { ConverterTask } from '../types';
import yaml from 'js-yaml';

export const processJsonYaml = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(10);
  
  let inputText = task.options.directInput as string;
  if (task.files && task.files.length > 0) {
    inputText = await task.files[0].text();
  }

  if (!inputText) throw new Error("No input provided. Upload a file or paste text.");

  const direction = (task.options.direction as string) || "json-to-yaml";
  onProgress(50);

  let outputText = "";
  if (direction === "json-to-yaml") {
    try {
      const parsed = JSON.parse(inputText);
      outputText = yaml.dump(parsed);
    } catch (e) {
      throw new Error("Invalid JSON input format.");
    }
  } else {
    try {
      const parsed = yaml.load(inputText);
      outputText = JSON.stringify(parsed, null, 2);
    } catch (e) {
      throw new Error("Invalid YAML input format.");
    }
  }

  onProgress(100);
  const type = direction === "json-to-yaml" ? "text/yaml" : "application/json";
  return new Blob([outputText], { type });
};
