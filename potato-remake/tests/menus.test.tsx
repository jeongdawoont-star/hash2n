// @vitest-environment jsdom
import { it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'

beforeEach(() => { localStorage.clear(); vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers(); cleanup() })

async function tick(n: number) {
  for (let i = 0; i < n; i++) await act(async () => { vi.advanceTimersByTime(100); await Promise.resolve() })
}

it('title menus open/close without crash', async () => {
  vi.resetModules()
  const { default: App } = await import('../src/App')
  render(<App />)
  await tick(12)
  for (const name of ['도감', '업적', '랭킹', '설정']) {
    const btn = screen.getAllByRole('button', { name }).find(b => !(b as HTMLButtonElement).disabled)!
    await act(async () => { fireEvent.click(btn) })
    const bodyLen = (document.body.textContent ?? '').length
    console.log('[MENU]', name, 'opened, textLen=', bodyLen)
    // close: find ✕ / 닫기 / overlay close button
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => {
      const t = (b.textContent ?? '').trim()
      return t === '✕' || t.includes('닫기') || t.includes('타이틀로') || t.includes('돌아가기') || t === 'X'
    })
    if (closeBtn) await act(async () => { fireEvent.click(closeBtn) })
    else console.log('[MENU]', name, 'NO CLOSE BUTTON FOUND')
    await tick(3)
    expect(screen.queryByRole('button', { name: '시작하기' })).toBeTruthy()
  }
  // 종료 버튼 (모달 확인)
  const exitBtn = screen.getByRole('button', { name: '종료' })
  await act(async () => { fireEvent.click(exitBtn) })
  console.log('[MENU] 종료 modal text:', (document.body.textContent ?? '').includes('종료'))
}, 60000)
