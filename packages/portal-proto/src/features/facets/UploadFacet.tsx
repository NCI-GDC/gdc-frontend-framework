import React from "react";
import {
  Modals,
  showModal,
  useCoreDispatch,
  useCoreSelector,
  useGeneSymbol,
  selectCurrentCohortId,
  FilterSet,
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

interface UploadFacetProps {
  field: string;
  description?: string;
  facetButtonName?: string;
  width?: string;
  hooks: any;
}

interface GroupedOperands {
  cases?: (string | number)[];
  genes?: (string | number)[];
  ssms?: (string | number)[];
}

export const groupOperandsByKey = (filters: FilterSet): GroupedOperands => {
  const groupedOperands: GroupedOperands = { cases: [], genes: [], ssms: [] };
  // These will be the type of includes only
  Object.values(filters.root as Record<string, Includes>).forEach(
    ({ field, operands }) => {
      if (field === "cases.case_id") groupedOperands.cases.push(...operands);
      else if (field === "genes.gene_id")
        groupedOperands.genes.push(...operands);
      else if (field === "ssms.ssm_id") groupedOperands.ssms.push(...operands);
    },
  );

  return groupedOperands;
};

const UploadFacet: React.FC<UploadFacetProps> = ({
  field,
  description,
  facetButtonName,
  width,
  hooks,
}) => {
  const coreDispatch = useCoreDispatch();
  const currentCohortId = useCoreSelector(selectCurrentCohortId);
  const clearFilters = hooks.useClearFilter();
  const isCases = field.includes("cases.case_id");
  const isGenes = field.includes("genes.gene_id");
  const isSSMS = field.includes("ssms.ssm_id");

  const facetTitle = humanify({
    term: isCases ? "case id" : isGenes ? "gene" : "ssm id",
  });
  const filters = useCohortFacetFilters();
  const noFilters = Object.keys(filters?.root || {}).length === 0;

  const { cases, genes, ssms } = groupOperandsByKey(filters);

  const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
    field === "genes.gene_id" ? genes.map((x) => x.toString()) : [],
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
    } else {
      coreDispatch(showModal({ modal: Modals.GlobalMutationSetModal }));
    }
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
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
              {isCases && renderBadges(cases as string[], "cases.case_id")}
              {isGenes && renderBadges(genes as string[], "genes.gene_id")}
              {isSSMS && renderBadges(ssms as string[], "ssms.ssm_id")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFacet;
