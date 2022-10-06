import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { animated, config, useSpring } from "react-spring";
import { GENE_MENU } from "./types";

interface GTableControlsProps {
  selectedGenes: number;
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

  const selectedSpring = useSpring(
    selectedGenes === 0
      ? {
          from: {
            color: "rgb(32, 68, 97)",
            backgroundColor: "white",
          },
          to: {
            color: "rgb(32, 68, 97)",
            backgroundColor: "white",
          },
        }
      : {
          from: {
            color: "white",
            backgroundColor: "rgb(32, 68, 97)",
          },
          to: {
            color: "white",
            backgroundColor: "rgb(32, 68, 97)",
          },
        },
  );

  const nGenes = useSpring({
    immediate: false,
    config: config.slow,
    from: { num: 0 },
    to: { num: selectedGenes },
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
              {nGenes.num.to((x) => x.toFixed(0))}
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
                  className={`mt-1 rounded-t-md border-1 border-b-0 border-black py-2 px-1 text-xs flex flex-row`}
                >
                  <animated.div className={`mx-auto mr-0.5`}>
                    {nGenes.num.to((x) => x.toFixed(0))}
                  </animated.div>
                  <span className={`m-auto ml-0.5`}>Genes</span>
                </animated.div>
                <animated.ul
                  style={{ ...colorSpring, ...borderSpring }}
                  // on hover: rgb(226 232 240)
                  className={`list-none rounded-b-md`}
                >
                  {GENE_MENU.filter(
                    (opt) => opt.value !== selectedOption.value,
                  ).map((geneOpt, idx) => {
                    return (
                      <li
                        key={`gene-set-select-${idx}`}
                        onClick={() => setSelectedOption(geneOpt)}
                        className={`py-2 px-4 text-sm hover:bg-gray rounded-md`}
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
