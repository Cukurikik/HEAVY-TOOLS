import { describe, it, expect } from 'vitest';
import { handleFirebaseEncodeError } from './firebase-error';

describe('handleFirebaseEncodeError', () => {
  it('should handle errorCode 137 (OOM)', () => {
    const result = handleFirebaseEncodeError(137, 'some error');
    expect(result).toBe('Tugas terlalu berat, memori cloud tidak cukup. Coba kurangi resolusi atau bitrate.');
  });

  it('should handle errorCode 413 (Payload Too Large)', () => {
    const result = handleFirebaseEncodeError(413, undefined);
    expect(result).toBe('File terlalu berat untuk ukuran memori cloud saat ini. Mohon gunakan ukuran yang lebih kecil.');
  });

  it('should handle message with "payload too large"', () => {
    const result = handleFirebaseEncodeError(undefined, 'Error: Payload Too Large processing file');
    expect(result).toBe('File terlalu berat untuk ukuran memori cloud saat ini. Mohon gunakan ukuran yang lebih kecil.');
  });

  it('should handle message with "memory"', () => {
    const result = handleFirebaseEncodeError(undefined, 'Out of memory error');
    expect(result).toBe('File terlalu berat untuk ukuran memori cloud saat ini. Mohon gunakan ukuran yang lebih kecil.');
  });

  it('should handle message with "unsupported codec"', () => {
    const result = handleFirebaseEncodeError(undefined, 'FFmpeg error: unsupported codec');
    expect(result).toBe('Format file tidak didukung atau korup. Coba konversi file ini sebelum diproses.');
  });

  it('should handle message with "invalid data"', () => {
    const result = handleFirebaseEncodeError(undefined, 'invalid data found when processing input');
    expect(result).toBe('Format file tidak didukung atau korup. Coba konversi file ini sebelum diproses.');
  });

  it('should handle errorCode 504 (Timeout)', () => {
    const result = handleFirebaseEncodeError(504, undefined);
    expect(result).toBe('Waktu proses di cloud habis. Coba lagi dalam beberapa saat.');
  });

  it('should handle message with "timeout"', () => {
    const result = handleFirebaseEncodeError(undefined, 'Function execution took too long and ended in a timeout');
    expect(result).toBe('Waktu proses di cloud habis. Coba lagi dalam beberapa saat.');
  });

  it('should return a default error message for unknown errors', () => {
    const result = handleFirebaseEncodeError(500, 'Internal Server Error');
    expect(result).toBe('Gagal memproses di server cloud. Kami sedang menyelidikinya.');
  });

  it('should handle undefined parameters gracefully', () => {
    const result = handleFirebaseEncodeError(undefined, undefined);
    expect(result).toBe('Gagal memproses di server cloud. Kami sedang menyelidikinya.');
  });
});
