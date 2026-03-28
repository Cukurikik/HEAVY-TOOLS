// Stubbed for PostgreSQL SAJA mandate — Firebase is eradicated.
export const generateAudioUploadUrl = async (...args: any[]) => ({ uploadUrl: '', fileId: '' });
export const generateAudioDownloadUrl = async (...args: any[]) => '';
export const triggerAudioCloudRun = async (...args: any[]) => {};
export const checkAudioProgress = async (...args: any[]) => ({ status: 'error', progress: 0 });
export const serverlessAudioClient = {
  runJob: async (...args: any[]) => ({ status: 'success', jobId: 'mock-job-id' }),
  checkStatus: async (...args: any[]) => ({ status: 'success', progress: 100 })
};
