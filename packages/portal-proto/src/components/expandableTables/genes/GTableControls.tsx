import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
// import { GENE_SET_OPTIONS } from "./types";
import { animated, config, useSpring } from "react-spring";
import { GENE_MENU } from "./types";

interface GTableControlsProps {
  selectedGenes: any;
  handleGeneSave: (genes: any) => void; //todo: add type
}

interface GeneSaveOption {
  label: string;
  value: string;
}

export const GTableControls: React.VFC<GTableControlsProps> = ({
  selectedGenes,
  handleGeneSave,
}: GTableControlsProps) => {
  const [selectedOption, setSelectedOption] = useState<GeneSaveOption>(
    GENE_MENU[0],
  );
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const buttonSpring = useSpring({
    background: isMenuOpen ? "gainsboro" : "white",
  });

  const menuSpring = useSpring({
    transform: isMenuOpen ? "translate3D(0,0,0)" : "translate3D(0,-40px,0)",
    opacity: isMenuOpen ? 1 : 0,
  });

  const { y } = useSpring({
    y: isMenuOpen ? 180 : 0,
  });

  const flipSpring = { transform: y.to((y) => `rotateX(${y}deg)`) };

  const separator = <div className={`h-full w-[1px] text-gray-300`}>|</div>;

  const nGenes = useSpring({
    immediate: false,
    config: config.slow,
    from: { num: 0 },
    to: { num: Object.keys(selectedGenes).length },
  });

  return (
    <>
      <div className={`w-80 h-10 mx-auto my-0 justify-between mt-3`}>
        <animated.button
          className={`h-10 rounded`}
          style={buttonSpring}
          onClick={() => setIsMenuOpen((m) => !m)}
        >
          {/* todo: animated component for number display */}
          {/* <animated.div style={numberSpring}>{selectedGenes.length}</animated.div>  */}
          <div className={`flex flex-row w-80 justify-between`}>
            <animated.div>{nGenes.num.to((x) => x.toFixed(0))}</animated.div>
            <div className={`mx-auto`}>
              {selectedOption ? selectedOption.label : ""}
            </div>
            {separator}
            <animated.div className={`mx-auto`} style={flipSpring}>
              <MdOutlineArrowDropDown />
            </animated.div>
          </div>

          <animated.div
            className={`absolute z-10 bg-gray-100 mt-5 rounded`}
            style={menuSpring}
          >
            {isMenuOpen && (
              <>
                <animated.div className={`mt-1 bg-blue`}>
                  {nGenes.num.to((x) => x.toFixed(0))}
                </animated.div>
                <ul className={`w-fit list-none float-right`}>
                  {GENE_MENU.filter(
                    (opt) => opt.value !== selectedOption.value,
                  ).map((geneOpt, idx) => {
                    return (
                      <li
                        key={`gene-set-select-${idx}`}
                        onClick={() => setSelectedOption(geneOpt)}
                        className="py-2 px-4 text-sm text-black-500 hover:bg-gray-100"
                      >
                        {geneOpt.label}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </animated.div>
        </animated.button>
      </div>
    </>
  );
};
