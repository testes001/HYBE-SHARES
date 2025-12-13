// ============================================================================
// FEATURE ERROR BOUNDARY COMPONENT
// ============================================================================

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home, Bug } from "lucide-react";

// ============================================================================
// ERROR BOUNDARY STATE & PROPS
// ============================================================================

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName: string;
  onRetry?: () => void;
  onNavigateHome?: () => void;
  fallback?: React.ReactNode;
}

// ============================================================================
// FEATURE ERROR BOUNDARY
// ============================================================================

export class FeatureErrorBoundary extends React.Component<
  FeatureErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    console.error(`Error in ${this.props.featureName}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-4">
          <Card className="bg-zinc-900 border-zinc-800 border-red-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Something went wrong
              </h3>

              <p className="text-gray-400 mb-4">
                An error occurred in the {this.props.featureName} feature.
                Please try again or go back to the home screen.
              </p>

              {this.state.error && (
                <div className="bg-zinc-800 rounded-lg p-4 mb-4 text-left">
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-2">
                    <Bug className="w-4 h-4" />
                    <span className="font-mono">Error Details</span>
                  </div>
                  <p className="text-red-300 text-sm font-mono break-all">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  className="border-zinc-700"
                  onClick={this.handleRetry}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                {this.props.onNavigateHome && (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={this.props.onNavigateHome}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// INLINE ERROR FALLBACK (for smaller sections)
// ============================================================================

interface InlineErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export const InlineErrorFallback = React.memo(function InlineErrorFallback({
  message = "Failed to load this section",
  onRetry,
}: InlineErrorFallbackProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400" />
        <span className="text-red-300 text-sm">{message}</span>
      </div>
      {onRetry && (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={onRetry}
        >
          <RefreshCcw className="w-4 h-4 mr-1" />
          Retry
        </Button>
      )}
    </div>
  );
});

// ============================================================================
// SUSPENSE FALLBACK
// ============================================================================

interface SuspenseFallbackProps {
  message?: string;
}

export const SuspenseFallback = React.memo(function SuspenseFallback({
  message = "Loading...",
}: SuspenseFallbackProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
});

// ============================================================================
// QUERY ERROR HANDLER
// ============================================================================

interface QueryErrorProps {
  error: Error;
  onRetry?: () => void;
}

export const QueryError = React.memo(function QueryError({
  error,
  onRetry,
}: QueryErrorProps) {
  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
        <h4 className="text-white font-medium mb-2">Failed to load data</h4>
        <p className="text-gray-400 text-sm mb-4">{error.message}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            className="border-zinc-700"
            onClick={onRetry}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
});

export default FeatureErrorBoundary;
