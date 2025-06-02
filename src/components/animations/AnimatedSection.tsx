import React, { forwardRef } from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useConditionalAnimation } from "../../hooks/useReducedMotion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: string;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Animated section component that triggers animations on scroll
 */
export const AnimatedSection = forwardRef<HTMLElement, AnimatedSectionProps>(
  (
    {
      children,
      animation = "animate-fade-in-up",
      delay = 0,
      threshold = 0.1,
      triggerOnce = true,
      className = "",
      as: Component = "div",
      ...props
    },
    forwardedRef,
  ) => {
    const { ref, isVisible } = useScrollAnimation({
      threshold,
      delay,
      triggerOnce,
    });

    const animationClass = useConditionalAnimation(animation);
    const finalClassName = `${className} ${
      isVisible ? animationClass : "opacity-0"
    }`.trim();

    return (
      <Component
        ref={forwardedRef || ref}
        className={finalClassName}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

AnimatedSection.displayName = "AnimatedSection";

export default AnimatedSection;
