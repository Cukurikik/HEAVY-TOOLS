import { ConverterTask } from '../types';

export const processUnitConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  const input = parseFloat(task.options.directInput as string);
  if (isNaN(input)) throw new Error("Invalid number provided.");
  
  const type = (task.options.unitType as string) || "length";
  const from = (task.options.fromUnit as string) || "meters";
  const to = (task.options.toUnit as string) || "feet";

  onProgress(60);

  // Simplified basic conversions map for standard demonstration
  let result = 0;
  
  if (type === "length") {
    // Convert to meters first
    let meters = input;
    if (from === "feet") meters = input * 0.3048;
    else if (from === "inches") meters = input * 0.0254;
    else if (from === "kilometers") meters = input * 1000;

    // Convert from meters
    if (to === "meters") result = meters;
    else if (to === "feet") result = meters / 0.3048;
    else if (to === "inches") result = meters / 0.0254;
    else if (to === "kilometers") result = meters / 1000;
  } else if (type === "weight") {
    // Kilograms base
    let kg = input;
    if (from === "pounds") kg = input * 0.453592;
    else if (from === "ounces") kg = input * 0.0283495;

    if (to === "kilograms") result = kg;
    else if (to === "pounds") result = kg / 0.453592;
    else if (to === "ounces") result = kg / 0.0283495;
  }

  onProgress(100);
  return `${input} ${from} = ${result.toFixed(4)} ${to}`;
};
