import { useRef, useEffect, useState } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number; // Minimum distance for a swipe (px)
  velocity?: number; // Minimum velocity for a swipe (px/ms)
}

const DEFAULT_OPTIONS: Required<SwipeOptions> = {
  threshold: 50,
  velocity: 0.3,
};

/**
 * Hook for detecting swipe gestures
 */
export function useSwipe(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const { threshold, velocity } = { ...DEFAULT_OPTIONS, ...options };
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = distance / deltaTime;

      // Check if swipe meets threshold and velocity requirements
      if (distance >= threshold && speed >= velocity) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            setSwipeDirection('right');
            handlers.onSwipeRight?.();
          } else {
            setSwipeDirection('left');
            handlers.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            setSwipeDirection('down');
            handlers.onSwipeDown?.();
          } else {
            setSwipeDirection('up');
            handlers.onSwipeUp?.();
          }
        }
      }

      touchStart.current = null;
    };

    const element = document.body;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, threshold, velocity]);

  return { swipeDirection };
}

