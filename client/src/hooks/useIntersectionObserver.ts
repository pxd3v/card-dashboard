import { useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

interface UseIntersectionObserverReturn {
  loadingRef: React.RefObject<HTMLDivElement | null>;
  disconnect: () => void;
}

export function useIntersectionObserver(
  onIntersect: () => void,
  hasMore: boolean,
  loadingMore: boolean,
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  }, []);

  useEffect(() => {
    if (loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onIntersect();
        }
      },
      { 
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin
      }
    );

    observerRef.current = observer;

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return disconnect;
  }, [hasMore, loadingMore, onIntersect, disconnect, options.threshold, options.rootMargin]);

  return { loadingRef, disconnect };
} 