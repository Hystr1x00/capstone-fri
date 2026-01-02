import { useEffect, useRef } from 'react';

/**
 * Lightweight scroll animation hook using Intersection Observer
 * Only triggers once when element enters viewport
 */
export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const { threshold = 0.1, rootMargin = '0px' } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.classList.add('visible');
      return;
    }

    // Check if element is already in viewport on mount
    const checkInitialVisibility = () => {
      // Use multiple checks to ensure DOM is ready
      const check = () => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        
        // Check if element is partially or fully visible
        const isPartiallyVisible = (
          rect.top < viewportHeight + 100 && // Add buffer
          rect.bottom > -100 && // Add buffer
          rect.left < viewportWidth &&
          rect.right > 0
        );

        if (isPartiallyVisible) {
          // Show immediately if already in viewport
          element.classList.add('visible');
          return true;
        }
        return false;
      };

      // Try immediately
      if (check()) return;

      // Try after a short delay
      setTimeout(() => {
        if (!element.classList.contains('visible')) {
          check();
        }
      }, 100);

      // Try after DOM is fully rendered
      requestAnimationFrame(() => {
        if (!element.classList.contains('visible')) {
          check();
        }
      });
    };

    // Check initial visibility
    checkInitialVisibility();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin]);

  return elementRef;
};

