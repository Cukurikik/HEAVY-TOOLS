import { ConverterTask } from '../types';

export const processCurrencyConverter = async (task: ConverterTask, onProgress: (p: number) => void): Promise<string> => {
  onProgress(20);
  
  const amount = parseFloat(task.options.directInput as string);
  if (isNaN(amount)) throw new Error("Invalid amount provided.");
  
  const from = (task.options.fromCurrency as string) || "USD";
  const to = (task.options.toCurrency as string) || "EUR";

  onProgress(40);
  
  // Real-time rates require an API. We'll use the local server wrapper pointing to an exchange rate provider
  const res = await fetch(`/api/converter/currency?amount=${amount}&from=${from}&to=${to}`);
  if (!res.ok) throw new Error("Failed to fetch live currency rates from API.");

  onProgress(80);
  const data = await res.json();
  
  onProgress(100);
  return `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
};
