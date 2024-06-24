import React from "react";
import {
  FilterSet,
  Modals,
  showModal,
  trimFirstFieldNameToTitle,
  useCoreDispatch,
  useCoreSelector,
  useGeneSymbol,
  selectCurrentCohortId,
  Operation,
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

interface GroupedOperands {
  cases?: string[];
  genes?: string[];
  ssms?: string[];
}
type root = Omit<Operation, "Intersection" | "Union">;

const groupOperandsByKey = (filters: FilterSet): GroupedOperands => {
  const groupedOperands: GroupedOperands = { cases: [], genes: [], ssms: [] };

  Object.values(filters.root).forEach(({ field, operands }) => {
    if (field === "cases.case_id") groupedOperands.cases.push(...operands);
    else if (field === "genes.gene_id") groupedOperands.genes.push(...operands);
    else if (field === "ssms.ssm_id") groupedOperands.ssms.push(...operands);
  });

  return groupedOperands;
};

interface UploadFacetProps {
  field: string;
  description?: string;
  facetName?: string;
  width?: string;
  hooks: any;
}

const UploadFacet: React.FC<UploadFacetProps> = ({
  field,
  description,
  facetName,
  width,
  hooks,
}) => {
  const coreDispatch = useCoreDispatch();
  const currentCohortId = useCoreSelector(selectCurrentCohortId);
  const clearFilters = hooks.useClearFilter();
  const facetTitle = facetName || trimFirstFieldNameToTitle(field, true);
  const filters = useCohortFacetFilters();
  const noFilters = Object.keys(filters?.root || {}).length === 0;
  const isCases = field.includes("Cases");
  const isGenes = field.includes("Genes");
  const isSSM = field.includes("Mutations");
  const { cases, genes, ssms } = groupOperandsByKey(filters);

  const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
    field === "genes.gene_id" ? genes.map((x) => x.toString()) : [],
  );

  const renderBadges = (items, itemField) => {
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
      } bg-base-max relative shadow-lg border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          disabled={!description}
          label={description}
          position="bottom-start"
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>{facetTitle}</FacetText>
        </Tooltip>
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
          <Button variant="outline" fullWidth onClick={handleButtonClick}>
            {field}
          </Button>
        </div>
        <div className="mt-2">
          {noFilters ? null : (
            <div className="flex flex-wrap gap-1">
              {isCases && renderBadges(cases, "cases.case_id")}
              {isGenes && renderBadges(genes, "genes.gene_id")}
              {isSSM && renderBadges(ssms, "ssms.ssm_id")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFacet;
