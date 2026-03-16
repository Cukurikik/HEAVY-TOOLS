import { TestBed } from '@angular/core/testing';
import { AudioConverterService } from './audio-converter.service';

describe('AudioConverterService', () => {
  let service: AudioConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioConverterService]
    });
    service = TestBed.inject(AudioConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('detectFormat', () => {
    it('should detect standard lowercase extension', () => {
      const file = new File([''], 'audio.mp3', { type: 'audio/mpeg' });
      expect(service.detectFormat(file)).toBe('mp3');
    });

    it('should detect uppercase extension and convert to lowercase', () => {
      const file = new File([''], 'audio.WAV', { type: 'audio/wav' });
      expect(service.detectFormat(file)).toBe('wav');
    });

    it('should correctly handle filenames with multiple dots', () => {
      const file = new File([''], 'my.awesome.audio.file.flac', { type: 'audio/flac' });
      expect(service.detectFormat(file)).toBe('flac');
    });

    it('should fallback to MIME type if filename has no extension', () => {
      const file = new File([''], 'audiofile', { type: 'audio/ogg' });
      expect(service.detectFormat(file)).toBe('ogg');
    });

    it('should fallback to unknown if no extension and no MIME type are present', () => {
      const file = new File([''], 'audiofile', { type: '' });
      expect(service.detectFormat(file)).toBe('unknown');
    });

    it('should extract correct format from a complex MIME type if extension is missing', () => {
        const file = new File([''], 'audiofile', { type: 'application/vnd.apple.mpegurl' });
        expect(service.detectFormat(file)).toBe('mpegurl');
    });

  });

  describe('generateOutputFilename', () => {
      it('should replace existing extension with new format', () => {
          expect(service.generateOutputFilename('song.mp3', 'wav')).toBe('exia_audio_converter_song.wav');
      });

      it('should append new format if there is no extension', () => {
          expect(service.generateOutputFilename('song', 'wav')).toBe('exia_audio_converter_song.wav');
      });

      it('should handle filenames with multiple dots correctly', () => {
        expect(service.generateOutputFilename('my.favorite.song.mp3', 'flac')).toBe('exia_audio_converter_my.favorite.song.flac');
      });
  });

  describe('isConversionSupported', () => {
      it('should return false when input and output formats are identical', () => {
          expect(service.isConversionSupported('mp3', 'mp3')).toBe(false);
      });

      it('should return true when input and output formats are different', () => {
          expect(service.isConversionSupported('mp3', 'wav')).toBe(true);
      });
  });

});
