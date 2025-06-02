import React from "react";
import { useStaggeredAnimation } from "../../hooks/useScrollAnimation";
import { useConditionalAnimation } from "../../hooks/useReducedMotion";

interface StaggeredListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  animation?: string;
  className?: string;
  itemClassName?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Component that applies staggered animations to child elements
 */
export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  staggerDelay = 100,
  animation = "animate-fade-in-up",
  className = "",
  itemClassName = "",
  as: Component = "div",
}) => {
  const animations = useStaggeredAnimation(children.length, staggerDelay);

  return (
    <Component className={className}>
      {children.map((child, index) => {
        const { ref, isVisible } = animations[index];
        const animationClass = useConditionalAnimation(animation);
        const finalClassName = `${itemClassName} ${
          isVisible ? animationClass : "opacity-0"
        }`.trim();

        return (
          <div key={index} ref={ref} className={finalClassName}>
            {child}
          </div>
        );
      })}
    </Component>
  );
};

export default StaggeredList;
