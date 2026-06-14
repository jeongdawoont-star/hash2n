// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, cleanup } from '@testing-library/react'

const SAVE_KEY = 'potato-remake-classic-v2'

function baseSave(over: Record<string, unknown> = {}) {
  return JSON.stringify({
    screen: 'game', day: 97.9, resolvingDay: true,
    stats: { gram: 500, large: 500, shape: 300, nutri: 300, regist: 300, hard: 300 },
    plan: { morning: null, afternoon: null, evening: null },
    planCursor: 0, unlockedSlotsCount: 3, weekIndex: 14,
    unlockedEndingIds: [], endingSeenCount: {}, runCount: 1,
    careCount: 50, eventLog: [], touchCombo: 0,
    seedSlot: { rolled: true, rerolls: 0, results: [] },
    ...over,
  })
}

async function tick(n: number) {
  for (let i = 0; i < n; i++) {
    await act(async () => { vi.advanceTimersByTime(100); await Promise.resolve() })
  }
}

beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers(); cleanup() })

describe('ad slide gate', () => {
  it('slide gesture triggers ad once; double-slide/double-complete unlocks ending exactly once', async () => {
    localStorage.setItem(SAVE_KEY, baseSave())
    vi.resetModules()
    const { default: App } = await import('../src/App')
    render(<App />)
    await tick(12)

    // reach harvest confirm (step 6)
    let safety = 0
    while (safety++ < 600 && !document.querySelector('.harvest-overlay')) {
      await act(async () => { vi.advanceTimersByTime(100); await Promise.resolve() })
    }
    expect(document.querySelector('.harvest-overlay')).toBeTruthy()
    for (let i = 0; i < 8; i++) {
      if (document.querySelector('.ad-slide-track')) break
      const card = document.querySelector('.harvest-card') as HTMLElement
      if (card) await act(async () => { fireEvent.click(card) })
      await tick(9)
    }
    const track = document.querySelector('.ad-slide-track') as HTMLElement
    expect(track).toBeTruthy()

    // incomplete slide (short drag) must NOT trigger
    await act(async () => {
      fireEvent.pointerDown(track, { pointerId: 1, clientX: 0 })
      fireEvent.pointerMove(track, { pointerId: 1, clientX: 40 })
      fireEvent.pointerUp(track, { pointerId: 1, clientX: 40 })
    })
    await tick(3)
    expect(document.querySelector('.ad-overlay')).toBeFalsy()

    // full slide triggers the (mock) ad
    await act(async () => {
      fireEvent.pointerDown(track, { pointerId: 2, clientX: 0 })
      fireEvent.pointerMove(track, { pointerId: 2, clientX: 200 })
      fireEvent.pointerUp(track, { pointerId: 2, clientX: 200 })
    })
    await tick(5)
    expect(document.querySelector('.ad-overlay')).toBeTruthy()

    // double-complete attempt: even if completion path fires twice, ending registers once
    await tick(60)
    const skipBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').includes('건너뛰기'))
    if (skipBtn) {
      await act(async () => { fireEvent.click(skipBtn); fireEvent.click(skipBtn) })
    }
    await tick(20)

    const save = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '{}')
    expect(save.screen).toBe('ending')
    expect((save.unlockedEndingIds ?? []).length).toBe(1)
    const counts = Object.values(save.endingSeenCount ?? {}) as number[]
    expect(counts.length).toBe(1)
    expect(counts[0]).toBe(1) // 별 개수 버그의 원인이던 중복 카운트가 없어야 함
    console.log('[ADSLIDE] OK', save.unlockedEndingIds, save.endingSeenCount)
  }, 120000)
})
