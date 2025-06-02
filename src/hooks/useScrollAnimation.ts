import { useEffect, useRef, useState, RefObject } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface ScrollAnimationReturn {
  ref: RefObject<HTMLElement>;
  isVisible: boolean;
  hasAnimated: boolean;
}

/**
 * Hook for triggering animations when elements enter the viewport
 */
export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {},
): ScrollAnimationReturn => {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const elementRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If user prefers reduced motion, show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true);
                setHasAnimated(true);
              }, delay);
            } else {
              setIsVisible(true);
              setHasAnimated(true);
            }

            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, delay, prefersReducedMotion]);

  return {
    ref: elementRef,
    isVisible,
    hasAnimated,
  };
};

/**
 * Hook for staggered animations on multiple elements
 */
export const useStaggeredAnimation = (
  count: number,
  staggerDelay: number = 100,
): Array<ScrollAnimationReturn> => {
  const animations = Array.from({ length: count }, (_, index) =>
    useScrollAnimation({
      delay: index * staggerDelay,
      triggerOnce: true,
    }),
  );

  return animations;
};

/**
 * Hook for animating counters/numbers
 */
export const useCounterAnimation = (
  target: number,
  duration: number = 2000,
  trigger: boolean = false,
): number => {
  const [count, setCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger) return;

    // If user prefers reduced motion, show final number immediately
    if (prefersReducedMotion) {
      setCount(target);
      return;
    }

    let startTime: number;
    const startValue = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(
        startValue + (target - startValue) * easeOutExpo,
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target, duration, trigger, prefersReducedMotion]);

  return count;
};

/**
 * Hook for typewriter effect
 */
export const useTypewriter = (
  text: string,
  speed: number = 50,
  trigger: boolean = false,
): string => {
  const [displayText, setDisplayText] = useState("");
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!trigger) return;

    // If user prefers reduced motion, show full text immediately
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    let index = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, trigger, prefersReducedMotion]);

  return displayText;
};

export default useScrollAnimation;
