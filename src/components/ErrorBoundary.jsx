import React from 'react';
<<<<<<< HEAD
import logger from '../utils/logger';
=======
import { AlertTriangle, RefreshCw } from 'lucide-react';
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
<<<<<<< HEAD
=======
    // Update state so the next render will show the fallback UI
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
<<<<<<< HEAD
    logger.error('Error caught by boundary', error, 'ErrorBoundary');
=======
    // Log the error to console (in production, you'd send this to a logging service)
    console.error('Error caught by boundary:', error, errorInfo);
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

<<<<<<< HEAD
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Refresh Page
            </button>
=======
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
              >
                Go to Homepage
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-red-400 cursor-pointer text-sm">
                  Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-black/20 rounded-lg text-xs text-gray-300 overflow-auto max-h-40">
                  <pre>{this.state.error.toString()}</pre>
                  <pre className="mt-2">{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
>>>>>>> e47c9c944d14aec022f207328df9a602db8a38f1
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 