import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { animated, config, useSpring } from "react-spring";
import { GENE_MENU } from "../genes/types";

interface TableControlsProps {
  numSelected: number;
  handleSave: (selected: any) => void; //todo: add type
  label: string;
}

interface GeneSaveOption {
  label: string;
  value: string;
}

export const TableControls: React.FC<TableControlsProps> = ({
  numSelected,
  handleSave,
  label,
}: TableControlsProps) => {
  const [selectedOption, setSelectedOption] = useState<GeneSaveOption>(
    GENE_MENU[0],
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const buttonSpring = useSpring({
    background: "white",
    border: "solid 1px rgb(32, 68, 97)",
  });

  const menuSpring = useSpring({
    transform: isMenuOpen ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
    opacity: isMenuOpen ? 1 : 0,
  });

  const { y } = useSpring({
    y: isMenuOpen ? 180 : 0,
  });

  const flipSpring = { transform: y.to((y) => `rotateX(${y}deg)`) };

  const separator = <div className={`h-full m-auto text-gray-300`}>|</div>;

  const on = {
    color: "rgb(32, 68, 97)",
    backgroundColor: "white",
  };
  const off = {
    color: "white",
    backgroundColor: "rgb(32, 68, 97)",
  };

  const selectedSpring = useSpring(numSelected === 0 ? on : off);

  const numberSpring = useSpring({
    immediate: false,
    config: config.slow,
    from: { num: 0 },
    to: { num: numSelected },
  });

  const colorSpring = useSpring({
    color: "rgb(32, 68, 97)",
  });

  const borderSpring = useSpring({
    border: "solid 1px rgb(32, 68, 97)",
  });

  return (
    <>
      <div className={`w-80 h-10 mx-auto my-0 justify-between mt-3`}>
        <animated.button
          className={`h-10 rounded`}
          style={buttonSpring}
          onClick={() => setIsMenuOpen((m) => !m)}
        >
          <div className={`flex flex-row w-80 justify-between`}>
            <animated.div
              style={selectedSpring}
              className={`mx-auto border-1 py-1 px-2 rounded-md text-xs`}
            >
              {numberSpring.num.to((x) => x.toFixed(0))}
            </animated.div>
            <animated.div style={colorSpring} className={`m-auto text-xs`}>
              {selectedOption ? selectedOption.label : ""}
            </animated.div>
            {separator}
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
                  style={selectedSpring}
                  className={`flex flex-row mt-1 rounded-t-md border-1 border-b-0 border-black py-2 px-1 text-xs`}
                >
                  <animated.div className={`mx-auto mr-0.5`}>
                    {numberSpring.num.to((x) => x.toFixed(0))}
                  </animated.div>
                  <span className={`m-auto ml-0.5`}>{label}</span>
                </animated.div>
                <animated.ul
                  style={{ ...colorSpring, ...borderSpring }}
                  className={`list-none rounded-b-md`}
                >
                  {GENE_MENU.filter(
                    ({ value }) => value !== selectedOption.value,
                  ).map((geneOpt, idx) => {
                    return (
                      <li
                        key={`gene-set-select-${idx}`}
                        onClick={() => setSelectedOption(geneOpt)}
                        className={`py-2 px-4 text-sm hover:bg-hoverColor rounded-md`}
                      >
                        {geneOpt.label}
                      </li>
                    );
                  })}
                </animated.ul>
              </div>
            )}
          </animated.div>
        </animated.button>
      </div>
    </>
  );
};
