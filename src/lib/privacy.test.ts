import { describe, it, expect } from 'vitest'
import { anonymizeIp, anonymizeFilename, anonymizeUserId } from './privacy'
import crypto from 'crypto'

describe('privacy', () => {
  describe('anonymizeIp', () => {
    it('hashes an IPv4 address deterministically to a 16-character string', () => {
      const ip = '192.168.1.1'
      const result = anonymizeIp(ip)
      expect(result).toHaveLength(16)

      const expected = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
      expect(result).toBe(expected)
    })

    it('returns the same hash for the same IP address', () => {
      const ip = '10.0.0.1'
      expect(anonymizeIp(ip)).toBe(anonymizeIp(ip))
    })

    it('returns different hashes for different IP addresses', () => {
      expect(anonymizeIp('192.168.1.1')).not.toBe(anonymizeIp('192.168.1.2'))
    })

    it('handles IPv6 addresses', () => {
      const ip = '2001:0db8:85a3:0000:0000:8a2e:0370:7334'
      const result = anonymizeIp(ip)
      expect(result).toHaveLength(16)

      const expected = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
      expect(result).toBe(expected)
    })

    it('handles empty strings', () => {
      const ip = ''
      const result = anonymizeIp(ip)
      expect(result).toHaveLength(16)

      const expected = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
      expect(result).toBe(expected)
    })
  })

  describe('anonymizeFilename', () => {
    it('anonymizes a standard filename while keeping its extension', () => {
      expect(anonymizeFilename('my_secret_video.mp4')).toBe('anonymized_file.mp4')
    })

    it('handles filenames with multiple dots', () => {
      expect(anonymizeFilename('archive.tar.gz')).toBe('anonymized_file.gz')
    })

    it('handles filenames with no extension', () => {
      // Based on current implementation, it returns the whole string as the extension
      expect(anonymizeFilename('README')).toBe('anonymized_file.README')
    })
  })

  describe('anonymizeUserId', () => {
    it('hashes a user ID deterministically to a 12-character string', () => {
      const userId = 'user_123456'
      const result = anonymizeUserId(userId)
      expect(result).toHaveLength(12)

      const expected = crypto.createHash('sha256').update(userId).digest('hex').substring(0, 12)
      expect(result).toBe(expected)
    })

    it('returns the same hash for the same user ID', () => {
      const userId = 'user_999'
      expect(anonymizeUserId(userId)).toBe(anonymizeUserId(userId))
    })

    it('returns different hashes for different user IDs', () => {
      expect(anonymizeUserId('user_1')).not.toBe(anonymizeUserId('user_2'))
    })

    it('handles empty strings', () => {
      const userId = ''
      const result = anonymizeUserId(userId)
      expect(result).toHaveLength(12)

      const expected = crypto.createHash('sha256').update(userId).digest('hex').substring(0, 12)
      expect(result).toBe(expected)
    })
  })
})
