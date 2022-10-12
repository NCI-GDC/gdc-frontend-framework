import React, { useEffect } from "react";
import { useSpring, animated } from "react-spring";

interface CheckboxSpringProps {
  isActive: boolean;
  select: any;
  handleCheck: (select: any) => any;
  wSpring: any;
}

/**
 * This component is a checkbox used in ExpTable
 *
 * @param isActive  // status of the checkbox
 * @param select // the item the checkbox corresponds to
 * @param handleCheck: // selects or deselects the item
 * @param wSpring: // width of the element in a spring
 * @constructor
 */

const CheckboxSpring: React.FC<CheckboxSpringProps> = ({
  isActive,
  select,
  handleCheck,
  wSpring,
}) => {
  const box = useSpring({
    backgroundColor: isActive ? "rgb(32, 68, 97)" : "white",
    height: 15,
    width: 15,
    color: "rgb(32, 68, 97)",
  });

  return (
    <animated.div style={wSpring} className={`w-max`}>
      <div className={`flex flex-row w-max m-auto h-max`}>
        <animated.div className={`my-auto mx-12`}>
          <animated.button style={box} onClick={() => handleCheck(select)}>
            ▢
          </animated.button>
        </animated.div>
      </div>
    </animated.div>
  );
};

export default CheckboxSpring;
