import React from "react";
import {
  Modals,
  showModal,
  useCoreDispatch,
  useCoreSelector,
  useGeneSymbol,
  selectCurrentCohortId,
  Includes,
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
}

const UploadFacet: React.FC<UploadFacetProps> = ({
  field,
  description,
  facetButtonName,
  width,
  useClearFilter,
}) => {
  const coreDispatch = useCoreDispatch();
  const currentCohortId = useCoreSelector(selectCurrentCohortId);
  const clearFilters = useClearFilter();
  const isCases = field === "cases.case_id";
  const isGenes = field === "genes.gene_id";
  const isSSMS = field === "ssms.ssm_id";

  const facetTitle = humanify({
    term: isCases ? "case id" : isGenes ? "gene" : "ssm id",
  });

  const filters = useCohortFacetFilters();
  const noFilters = Object.keys(filters?.root || {}).length === 0;

  const items = useDeepCompareMemo(() => {
    const includeFilters = Object.values(
      filters.root as Record<string, Includes>,
    );
    if (isCases) {
      return (
        includeFilters.find((f) => f.field === "cases.case_id")?.operands || []
      );
    }
    if (isGenes) {
      return (
        includeFilters.find((f) => f.field === "genes.gene_id")?.operands || []
      );
    }
    if (isSSMS) {
      return (
        includeFilters.find((f) => f.field === "ssms.ssm_id")?.operands || []
      );
    }
    return [];
  }, [filters, isCases, isGenes, isSSMS]);

  const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
    isGenes ? items.map((x) => x.toString()) : [],
  );

  const renderBadges = (
    items: string[],
    itemField: "cases.case_id" | "genes.gene_id" | "ssms.ssm_id",
  ) => {
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
    if (isCases) {
      coreDispatch(showModal({ modal: Modals.GlobalCaseSetModal }));
    } else if (isGenes) {
      coreDispatch(showModal({ modal: Modals.GlobalGeneSetModal }));
    } else if (isSSMS) {
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
              {isCases && renderBadges(items as string[], "cases.case_id")}
              {isGenes && renderBadges(items as string[], "genes.gene_id")}
              {isSSMS && renderBadges(items as string[], "ssms.ssm_id")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFacet;
