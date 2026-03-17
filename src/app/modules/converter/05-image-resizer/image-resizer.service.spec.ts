import { TestBed } from '@angular/core/testing';
import { ImageResizerService } from './image-resizer.service';

describe('ImageResizerService', () => {
  let service: ImageResizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageResizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isConversionSupported', () => {
    it('should return false if input and output formats are the same', () => {
      expect(service.isConversionSupported('png', 'png')).toBe(false);
      expect(service.isConversionSupported('jpeg', 'jpeg')).toBe(false);
      expect(service.isConversionSupported('webp', 'webp')).toBe(false);
    });

    it('should return true if input and output formats are different', () => {
      expect(service.isConversionSupported('png', 'jpeg')).toBe(true);
      expect(service.isConversionSupported('jpeg', 'webp')).toBe(true);
      expect(service.isConversionSupported('webp', 'png')).toBe(true);
    });
  });

  describe('generateOutputFilename', () => {
    it('should generate a semantic output filename with the specified format', () => {
      expect(service.generateOutputFilename('test_image.jpg', 'png')).toBe('exia_image_resizer_test_image.png');
    });

    it('should handle filenames without extensions', () => {
      expect(service.generateOutputFilename('my_picture', 'webp')).toBe('exia_image_resizer_my_picture.webp');
    });

    it('should handle filenames with multiple dots', () => {
      expect(service.generateOutputFilename('my.picture.name.png', 'jpeg')).toBe('exia_image_resizer_my.picture.name.jpeg');
    });
  });

  describe('detectFormat', () => {
    it('should detect format from filename extension', () => {
      const file = new File([''], 'image.png', { type: 'image/png' });
      expect(service.detectFormat(file)).toBe('png');
    });

    it('should fallback to MIME type if filename has no extension', () => {
      const file = new File([''], 'image', { type: 'image/jpeg' });
      expect(service.detectFormat(file)).toBe('jpeg');
    });

    it('should return unknown if both extension and MIME type are missing', () => {
      const file = new File([''], 'image', { type: '' });
      expect(service.detectFormat(file)).toBe('unknown');
    });
  });
});
