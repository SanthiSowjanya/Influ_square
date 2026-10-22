import React, { Component, ReactNode, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("RootErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-rose-500/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold text-white">Application Loading Issue</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || 'A transient local storage or render exception was detected.'}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('creatorsphere_state_v2');
                window.location.reload();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer shadow-lg shadow-purple-600/30 transition-all"
            >
              Reset Session Cache & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)
