import React from "react";
import {
  Modals,
  showModal,
  useCoreDispatch,
  useCoreSelector,
  useGeneSymbol,
  selectCurrentCohortId,
  Includes,
  trimFirstFieldNameToTitle,
} from "@gff/core";
import { Button, Tooltip } from "@mantine/core";
import {
  controlsIconStyle,
  FacetHeader,
  FacetIconButton,
  FacetText,
} from "./components";
import { FaUndo as UndoIcon } from "react-icons/fa";
import { useCohortFacetFilters } from "../cohortBuilder/utils";
import CohortBadge from "../cohortBuilder/CohortBadge";
import { humanify } from "@/utils/index";
import { FacetRequiredHooks } from "./types";
import { useDeepCompareMemo } from "use-deep-compare";

interface UploadFacetProps {
  field: string;
  description?: string;
  facetButtonName?: string;
  width?: string;
  useClearFilter: FacetRequiredHooks["useClearFilter"];
  customFaceTitle?: string;
}

const UploadFacet: React.FC<UploadFacetProps> = ({
  field,
  description,
  facetButtonName,
  width,
  useClearFilter,
  customFaceTitle,
}) => {
  const coreDispatch = useCoreDispatch();
  const currentCohortId = useCoreSelector(selectCurrentCohortId);
  const clearFilters = useClearFilter();

  const facetTitle = humanify({
    term: customFaceTitle
      ? customFaceTitle
      : trimFirstFieldNameToTitle(field, true),
  });

  const filters = useCohortFacetFilters();
  const noFilters = Object.keys(filters?.root || {}).length === 0;

  const items = useDeepCompareMemo(() => {
    const includeFilters = Object.values(
      filters.root as Record<string, Includes>,
    );
    return includeFilters.find((f) => f.field === field)?.operands || [];
  }, [filters, field]);

  const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
    field === "genes.gene_id" ? items.map((x) => x.toString()) : [],
  );

  const renderBadges = (items: string[], itemField: string) => {
    return items.map((item, index) => (
      <CohortBadge
        key={index}
        field={itemField}
        value={item}
        customTestid={`query-rep-${itemField}-${item}-${index}`}
        operands={items}
        operator="includes"
        currentCohortId={currentCohortId}
        geneSymbolDict={geneSymbolDict}
        isSuccess={isSuccess}
      />
    ));
  };

  const handleButtonClick = () => {
    if (field === "cases.case_id") {
      coreDispatch(showModal({ modal: Modals.GlobalCaseSetModal }));
    } else if (field === "genes.gene_id") {
      coreDispatch(showModal({ modal: Modals.GlobalGeneSetModal }));
    } else if (field === "ssms.ssm_id") {
      coreDispatch(showModal({ modal: Modals.GlobalMutationSetModal }));
    }
  };

  return (
    <div
      className={`flex flex-col ${
        width || "mx-0"
      } bg-base-max border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <FacetText>{facetTitle}</FacetText>
        <div className="flex flex-row">
          <Tooltip label="Clear selection">
            <FacetIconButton
              onClick={() => clearFilters(field)}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" className={controlsIconStyle} />
            </FacetIconButton>
          </Tooltip>
        </div>
      </FacetHeader>
      <div className="p-4">
        <div className="flex justify-center">
          <Tooltip
            disabled={!description}
            label={description}
            multiline
            w={220}
            withArrow
            transitionProps={{ duration: 200, transition: "fade" }}
          >
            <Button variant="outline" fullWidth onClick={handleButtonClick}>
              {facetButtonName}
            </Button>
          </Tooltip>
        </div>
        <div className="mt-2">
          {noFilters ? null : (
            <div className="flex flex-wrap gap-1">
              {renderBadges(items as string[], field)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFacet;
