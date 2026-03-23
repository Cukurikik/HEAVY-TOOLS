import { expect, test } from 'vitest'
import { VideoTaskSchema } from '../types/index'

// 96. Payload Validation Tests (Zod)
test('VideoTaskSchema validates a standard task payload successfully', () => {
  const payload = {
    operation: 'trimmer',
    options: { start: 0, end: 10 },
    status: 'idle',
    progress: 0
  }
  
  const result = VideoTaskSchema.safeParse(payload)
  expect(result.success).toBe(true)
})

test('VideoTaskSchema rejects unknown video operations', () => {
  const payload = {
    operation: 'hack-the-mainframe',
    options: {}
  }
  
  const result = VideoTaskSchema.safeParse(payload)
  expect(result.success).toBe(false)
})
