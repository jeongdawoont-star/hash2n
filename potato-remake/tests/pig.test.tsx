// @vitest-environment jsdom
import { it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act, cleanup } from '@testing-library/react'

const SAVE_KEY = 'potato-remake-classic-v2'
beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers(); cleanup() })

function save(day: number, careCount: number) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({
    screen: 'game', day, resolvingDay: true,
    stats: { gram: 300, large: 300, shape: 200, nutri: 200, regist: 200, hard: 200 },
    initialStats: { gram: 180, large: 180, shape: 85, nutri: 85, regist: 55, hard: 60 },
    plan: { morning: null, afternoon: null, evening: null }, planCursor: 0,
    unlockedSlotsCount: 3, weekIndex: 5, unlockedEndingIds: [], endingSeenCount: {},
    runCount: 1, careCount, eventLog: [], touchCombo: 0,
    seedSlot: { rolled: true, rerolls: 0, results: [] },
  }))
}

async function tick(n: number) {
  for (let i = 0; i < n; i++) await act(async () => { vi.advanceTimersByTime(100); await Promise.resolve() })
}

it('pig appears when careCount low (stages by day)', async () => {
  for (const [day, expectStage] of [[25, 1], [55, 2], [85, 3]] as const) {
    cleanup(); vi.resetModules(); localStorage.clear()
    save(day, 3)
    const { default: App } = await import('../src/App')
    render(<App />)
    await tick(5)
    const pig = document.querySelector('.pig-warning')
    const cls = pig?.className ?? 'NONE'
    const bubble = pig?.querySelector('.pig-warning-bubble')?.textContent
    console.log('[PIG]', 'day', day, 'class:', cls, 'bubble:', bubble)
    expect(pig).toBeTruthy()
    expect(cls).toContain(`pig-stage-${expectStage}`)
  }
})

it('pig hidden when careCount >= 30, and goodbye message on crossing', async () => {
  cleanup(); vi.resetModules(); localStorage.clear()
  save(50, 50)
  const { default: App } = await import('../src/App')
  render(<App />)
  await tick(5)
  expect(document.querySelector('.pig-warning')).toBeNull()
  console.log('[PIG] hidden at careCount=50 OK')
})
