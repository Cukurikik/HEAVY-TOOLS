import { TestBed } from '@angular/core/testing';
import { ImageConverterService } from './image-converter.service';

describe('ImageConverterService', () => {
  let service: ImageConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageConverterService],
    });
    service = TestBed.inject(ImageConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('estimateOutputSize', () => {
    const ONE_MB = 1_048_576;

    it('should calculate size for jpeg format', () => {
      const width = 1000;
      const height = 1000;
      const format = 'jpeg';
      const quality = 80;
      const pixels = width * height;
      const expected = (pixels * 3 * quality / 100 / 10) / ONE_MB;

      expect(service.estimateOutputSize(width, height, format, quality)).toBeCloseTo(expected, 6);
    });

    it('should calculate size for png format', () => {
      const width = 1000;
      const height = 1000;
      const format = 'png';
      const quality = 80; // Quality shouldn't matter for png in this formula
      const pixels = width * height;
      const expected = (pixels * 4 / 3) / ONE_MB;

      expect(service.estimateOutputSize(width, height, format, quality)).toBeCloseTo(expected, 6);
    });

    it('should calculate size for webp format', () => {
      const width = 1000;
      const height = 1000;
      const format = 'webp';
      const quality = 90;
      const pixels = width * height;
      const expected = (pixels * 3 * quality / 100 / 15) / ONE_MB;

      expect(service.estimateOutputSize(width, height, format, quality)).toBeCloseTo(expected, 6);
    });

    it('should calculate size for avif format', () => {
      const width = 1000;
      const height = 1000;
      const format = 'avif';
      const quality = 70;
      const pixels = width * height;
      const expected = (pixels * 3 * quality / 100 / 20) / ONE_MB;

      expect(service.estimateOutputSize(width, height, format, quality)).toBeCloseTo(expected, 6);
    });

    it('should calculate size for unknown/default format', () => {
      const width = 1000;
      const height = 1000;
      const format = 'bmp'; // Or anything else
      const quality = 100;
      const pixels = width * height;
      const expected = (pixels * 3) / ONE_MB;

      expect(service.estimateOutputSize(width, height, format, quality)).toBeCloseTo(expected, 6);
    });

    it('should handle zero width', () => {
      expect(service.estimateOutputSize(0, 1000, 'jpeg', 80)).toBe(0);
      expect(service.estimateOutputSize(0, 1000, 'png', 80)).toBe(0);
      expect(service.estimateOutputSize(0, 1000, 'webp', 80)).toBe(0);
      expect(service.estimateOutputSize(0, 1000, 'avif', 80)).toBe(0);
      expect(service.estimateOutputSize(0, 1000, 'unknown', 80)).toBe(0);
    });

    it('should handle zero height', () => {
      expect(service.estimateOutputSize(1000, 0, 'jpeg', 80)).toBe(0);
      expect(service.estimateOutputSize(1000, 0, 'png', 80)).toBe(0);
      expect(service.estimateOutputSize(1000, 0, 'webp', 80)).toBe(0);
      expect(service.estimateOutputSize(1000, 0, 'avif', 80)).toBe(0);
      expect(service.estimateOutputSize(1000, 0, 'unknown', 80)).toBe(0);
    });

    it('should handle zero quality', () => {
      const width = 1000;
      const height = 1000;

      expect(service.estimateOutputSize(width, height, 'jpeg', 0)).toBe(0);
      expect(service.estimateOutputSize(width, height, 'webp', 0)).toBe(0);
      expect(service.estimateOutputSize(width, height, 'avif', 0)).toBe(0);

      // PNG and default don't use quality in calculation
      const expectedPng = (width * height * 4 / 3) / ONE_MB;
      expect(service.estimateOutputSize(width, height, 'png', 0)).toBeCloseTo(expectedPng, 6);

      const expectedDefault = (width * height * 3) / ONE_MB;
      expect(service.estimateOutputSize(width, height, 'unknown', 0)).toBeCloseTo(expectedDefault, 6);
    });

    it('should handle 100 quality', () => {
      const width = 1000;
      const height = 1000;
      const pixels = width * height;

      const expectedJpeg = (pixels * 3 * 100 / 100 / 10) / ONE_MB;
      expect(service.estimateOutputSize(width, height, 'jpeg', 100)).toBeCloseTo(expectedJpeg, 6);

      const expectedWebp = (pixels * 3 * 100 / 100 / 15) / ONE_MB;
      expect(service.estimateOutputSize(width, height, 'webp', 100)).toBeCloseTo(expectedWebp, 6);

      const expectedAvif = (pixels * 3 * 100 / 100 / 20) / ONE_MB;
      expect(service.estimateOutputSize(width, height, 'avif', 100)).toBeCloseTo(expectedAvif, 6);
    });

    it('should handle large dimensions', () => {
      const width = 10000;
      const height = 10000;
      const quality = 80;
      const format = 'jpeg';
      const pixels = width * height;

      const expected = (pixels * 3 * quality / 100 / 10) / ONE_MB;
      expect(service.estimateOutputSize(width, height, format, quality)).toBeCloseTo(expected, 6);
    });
  });
});
