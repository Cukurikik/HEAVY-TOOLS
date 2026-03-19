import '@testing-library/jest-dom'

// Mock crypto.randomUUID
if (!global.crypto) {
  global.crypto = {} as any
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = () => 'test-uuid-1234'
}

// Mock URL
if (!global.URL.createObjectURL) {
  global.URL.createObjectURL = () => 'blob:test-url'
}
