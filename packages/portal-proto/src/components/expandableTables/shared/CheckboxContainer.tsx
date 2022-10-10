import React from "react";
import { animated } from "react-spring";
import CheckboxSpring from "../shared/CheckboxSpring";

interface CheckboxContainerProps {
  isActive: boolean;
  select: any;
  handleCheck: (select: any) => any;
  width: number;
  wSpring: any;
}

const CheckboxContainer: React.FC<CheckboxContainerProps> = ({
  isActive,
  select,
  handleCheck,
  wSpring,
}) => {
  return (
    <animated.div style={wSpring} className={`w-max`}>
      <CheckboxSpring
        isActive={isActive}
        handleCheck={handleCheck}
        select={select}
      />
    </animated.div>
  );
};

export default CheckboxContainer;
