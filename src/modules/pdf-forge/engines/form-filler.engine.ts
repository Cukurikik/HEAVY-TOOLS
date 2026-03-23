import { PDFDocument } from 'pdf-lib';
import type { PdfTask } from '../types';

export async function processFormFill(task: PdfTask, onProgress: (p: number) => void): Promise<Blob> {
  const srcDoc = await PDFDocument.load(await task.files[0].arrayBuffer(), { ignoreEncryption: true });
  onProgress(20);
  
  const form = srcDoc.getForm();
  
  // Apply hypothetical form fields mapped from task.options.fields
  const fieldsData = (task.options.fields as Record<string, string | boolean>) || {};
  
  const fields = form.getFields();
  fields.forEach(field => {
    const name = field.getName();
    if (name in fieldsData) {
      const val = fieldsData[name];
      try {
        if (typeof val === 'string' && field.constructor.name === 'PDFTextField') {
          form.getTextField(name).setText(val);
        } else if (typeof val === 'boolean' && field.constructor.name === 'PDFCheckBox') {
          if (val) form.getCheckBox(name).check();
          else form.getCheckBox(name).uncheck();
        }
      } catch (e) {
        console.warn(`Failed to fill field ${name}`, e);
      }
    }
  });

  onProgress(80);
  
  // Flatten form optionally to lock it
  if (task.options.flatten) {
    form.flatten();
  }
  
  const pdfBytes = await srcDoc.save();
  onProgress(100);
  
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}
