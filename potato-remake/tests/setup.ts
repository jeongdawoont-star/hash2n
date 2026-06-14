import { vi } from 'vitest'

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  configurable: true,
  value: function () { return Promise.resolve() },
})
Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: function () {} })
Object.defineProperty(HTMLMediaElement.prototype, 'load', { configurable: true, value: function () {} })

HTMLCanvasElement.prototype.getContext = function () { return null } as never

globalThis.fetch = vi.fn(() => Promise.reject(new TypeError('Failed to fetch'))) as never

export const consoleErrors: string[] = []
export const consoleWarns: string[] = []
const origError = console.error.bind(console)
console.error = (...args: unknown[]) => {
  consoleErrors.push(args.map(String).join(' '))
  origError(...args)
}
console.warn = (...args: unknown[]) => {
  consoleWarns.push(args.map(String).join(' '))
}
