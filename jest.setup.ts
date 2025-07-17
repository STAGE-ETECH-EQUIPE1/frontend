import path from 'path'
import '@testing-library/jest-dom'

// Mock window.matchMedia
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })
}

// Mock next-intl
jest.mock('next-intl', () => {
  return {
    __esModule: true,
    unstable_setRequestLocale: jest.fn(),

    useTranslations: (namespace: string) => {
      const localeFilePath = path.join(process.cwd(), 'messages', 'en.json')
      const allMessages = require(localeFilePath)
      const messages = allMessages[namespace] || {}

      return (key: string) => messages[key] || key
    },

    getTranslations: jest.fn().mockImplementation(async (namespace: string) => {
      const localeFilePath = path.join(process.cwd(), 'messages', 'en.json')
      const allMessages = (await import(localeFilePath)).default
      const messages = allMessages[namespace] || {}

      return (key: string) => messages[key] || key
    }),
  }
})

// Mock HTMLCanvasElement.prototype.getContext globalement
HTMLCanvasElement.prototype.getContext = jest.fn((): any => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: [] })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => []),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}))
