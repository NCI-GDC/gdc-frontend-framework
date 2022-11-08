import React from "react";
import { useSpring, animated } from "react-spring";

interface CheckboxSpringProps {
  isActive: boolean;
  select: any;
  handleCheck: (select: any) => any;
  multi: boolean;
}

/**
 * This component is a checkbox used in ExpTable
 *
 * @param isActive  // status of the checkbox
 * @param select // the item the checkbox corresponds to
 * @param handleCheck // selects or deselects the item
 * @param multi // boolean -indicates if one or multiple rows being selected at once
 * @constructor
 */

const CheckboxSpring: React.FC<CheckboxSpringProps> = ({
  isActive,
  select,
  handleCheck,
  multi,
}) => {
  const box = useSpring({
    height: 15,
    width: 15,
  });
  return (
    <div className={`flex flex-row h-max`}>
      <animated.div className={`m-auto`}>
        <animated.button
          style={box}
          className={`${isActive ? `bg-activeColor` : `bg-white`}`}
          onClick={() =>
            handleCheck(
              multi
                ? { type: isActive ? "deselectAll" : "selectAll", rows: select }
                : { type: isActive ? "deselect" : "select", rows: [select] },
            )
          }
        >
          ▢
        </animated.button>
      </animated.div>
    </div>
  );
};

export default CheckboxSpring;
