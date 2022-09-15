import React, { useEffect, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { GENE_SET_OPTIONS } from "./types";
import { animated, useSpring } from "react-spring";

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
  const [geneOptions, setGeneOptions] =
    useState<GeneSaveOption[]>(GENE_SET_OPTIONS);
  const [selectedOption, setSelectedOption] = useState<GeneSaveOption>(
    GENE_SET_OPTIONS[0],
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

  useEffect(() => {
    setGeneOptions((prevOpts) => {
      const newOpts = [...prevOpts];
      newOpts[1].label = `${selectedGenes.length} Genes`;
      return newOpts;
    });
  }, [selectedGenes.length]);

  const separator = <div className={`h-full w-[1px] text-gray-300`}>|</div>;

  return (
    <>
      <div className={`relative w-80 h-10 mx-auto my-0 justify-between mt-3`}>
        <animated.button
          className={`h-10 rounded`}
          style={buttonSpring}
          onClick={() => setIsMenuOpen((m) => !m)}
        >
          {/* todo: animated component for number display */}
          {/* <animated.div style={numberSpring}>{selectedGenes.length}</animated.div>  */}
          <div className={`flex flex-row w-80 justify-between`}>
            <div className={`ml-10`}>
              {selectedOption ? selectedOption.label : ""}
            </div>
            {separator}
            <animated.div style={flipSpring} className={`mr-10`}>
              <MdOutlineArrowDropDown />
            </animated.div>
          </div>
          <animated.div
            className={`absolute bg-gray-100 mt-5 rounded`}
            style={menuSpring}
          >
            {isMenuOpen && (
              <div className={`w-80`}>
                {GENE_SET_OPTIONS.map((geneOpt, idx) => {
                  return (
                    <li>
                      <button
                        key={`gene-set-select-${idx}`}
                        type="button"
                        onClick={() => setSelectedOption(geneOpt)}
                        className="py-2 px-4 text-sm text-black-500 hover:bg-gray-100"
                      >
                        <div className="items-center">{geneOpt.label}</div>
                      </button>
                    </li>
                  );
                })}
              </div>
            )}
          </animated.div>
        </animated.button>
      </div>
    </>
  );
};
