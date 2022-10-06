import React, { ReactNode } from "react";
import { useSpring, animated, config } from "react-spring";

interface ToggleSpringProps {
  isExpanded: boolean;
  icon: ReactNode;
  twStyles: string;
}

const ToggleSpring: React.FC<ToggleSpringProps> = ({
  isExpanded,
  icon,
  twStyles,
}: ToggleSpringProps) => {
  const polarSpring = useSpring({
    transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
    config: config.molasses,
  });

  return (
    <>
      <animated.div style={polarSpring}>
        <div className={twStyles}>{icon}</div>
      </animated.div>
    </>
  );
};

export default ToggleSpring;
