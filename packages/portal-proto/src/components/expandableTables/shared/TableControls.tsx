import React, { useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { animated, useSpring } from "react-spring";

interface ControlOption {
  label: string;
  value: string;
}

interface TableControlsProps {
  numSelected: number;
  handleSave: (selected: any) => void; //todo: add type
  label: string;
  options: ControlOption[];
  additionalControls?: React.ReactNode;
}

export const TableControls: React.FC<TableControlsProps> = ({
  numSelected,
  handleSave,
  label,
  options,
  additionalControls,
}: TableControlsProps) => {
  const [selectedOption, setSelectedOption] = useState<ControlOption>(
    options[0],
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuSpring = useSpring({
    transform: isMenuOpen ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
    opacity: isMenuOpen ? 1 : 0,
  });

  const { y } = useSpring({
    y: isMenuOpen ? 180 : 0,
  });

  const flipSpring = { transform: y.to((y) => `rotateX(${y}deg)`) };

  const numberSpring = useSpring({
    immediate: true,
    from: { num: 0 },
    to: { num: numSelected },
  });

  return (
    <>
      <div className={`w-80 h-10 mx-auto my-0 justify-between mt-3`}>
        <button
          className={`h-10 rounded border border-1 border-activeColor`}
          onClick={() => setIsMenuOpen((m) => !m)}
        >
          <div className={`flex flex-row w-80 justify-between`}>
            <animated.div
              className={`mx-auto border-1 py-1 px-2 rounded-md text-xs ${
                numSelected === 0
                  ? `text-activeColor bg-white`
                  : `bg-activeColor text-white`
              }`}
            >
              {numberSpring.num.to((x) => x.toFixed(0))}
            </animated.div>
            <div className={`m-auto text-xs text-activeColor`}>
              {selectedOption ? selectedOption.label : ""}
            </div>
            <div className={`h-full m-auto text-gray-300`}>|</div>
            <animated.div className={`m-auto`} style={flipSpring}>
              <MdOutlineArrowDropDown />
            </animated.div>
          </div>
          <animated.div
            className={`absolute z-10 bg-white mt-5`}
            style={menuSpring}
          >
            {isMenuOpen && (
              <div className={`text-center`}>
                <animated.div
                  className={`flex flex-row mt-1 rounded-t-md border-1 border-b-0 border-black py-2 px-1 text-xs ${
                    numSelected === 0
                      ? `text-activeColor bg-white`
                      : `bg-activeColor text-white`
                  }`}
                >
                  <animated.div className={`mx-auto mr-0.5`}>
                    {numberSpring.num.to((x) => x.toFixed(0))}
                  </animated.div>
                  <span className={`m-auto ml-0.5`}>{label}</span>
                </animated.div>
                <animated.ul
                  className={`list-none rounded-b-md text-activeColor border border-1 border-activeColor`}
                >
                  {options
                    .filter(({ value }) => value !== selectedOption.value)
                    .map((option, idx) => {
                      return (
                        <li
                          key={`gene-set-select-${idx}`}
                          onClick={() => setSelectedOption(option)}
                          className={`py-2 px-4 text-sm hover:bg-hoverColor rounded-md`}
                        >
                          {option.label}
                        </li>
                      );
                    })}
                </animated.ul>
              </div>
            )}
          </animated.div>
        </button>
      </div>
      <div className={`ml-3 mt-3.5 float-left`}>{additionalControls}</div>
    </>
  );
};

export default TableControls;
