import { expect, test, vi } from 'vitest'
import { saveVideoTaskHistory } from './video.actions'

// Mocking the database singleton
vi.mock('@/lib/db', () => ({
  db: {
    videoTaskHistory: {
      create: vi.fn().mockResolvedValue({ id: 'mock-123', toolName: 'trimmer' })
    }
  }
}))

// 91. Unit Tests (Video Actions)
test('saveVideoTaskHistory saves core task properly without crashing', async () => {
  const result = await saveVideoTaskHistory({
    userId: 'user-1',
    toolName: 'trimmer',
    status: 'success'
  })
  
  expect(result.success).toBe(true)
  expect(result.record).toBeDefined()
  expect((result.record as any).id).toBe('mock-123')
})
