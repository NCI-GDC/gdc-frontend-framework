import React, { useEffect, useState } from "react";
import { NativeSelect } from "@mantine/core";
import {
  MdArrowDropDown as DropDownIcon,
  MdSearch as SearchIcon,
} from "react-icons/md";
import { GENE_SET_OPTIONS } from "./types";
import { Button } from "@mantine/core";

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
  const [geneMenu, setGeneMenu] = useState<boolean>(false);

  useEffect(() => {
    setGeneOptions((prevOpts) => {
      const newOpts = [...prevOpts];
      newOpts[1].label = `${selectedGenes.length} Genes`;
      return newOpts;
    });
  }, [selectedGenes.length]);

  return (
    <div className={`flex flex-row mt-2`}>
      <div className={`flex flex-row h-12 bg-gray items-center`}>
        <div className={`flex flex-row items-center mt-1 p-2`}>
          <div className={`flex flex-col`}>
            <button
              onClick={() => setGeneMenu((g) => !g)}
              className="flex flex-row z-10 items-center py-2 px-5 text-sm font-sm text-center text-black-500 border border-black bg-gray-100 rounded hover:bg-gray-300"
            >
              <span className={`bg-blue ml-2 mr-2`}>
                {Object.keys(selectedGenes).length}
              </span>
              Save/Edit Gene Set
            </button>
            {/* todo: keep button in place, show list options under */}
            <div
              className={`${
                geneMenu ? "" : "hidden"
              } z-10 w-60 bg-white rounded`}
            >
              <ul className="text-sm text-gray-500 dark:text-gray-200">
                {GENE_SET_OPTIONS.map((geneOpt, idx) => {
                  return (
                    <li>
                      <button
                        key={`gene-set-select-${idx}`}
                        type="button"
                        className="py-2 px-4 w-full text-sm text-black-500 hover:bg-gray-100"
                      >
                        <div className="items-center">{geneOpt.label}</div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {/* <NativeSelect
                    rightSection={<DropDownIcon />}
                    data={geneOptions}
                    value={selectedOption.label}
                    className={`border-none w-80 p-0 z-10 `}
                    onChange={handleGeneSave}
                /> */}
        </div>
      </div>
      <div className={`flex flex-row`}>
        <div className={`p-2`}>
          <Button
            className={
              "text-xs bg-base-lightest text-base-contrast-lightest border-primary-darkest hover:bg-gray-300"
            }
          >
            JSON
          </Button>
        </div>
        <div className={`p-2`}>
          <Button
            className={
              "text-xs bg-base-lightest text-base-contrast-lightest border-primary-darkest hover:bg-gray-300"
            }
          >
            TSV
          </Button>
        </div>
      </div>
    </div>
  );
};
