import React from "react";
import {
  useScrollAnimation,
  useCounterAnimation,
} from "../../hooks/useScrollAnimation";

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  separator?: string;
  decimals?: number;
  className?: string;
  threshold?: number;
}

/**
 * Component that animates a counter when it comes into view
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  start = 0,
  duration = 2000,
  suffix = "",
  prefix = "",
  separator = "",
  decimals = 0,
  className = "",
  threshold = 0.5,
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce: true,
  });
  const count = useCounterAnimation(end, duration, isVisible);

  const formatNumber = (num: number): string => {
    let formattedNum = decimals > 0 ? num.toFixed(decimals) : num.toString();

    if (separator) {
      formattedNum = formattedNum.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    }

    return `${prefix}${formattedNum}${suffix}`;
  };

  return (
    <span ref={ref} className={className}>
      {formatNumber(count)}
    </span>
  );
};

export default AnimatedCounter;
