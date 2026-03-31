import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

Object.defineProperty(window, 'scrollTo', {
  value: () => {},
  writable: true,
})

afterEach(() => {
  cleanup()
})
