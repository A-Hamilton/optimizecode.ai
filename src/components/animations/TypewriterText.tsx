import React from "react";
import {
  useScrollAnimation,
  useTypewriter,
} from "../../hooks/useScrollAnimation";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  cursor?: boolean;
  cursorChar?: string;
  loop?: boolean;
  loopDelay?: number;
}

/**
 * Component that creates a typewriter effect for text
 */
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = "",
  cursor = true,
  cursorChar = "|",
  loop = false,
  loopDelay = 2000,
}) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.5,
    triggerOnce: !loop,
    delay,
  });

  const displayText = useTypewriter(text, speed, isVisible);
  const [showCursor, setShowCursor] = React.useState(cursor);

  React.useEffect(() => {
    if (!cursor) return;

    if (displayText === text) {
      if (loop) {
        setTimeout(() => {
          setShowCursor(false);
          // Reset for loop
          setTimeout(() => {
            setShowCursor(true);
          }, 100);
        }, loopDelay);
      } else {
        // Hide cursor after typing is complete
        setTimeout(() => setShowCursor(false), 1000);
      }
    }
  }, [displayText, text, cursor, loop, loopDelay]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {showCursor && (
        <span className="animate-pulse text-primary ml-1">{cursorChar}</span>
      )}
    </span>
  );
};

export default TypewriterText;
