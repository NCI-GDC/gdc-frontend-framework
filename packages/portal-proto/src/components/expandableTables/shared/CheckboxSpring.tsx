import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";

interface CheckboxSpringProps {
  isActive: boolean;
  select: any;
  handleCheck: (select: any) => any;
}

const CheckboxSpring: React.FC<CheckboxSpringProps> = ({
  isActive,
  select,
  handleCheck,
}) => {
  const box = useSpring({
    backgroundColor: isActive ? "rgb(32, 68, 97)" : "white",
    height: 15,
    width: 15,
    color: "rgb(32, 68, 97)",
  });

  return (
    <div className={`flex flex-row w-max m-auto h-max`}>
      <animated.div className={`my-auto mx-12`}>
        <animated.button style={box} onClick={() => handleCheck(select)}>
          ▢
        </animated.button>
      </animated.div>
    </div>
  );
};

export default CheckboxSpring;
