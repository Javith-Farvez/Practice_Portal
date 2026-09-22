import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 bg-[#FAF7F2] dark:bg-[#16110D]">
          <div className="max-w-md w-full bg-[#FFFDF9] dark:bg-[#1E1813] border border-[#E5DED4] dark:border-stone-800 rounded-3xl p-8 text-center shadow-lg space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/40 text-[#E76F51] flex items-center justify-center mx-auto shadow-xs">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#17211B] dark:text-amber-50">
                Something went wrong
              </h2>
              <p className="text-xs text-[#5F665F] dark:text-stone-400 leading-relaxed">
                An unexpected error occurred while rendering this section. You can reload the page or return to the learning dashboard.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl text-left">
                <p className="text-[11px] font-mono text-red-700 dark:text-red-400 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E76F51] hover:bg-[#d85e40] shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#17211B] dark:text-stone-200 bg-[#FAF6EE] dark:bg-stone-800 border border-[#E8DFC8] dark:border-stone-700 hover:bg-stone-200 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
