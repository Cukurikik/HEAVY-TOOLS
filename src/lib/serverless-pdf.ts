// Stubbed for PostgreSQL SAJA mandate — Firebase is eradicated.
export const generatePdfUploadUrl = async (...args: any[]) => ({ uploadUrl: '', fileId: '' });
export const generatePdfDownloadUrl = async (...args: any[]) => '';
export const triggerPdfCloudRun = async (...args: any[]) => {};
export const checkPdfProgress = async (...args: any[]) => ({ status: 'error', progress: 0 });
export const serverlessPdfClient = {
  runJob: async (...args: any[]) => ({ status: 'success' }),
  checkStatus: async (...args: any[]) => ({ status: 'success', progress: 100 })
};
