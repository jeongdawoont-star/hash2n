import { StrictMode, Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 예기치 못한 크래시(손상된 세이브 등)에서 흰 화면 대신 복구 화면을 보여준다 (B2)
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Game crashed:', error, info)
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    try {
      localStorage.removeItem('potato-remake-classic-v2')
    } catch (err) {
      console.error('Failed to clear save:', err)
    }
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div
        style={{
          position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '12px',
          background: '#fffbe9', color: '#4a2814', textAlign: 'center',
          fontFamily: 'sans-serif', padding: '24px',
        }}
      >
        <div style={{ fontSize: '48px' }}>🥔💦</div>
        <h2 style={{ margin: 0 }}>앗! 감자밭에 문제가 생겼어요</h2>
        <p style={{ margin: 0, fontSize: '14px' }}>
          다시 시도해 보세요. 계속 반복되면 저장 데이터를 초기화할 수 있어요.
          <br />(초기화하면 진행 중인 감자만 사라지고, 새로 시작할 수 있습니다)
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={this.handleReload}
            style={{
              fontSize: '16px', fontWeight: 700, padding: '10px 20px', cursor: 'pointer',
              background: '#ffd34d', border: '3px solid #6b4a2b', borderRadius: '12px', color: '#4a2814',
            }}
          >
            다시 시도
          </button>
          <button
            type="button"
            onClick={this.handleReset}
            style={{
              fontSize: '16px', fontWeight: 700, padding: '10px 20px', cursor: 'pointer',
              background: '#fff', border: '3px solid #b05a3a', borderRadius: '12px', color: '#b05a3a',
            }}
          >
            저장 데이터 초기화
          </button>
        </div>
      </div>
    )
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
