import React, { ReactNode } from "react";
import { useSpring, animated } from "react-spring";

interface SpringToggleProps {
  isExpanded: boolean;
  icon: ReactNode;
  twStyles: string;
}

const SpringToggle: React.VFC<SpringToggleProps> = ({
  isExpanded,
  icon,
  twStyles,
}: SpringToggleProps) => {
  const polarSpring = useSpring({
    transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)",
    config: { mass: 1, tension: 5, friction: 5 },
  });

  return (
    <>
      <animated.div style={polarSpring}>
        <div className={twStyles}>{icon}</div>
      </animated.div>
    </>
  );
};

export default SpringToggle;
