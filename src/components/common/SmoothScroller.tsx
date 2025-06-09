
'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

// This component initializes Lenis for smooth scrolling effects.
// It does not render any visible UI itself.
export function SmoothScroller() {
  const lenisInstanceRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // If reduced motion is preferred, do not initialize Lenis.
      // Ensure any Lenis-specific classes are removed from <html> if they were somehow added.
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
      return; // Exit early, native browser scrolling will be used.
    }

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      // Default options are generally good. You can uncomment and tweak these if needed.
      // lerp: 0.1, // Lower for more smoothness, higher for more responsiveness
      // duration: 1.2,
      // smoothWheel: true,
      // smoothTouch: false, // Often better to keep native touch behavior for compatibility
    });
    lenisInstanceRef.current = lenis;

    // Animation frame loop for Lenis
    function rafLoop(time: number) {
      if (lenisInstanceRef.current) {
        lenisInstanceRef.current.raf(time);
      }
      rafRef.current = requestAnimationFrame(rafLoop);
    }
    rafRef.current = requestAnimationFrame(rafLoop);

    // Cleanup function to destroy Lenis instance and cancel animation frame on unmount
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (lenisInstanceRef.current) {
        lenisInstanceRef.current.destroy();
        lenisInstanceRef.current = null;
      }
      // Clean up classes Lenis adds to <html>
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-scrolling', 'lenis-stopped');
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount and cleans up on unmount

  return null; // This component is for side-effects only and renders nothing.
}
