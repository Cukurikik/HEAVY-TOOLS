import { TestBed } from '@angular/core/testing';
import { ImageConverterService } from './image-converter.service';

describe('ImageConverterService', () => {
  let service: ImageConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('detectInputFormat', () => {
    it('should return mime type suffix even when mime is generic', () => {
      const file = new File([''], 'test.png', { type: 'application/octet-stream' });
      expect(service.detectInputFormat(file)).toBe('octet-stream');
    });

    it('should detect format from mime type', () => {
      const file = new File([''], 'test.unknown', { type: 'image/jpeg' });
      expect(service.detectInputFormat(file)).toBe('jpeg');
    });

    it('should detect format when both extension and mime are present', () => {
      const file = new File([''], 'test.webp', { type: 'image/webp' });
      expect(service.detectInputFormat(file)).toBe('webp');
    });

    it('should fallback to filename if no extension and no mime type is present', () => {
      const file = new File([''], 'test', { type: '' });
      expect(service.detectInputFormat(file)).toBe('test');
    });

    it('should return "unknown" when there is no name and no type', () => {
      const file = new File([''], '', { type: '' });
      expect(service.detectInputFormat(file)).toBe('unknown');
    });

    it('should handle uppercase extensions', () => {
      const file = new File([''], 'test.PNG', { type: 'image/png' });
      expect(service.detectInputFormat(file)).toBe('png');
    });

    it('should prioritize mime type suffix over extension if they differ', () => {
      const file = new File([''], 'test.jpg', { type: 'image/png' });
      expect(service.detectInputFormat(file)).toBe('png');
    });
  });
});
