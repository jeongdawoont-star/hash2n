// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { consoleErrors, consoleWarns } from './setup'

function snapshot(label: string) {
  const texts = Array.from(document.querySelectorAll('button, h1, h2, h3, p, span'))
    .map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim())
    .filter(Boolean).slice(0, 40)
  console.log(`[SNAPSHOT:${label}]`, JSON.stringify(texts))
}

async function tick(ms: number, step = 100) {
  for (let t = 0; t < ms; t += step) {
    await act(async () => { vi.advanceTimersByTime(step); await Promise.resolve() })
  }
}

describe('full playthrough (normal mode)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('title -> intro -> 98 days -> harvest -> ad -> ending -> collection', async () => {
    const { default: App } = await import('../src/App')
    render(<App />)

    // 1. 핫픽스 스플래시
    snapshot('boot')
    await tick(3000, 200)
    snapshot('after-splash')

    // 2. 타이틀 화면
    const startBtn = screen.getByRole('button', { name: '시작하기' })
    expect(startBtn).toBeTruthy()
    await act(async () => { fireEvent.click(startBtn) })
    snapshot('after-start-click')

    // 3. 씨감자 인트로: 이름 입력 + 슬롯 + 시작
    const nameInput = document.getElementById('potato-name-input') as HTMLInputElement
    expect(nameInput).toBeTruthy()
    fireEvent.change(nameInput, { target: { value: 'QA감자' } })
    const rollBtn = document.querySelector('.seed-roll-btn') as HTMLButtonElement
    await act(async () => { fireEvent.click(rollBtn) })
    await tick(4000, 200) // 릴 회전 대기
    const startGame = document.querySelector('.seed-start-btn') as HTMLButtonElement
    await act(async () => { fireEvent.click(startGame) })
    snapshot('game-start')

    // 4. 계획 선택: 스킬 버튼 3개 슬롯에 채우기
    for (let i = 0; i < 3; i++) {
      const skills = document.querySelectorAll('.legacy-skill')
      expect(skills.length).toBeGreaterThan(0)
      await act(async () => { fireEvent.click(skills[Math.min(i, skills.length - 1)] as HTMLElement) })
    }
    snapshot('plan-filled')

    // 5. 98일 진행 (이벤트 발생 시 첫 선택지 클릭)
    let safety = 0
    let lastDay = ''
    while (safety < 9000) {
      safety += 1
      await act(async () => { vi.advanceTimersByTime(100); await Promise.resolve() })
      // 이벤트 패널 처리
      const evtChoice = document.querySelector('.event-panel button, [class*="event"] button[class*="choice"]') as HTMLElement
      if (evtChoice && (evtChoice.textContent ?? '').length > 0) {
        await act(async () => { fireEvent.click(evtChoice) })
      }
      const harvest = document.querySelector('.harvest-overlay')
      if (harvest) break
      if (safety % 600 === 0) {
        const dayEl = document.body.textContent?.match(/Day\s*\d+/)?.[0] ?? '?'
        if (dayEl !== lastDay) { console.log('[PROGRESS]', dayEl, 'ticks=', safety); lastDay = dayEl }
      }
    }
    console.log('[LOOP-TICKS]', safety)
    expect(document.querySelector('.harvest-overlay')).toBeTruthy()
    snapshot('harvest')

    // 6. 수확 단계 진행 (클릭으로 스텝 넘기기)
    console.log('[HARVEST-HTML]', (document.querySelector('.harvest-overlay') as HTMLElement).textContent?.slice(0,300))
    for (let i = 0; i < 8; i++) {
      const card = document.querySelector('.harvest-card') as HTMLElement
      const slideTrack = document.querySelector('.ad-slide-track') as HTMLElement | null
      if (slideTrack) {
        // 슬라이드 제스처 시뮬레이션 (jsdom은 rect가 0이므로 컴포넌트의 기본 이동거리 160px 기준)
        await act(async () => {
          fireEvent.pointerDown(slideTrack, { pointerId: 1, clientX: 0 })
          fireEvent.pointerMove(slideTrack, { pointerId: 1, clientX: 200 })
          fireEvent.pointerUp(slideTrack, { pointerId: 1, clientX: 200 })
        })
        break
      }
      if (card) await act(async () => { fireEvent.click(card) })
      await tick(900, 300)
      console.log('[HARVEST-STEP]', i, Array.from(document.querySelectorAll('button')).map(b=>(b.textContent||'').trim()).filter(Boolean).join('|').slice(0,200))
    }
    snapshot('harvest-confirm')

    // 7. 광고 (브라우저 목업) — 5초 대기 후 건너뛰기
    await tick(500, 100)
    const adOverlay = document.querySelector('.ad-overlay')
    console.log('[AD-OVERLAY]', adOverlay ? 'shown' : 'NOT SHOWN')
    if (adOverlay) {
      await tick(6000, 500)
      const skipBtn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent ?? '').includes('건너뛰기'))
      if (skipBtn) await act(async () => { fireEvent.click(skipBtn) })
    }
    await tick(2000, 200)
    snapshot('ending')

    // 8. 엔딩 화면 검증
    const endingOverlay = document.querySelector('.ending-overlay')
    console.log('[ENDING-OVERLAY]', endingOverlay ? 'shown' : 'NOT SHOWN')
    expect(endingOverlay).toBeTruthy()

    // 9. 저장 데이터 확인
    const save = localStorage.getItem('potato-remake-classic-v2')
    console.log('[SAVE-AFTER-ENDING]', save ? JSON.parse(save).screen : 'none', save ? JSON.parse(save).unlockedEndingIds : '')
    const records = localStorage.getItem('potato-remake-records-v1')
    console.log('[RECORDS]', records ?? 'none')

    console.log('[CONSOLE-ERRORS]', JSON.stringify(consoleErrors.slice(0, 20)))
    console.log('[CONSOLE-WARNS]', JSON.stringify(consoleWarns.slice(0, 20)))
  }, 240000)
})
