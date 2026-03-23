import { ConverterTask } from '../types';
import { marked } from 'marked';

export const processMarkdownHtml = async (task: ConverterTask, onProgress: (p: number) => void): Promise<Blob> => {
  onProgress(20);
  
  let inputText = task.options.directInput as string;
  if (task.files && task.files.length > 0) {
    inputText = await task.files[0].text();
  }

  if (!inputText) throw new Error("No input provided.");

  const direction = (task.options.direction as string) || "md-to-html";
  onProgress(60);

  let outputText = "";
  if (direction === "md-to-html") {
    outputText = await marked(inputText);
  } else {
    // Basic HTML to Markdown (Requires turndown usually, simplified for now or server route)
    throw new Error("HTML to Markdown currently requires Turndown.js, use MD to HTML for now.");
  }

  onProgress(100);
  return new Blob([outputText], { type: "text/html" });
};
