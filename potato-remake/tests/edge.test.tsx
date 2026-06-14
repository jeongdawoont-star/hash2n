// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'

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

async function renderApp() {
  vi.resetModules()
  const { default: App } = await import('../src/App')
  const r = render(<App />)
  await tick(12)
  return r
}

async function finishToHarvest() {
  let safety = 0
  while (safety++ < 600 && !document.querySelector('.harvest-overlay')) {
    await act(async () => { vi.advanceTimersByTime(100); await Promise.resolve() })
  }
  return document.querySelector('.harvest-overlay')
}

function getEndingTitleFromSave(): string {
  const s = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '{}')
  return s.currentEnding?.title ?? '(none)'
}

beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers(); cleanup() })

describe('save/load robustness', () => {
  it('corrupt JSON save -> falls back to fresh title without crash', async () => {
    localStorage.setItem(SAVE_KEY, '{broken json!!!')
    await renderApp()
    expect(screen.getByRole('button', { name: '시작하기' })).toBeTruthy()
    console.log('[EDGE] corrupt-save OK')
  })

  it('save with wrong types (stats as strings, day negative) -> no crash', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ day: -5, stats: { gram: 'abc', large: null }, careCount: 'xx', planCursor: 99 }))
    await renderApp()
    console.log('[EDGE] wrong-types rendered, body has DAY:', document.body.textContent?.includes('DAY'))
  })

  it('save with day=1000 (beyond TOTAL_TURNS) -> behavior check', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ day: 1000 }))
    await renderApp()
    await tick(30)
    const harvest = document.querySelector('.harvest-overlay')
    const dayText = document.body.textContent?.match(/DAY\s*[\d.]+/i)?.[0]
    console.log('[EDGE] day1000 -> harvest overlay:', !!harvest, 'dayText:', dayText, 'screen:', JSON.parse(localStorage.getItem(SAVE_KEY)!).screen)
  })

  it('resume save where screen=harvest with currentEnding -> what does user see?', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({
      screen: 'harvest', day: 98, resolvingDay: false,
      currentEnding: { endingId: 'E01', imageIndex: 1, title: '테스트엔딩', hint: '', tier: 1, statKeys: ['gram'], score: 1, isNew: false, story: 's' },
      unlockedEndingIds: ['E01'],
    }))
    await renderApp()
    const harvest = document.querySelector('.harvest-overlay')
    const ending = document.querySelector('.ending-overlay')
    console.log('[EDGE] resume-harvest -> harvest:', !!harvest, 'ending:', !!ending)
  })
})

describe('ending branch verification', () => {
  it('stat=0 -> E32 cloud ending', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ stats: { gram: 500, large: 500, shape: 300, nutri: 300, regist: 300, hard: 0 } }))
    await renderApp()
    await finishToHarvest()
    console.log('[EDGE] stat0 ending:', getEndingTitleFromSave())
  })

  it('careCount=0 -> E30 pig food even with great stats', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ careCount: 0, stats: { gram: 800, large: 800, shape: 800, nutri: 800, regist: 800, hard: 800 } }))
    await renderApp()
    await finishToHarvest()
    console.log('[EDGE] careCount0 ending:', getEndingTitleFromSave())
  })

  it('large<25 -> E28 smallest potato', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ stats: { gram: 100, large: 10, shape: 50, nutri: 50, regist: 50, hard: 50 } }))
    await renderApp()
    await finishToHarvest()
    console.log('[EDGE] small ending:', getEndingTitleFromSave())
  })

  it('large&gram>900 -> E29 largest potato', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ stats: { gram: 950, large: 950, shape: 300, nutri: 300, regist: 300, hard: 300 } }))
    await renderApp()
    await finishToHarvest()
    console.log('[EDGE] big ending:', getEndingTitleFromSave())
  })
})

describe('monetization / ad gate', () => {
  it('cancel at ad gate -> back to title; is ending already unlocked in collection?', async () => {
    localStorage.setItem(SAVE_KEY, baseSave())
    await renderApp()
    await finishToHarvest()
    // step through to ad-confirm buttons
    for (let i = 0; i < 8; i++) {
      const cancelBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').includes('취소'))
      if (cancelBtn) { await act(async () => { fireEvent.click(cancelBtn) }); break }
      const card = document.querySelector('.harvest-card') as HTMLElement
      if (card) await act(async () => { fireEvent.click(card) })
      await tick(9)
    }
    const save = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '{}')
    console.log('[EDGE] ad-cancel -> unlockedEndingIds:', JSON.stringify(save.unlockedEndingIds), 'screen now title?', !!screen.queryByRole('button', { name: '시작하기' }))
    expect((save.unlockedEndingIds ?? []).length).toBe(0) // B4 fix: 광고 취소 시 도감 등록 없어야 함
    // 도감 진입해 스토리 노출 여부
    const colBtn = screen.queryByRole('button', { name: '도감' })
    if (colBtn) {
      await act(async () => { fireEvent.click(colBtn) })
      const colText = document.body.textContent ?? ''
      console.log('[EDGE] collection after cancel contains ending title?', save.unlockedEndingIds?.length ? colText.length > 0 : 'n/a')
    }
  })
})

describe('input stress', () => {
  it('rapid potato touch spam (150 clicks) -> combo capped, no crash', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ day: 10 }))
    await renderApp()
    const potatoBtn = document.querySelector('.potato-image')?.closest('button') ?? document.querySelector('button.potato-stage-button')
    console.log('[EDGE] potato button found:', !!potatoBtn)
    if (potatoBtn) {
      for (let i = 0; i < 150; i++) {
        fireEvent.pointerDown(potatoBtn, { clientX: 100, clientY: 100, pointerId: 1, isPrimary: true })
        fireEvent.pointerUp(potatoBtn, { clientX: 100, clientY: 100, pointerId: 1, isPrimary: true })
        if (i % 30 === 0) await tick(1)
      }
      await tick(5)
      const comboText = document.body.textContent?.match(/COMBO[^0-9]*(\d+)/)?.[1]
      console.log('[EDGE] after spam combo:', comboText, 'careCount:', JSON.parse(localStorage.getItem(SAVE_KEY)!).careCount)
    }
  })

  it('rapid skill button spam during game -> plan stays valid', async () => {
    localStorage.setItem(SAVE_KEY, baseSave({ day: 5 }))
    await renderApp()
    const skills = document.querySelectorAll('.legacy-skill')
    for (let i = 0; i < 60; i++) {
      const el = skills[i % skills.length] as HTMLElement
      if (el) fireEvent.click(el)
    }
    await tick(5)
    const save = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '{}')
    console.log('[EDGE] skill-spam plan:', JSON.stringify(save.plan), 'careCount:', save.careCount)
  })
})

describe('language switch', () => {
  it('EN mode renders translated title and stays stable', async () => {
    localStorage.setItem('potato-lang', 'en')
    await renderApp()
    const startEn = screen.queryByRole('button', { name: 'Start Game' })
    console.log('[EDGE] EN title start button:', !!startEn)
    expect(startEn).toBeTruthy()
  })
})
