import React from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  isTransitioning: boolean;
  className?: string;
}

/**
 * PageTransition - A premium loading overlay with micro-interactions.
 * Provides visual feedback with sophisticated animations during navigation,
 * preventing double-clicking and enhancing perceived performance.
 */
export function PageTransition({ isTransitioning, className }: PageTransitionProps) {
  if (!isTransitioning) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-black/70 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-5 animate-fade-in">
        {/* Premium animated spinner */}
        <div className="relative w-20 h-20">
          {/* Outer glow pulse */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500/40 to-purple-600/40 blur-xl animate-pulse-glow" />

          {/* Rotating ring 1 - outer */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 border-r-violet-500/50 animate-spin-slow" />

          {/* Rotating ring 2 - middle (counter-rotation) */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-500 border-l-purple-500/50 animate-spin-reverse" />

          {/* Rotating ring 3 - inner */}
          <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-fuchsia-500 border-r-fuchsia-500/50 animate-spin" />

          {/* Center dot with pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 animate-ping-slow" />
            <div className="absolute w-3 h-3 rounded-full bg-gradient-to-br from-violet-300 to-purple-500" />
          </div>
        </div>

        {/* Loading text with shimmer effect */}
        <div className="relative overflow-hidden">
          <p className="text-white/90 text-sm font-medium tracking-widest uppercase">
            Loading
          </p>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Animated dots */}
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce-dot" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce-dot" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-bounce-dot" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to create a navigation function with transition animation.
 * Returns a wrapped setCurrentView that shows loading state during navigation.
 */
export function usePageTransition<T>(
  setCurrentView: React.Dispatch<React.SetStateAction<T>>,
  transitionDuration: number = 400
): {
  navigateTo: (view: T) => void;
  isTransitioning: boolean;
} {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  const navigateTo = React.useCallback(
    (view: T) => {
      // Prevent double-clicking by checking if already transitioning
      if (isTransitioning) return;

      // Clear any existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Start transition
      setIsTransitioning(true);

      // Schedule the actual view change after a brief delay
      // This allows the loading overlay to appear smoothly
      timeoutRef.current = window.setTimeout(() => {
        setCurrentView(view);

        // End transition after content has "loaded"
        timeoutRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
        }, transitionDuration / 2);
      }, transitionDuration / 2);
    },
    [setCurrentView, transitionDuration, isTransitioning]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { navigateTo, isTransitioning };
}

export default PageTransition;
