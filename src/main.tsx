import { Component, ReactNode, ErrorInfo } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '30px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#ff5b8a' }}>🎒 Đã xảy ra lỗi khi tải trang</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            {this.state.error?.message || 'Vui lòng bấm nút bên dưới để tải lại trang'}
          </p>
          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch {
                // ignore
              }
              window.location.reload();
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff5b8a',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '12px'
            }}
          >
            🔄 Làm mới trang
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

declare global {
  interface Window {
    __ZH_APP_MOUNTED__?: boolean;
  }
}

window.__ZH_APP_MOUNTED__ = true;

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
