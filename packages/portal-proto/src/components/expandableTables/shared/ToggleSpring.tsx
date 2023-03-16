import React, { ReactNode } from "react";
import { useSpring, animated } from "@react-spring/web";

interface ToggleSpringProps {
  isExpanded: boolean;
  icon: ReactNode;
}

const ToggleSpring: React.FC<ToggleSpringProps> = ({
  isExpanded,
  icon,
}: ToggleSpringProps) => {
  const polarSpring = useSpring({
    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
  });

  return (
    <animated.div style={polarSpring} className="bg-accent rounded-md h-3 w-3">
      {icon}
    </animated.div>
  );
};

export default ToggleSpring;
