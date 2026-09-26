import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console (in production, you'd send this to a logging service)
    console.error("Error caught by boundary:", error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[var(--color-bg-card)] rounded-2xl p-8 text-center border border-[var(--color-border)]">
            <div className="w-16 h-16 bg-[var(--color-error-bg)] rounded-lg flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-[var(--color-error)]" />
            </div>

            <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">
              Oops! Something went wrong
            </h2>

            <p className="text-[var(--color-text-muted)] mb-6">
              We encountered an unexpected error. Don't worry, your data is
              safe.
            </p>

            <div className="space-y-4">
              <button onClick={this.handleRetry} className="btn-primary w-full">
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="btn-secondary w-full"
              >
                Go to Homepage
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-[var(--color-error)] cursor-pointer text-sm">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-[var(--color-bg)] rounded-lg text-xs text-[var(--color-text-muted)] overflow-auto max-h-40">
                  <pre>{this.state.error.toString()}</pre>
                  <pre className="mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
