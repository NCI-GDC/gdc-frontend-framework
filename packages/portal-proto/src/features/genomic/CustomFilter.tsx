import React from "react";
import { Button } from "@mantine/core";
import {
  controlsIconStyle,
  FacetHeader,
  FacetIconButton,
  FacetText,
} from "@/features/facets/components";
import { FaUndo as UndoIcon } from "react-icons/fa";

interface CustomFiltersProps {
  label: string;
  clearFilters?: (_: string) => void;
  width?: string;
}

const CustomFilterFacet: React.FC<CustomFiltersProps> = ({
  label,
  clearFilters = () => null,
  width = undefined,
}: CustomFiltersProps) => {
  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-1"
      } bg-base-max relative shadow-lg border-primary-lightest border-1 text-xs  rounded-b-md transition`}
    >
      <FacetHeader>
        <FacetText>{`Custom ${label} Filter`}</FacetText>
        <div className="flex flex-row">
          <FacetIconButton
            onClick={() => clearFilters("")}
            aria-label="clear selection"
          >
            <UndoIcon size="1.25em" className={controlsIconStyle} />
          </FacetIconButton>
        </div>
      </FacetHeader>
      <div className="flex justify-center p-1">
        <Button className="w-100">{`+ Add Custom ${label} Filter`}</Button>
      </div>
    </div>
  );
};

export default CustomFilterFacet;
