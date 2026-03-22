import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { usePdfStore, toBlob } from './usePdfStore';

// Mock pdf-lib
vi.mock('pdf-lib', () => {
  const mockPage = {
    getWidth: () => 100,
    getHeight: () => 200,
    getRotation: () => ({ angle: 0 }),
    setCropBox: vi.fn(),
    drawText: vi.fn(),
  };

  const mockDoc = {
    getPages: vi.fn().mockReturnValue([mockPage]),
    getPageCount: vi.fn().mockReturnValue(1),
    save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    copyPages: vi.fn().mockResolvedValue([mockPage]),
    addPage: vi.fn(),
    embedJpg: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
    embedPng: vi.fn().mockResolvedValue({ width: 100, height: 100 }),
    getPageIndices: vi.fn().mockReturnValue([0]),
  };

  return {
    PDFDocument: {
      load: vi.fn().mockResolvedValue(mockDoc),
      create: vi.fn().mockResolvedValue(mockDoc),
    }
  };
});

// Mock global APIs
vi.stubGlobal('fetch', vi.fn());
vi.stubGlobal('URL', {
  ...global.URL,
  createObjectURL: vi.fn(() => 'blob:test-url')
});
vi.stubGlobal('crypto', {
  randomUUID: () => 'mock-uuid-1234'
});

describe('usePdfStore', () => {
  beforeEach(() => {
    // Reset store before each test
    usePdfStore.getState().reset();
    usePdfStore.setState({ history: [] });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('toBlob', () => {
    it('should convert a Uint8Array to a Blob with application/pdf type', () => {
      const data = new Uint8Array([1, 2, 3, 4]);
      const blob = toBlob(data);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
      expect(blob.size).toBe(4);
    });

    it('should handle an empty Uint8Array correctly', () => {
      const emptyData = new Uint8Array([]);
      const blob = toBlob(emptyData);

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
      expect(blob.size).toBe(0);
    });
  });

  it('should have initial state', () => {
    const state = usePdfStore.getState();
    expect(state.task.operation).toBe('merge');
    expect(state.task.status).toBe('idle');
    expect(state.task.files).toEqual([]);
    expect(state.history).toEqual([]);
  });

  it('should set files and load pages', async () => {
    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

    // Call setFiles
    await usePdfStore.getState().setFiles([file]);

    const state = usePdfStore.getState();
    expect(state.task.files).toHaveLength(1);
    expect(state.task.files[0].name).toBe('test.pdf');
    // It should load pages since it's a single file
    expect(state.task.pages).toHaveLength(1);
    expect(state.task.pages[0].width).toBe(100);
    expect(state.task.pages[0].height).toBe(200);
    expect(state.task.id).toBe('mock-uuid-1234');
  });

  it('should not load pages if multiple files are set', async () => {
    const file1 = new File(['dummy'], 'test1.pdf', { type: 'application/pdf' });
    const file2 = new File(['dummy'], 'test2.pdf', { type: 'application/pdf' });

    await usePdfStore.getState().setFiles([file1, file2]);

    const state = usePdfStore.getState();
    expect(state.task.files).toHaveLength(2);
    expect(state.task.pages).toEqual([]); // Empty pages for multiple files
  });

  it('should set operation', () => {
    usePdfStore.getState().setOperation('split');
    expect(usePdfStore.getState().task.operation).toBe('split');
  });

  it('should set options', () => {
    usePdfStore.getState().setOptions({ pages: [1, 2] });
    expect(usePdfStore.getState().task.options).toEqual({ pages: [1, 2] });

    usePdfStore.getState().setOptions({ angle: 90 });
    expect(usePdfStore.getState().task.options).toEqual({ pages: [1, 2], angle: 90 });
  });

  it('should set selected pages', () => {
    usePdfStore.getState().setSelectedPages([0, 1]);
    expect(usePdfStore.getState().task.selectedPages).toEqual([0, 1]);
  });

  it('should reset task state', () => {
    usePdfStore.getState().setOperation('split');
    usePdfStore.getState().setSelectedPages([1]);

    usePdfStore.getState().reset();

    const state = usePdfStore.getState();
    expect(state.task.operation).toBe('merge'); // Default
    expect(state.task.selectedPages).toEqual([]);
    expect(state.task.id).toBe('');
  });

  describe('processPdf', () => {
    it('should not process if no files are present', async () => {
      await usePdfStore.getState().processPdf();
      expect(usePdfStore.getState().task.status).toBe('idle');
    });

    it('should process client-side operation successfully', async () => {
      const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
      await usePdfStore.getState().setFiles([file]);
      usePdfStore.getState().setOperation('merge');

      await usePdfStore.getState().processPdf();

      const state = usePdfStore.getState();
      expect(state.task.status).toBe('success');
      expect(state.task.progress).toBe(100);
      expect(state.task.resultUrl).toBe('blob:test-url');
      expect(state.task.resultBlob).toBeInstanceOf(Blob);
      expect(state.history).toHaveLength(1);
    });

    it('should handle client-side processing errors', async () => {
      const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
      await usePdfStore.getState().setFiles([file]);

      // Force an error in mock
      const { PDFDocument } = await import('pdf-lib');
      vi.mocked(PDFDocument.create).mockRejectedValueOnce(new Error('Mock processing error'));

      usePdfStore.getState().setOperation('merge');
      await usePdfStore.getState().processPdf();

      const state = usePdfStore.getState();
      expect(state.task.status).toBe('error');
      expect(state.task.error).toBe('Mock processing error');
    });

    it('should process server-side operation successfully', async () => {
      // Mock successful fetch response
      const mockBlob = new Blob(['result'], { type: 'application/pdf' });
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        blob: vi.fn().mockResolvedValue(mockBlob)
      } as unknown as Response);

      const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
      await usePdfStore.getState().setFiles([file]);
      usePdfStore.getState().setOperation('compress'); // Server operation

      await usePdfStore.getState().processPdf();

      const state = usePdfStore.getState();
      expect(global.fetch).toHaveBeenCalledWith('/api/pdf/compress', expect.any(Object));
      expect(state.task.status).toBe('success');
      expect(state.task.resultBlob).toBe(mockBlob);
    });

    it('should handle server-side processing errors', async () => {
      // Mock failed fetch response
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        text: vi.fn().mockResolvedValue('Server error')
      } as unknown as Response);

      const file = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });
      await usePdfStore.getState().setFiles([file]);
      usePdfStore.getState().setOperation('compress'); // Server operation

      await usePdfStore.getState().processPdf();

      const state = usePdfStore.getState();
      expect(state.task.status).toBe('error');
      expect(state.task.error).toBe('Server error');
    });
  });
});
