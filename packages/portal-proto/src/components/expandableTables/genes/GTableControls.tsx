import React, { useEffect, useState } from "react";
import { NativeSelect } from "@mantine/core";
import {
  MdArrowDropDown as DropDownIcon,
  MdSearch as SearchIcon,
} from "react-icons/md";
import { GENE_SET_OPTIONS } from "./types";
import { UnstyledButton } from "@mantine/core";

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

  useEffect(() => {
    setGeneOptions((prevOpts) => {
      const newOpts = [...prevOpts];
      newOpts[1].label = `${selectedGenes.length} Genes`;
      return newOpts;
    });
  }, [selectedGenes.length]);

  // const props = {};
  //react-select Select looks closer to mockup but linter doesnt like

  return (
    <div className={`border-opacity-0 p-4`}>
      <div className={`p-4`}>
        <span>{selectedGenes.length}</span>
        <NativeSelect
          rightSection={<DropDownIcon />}
          data={geneOptions}
          value={selectedOption.label}
          className={`border-base-light w-80 p-0 z-10`}
          onChange={handleGeneSave}
        />
      </div>
      <UnstyledButton>JSON</UnstyledButton>
      <UnstyledButton>TSV</UnstyledButton>
    </div>
  );
};
