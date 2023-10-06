import React from "react";
import { Badge, Group, Tooltip, Button, ActionIcon } from "@mantine/core";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import {
  trimFirstFieldNameToTitle,
  useCoreDispatch,
  showModal,
  EnumOperandValue,
  Modals,
  useGeneSymbol,
  useGeneSetCountQuery,
  useSsmSetCountQuery,
} from "@gff/core";
import {
  controlsIconStyle,
  FacetIconButton,
  FacetText,
  FacetHeader,
} from "@/features/facets/components";
import { FacetCardProps, SetFacetHooks } from "./types";
import QueryRepresentationLabel from "./QueryRepresentationLabel";

const FACET_TO_MODAL = {
  "genes.gene_id": Modals.LocalGeneSetModal,
  "cases.case_id": Modals.LocalCaseSetModal,
  "ssms.ssm_id": Modals.LocalMutationSetModal,
};

const removeButton = (x: string | number) => {
  return (
    <ActionIcon
      size="xs"
      color="white"
      radius="xl"
      variant="transparent"
      arial-label={`remove ${x} from filter`}
    >
      <CloseIcon size={10} />
    </ActionIcon>
  );
};

const SetFacet: React.FC<FacetCardProps<SetFacetHooks>> = ({
  field,
  description,
  facetName = undefined,
  width = undefined,
  hooks,
}) => {
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const dispatch = useCoreDispatch();
  const facetValues = (hooks.useGetFacetValues(field) ||
    []) as EnumOperandValue;
  const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
    field === "genes.gene_id" ? facetValues.map((x) => x.toString()) : [],
  );

  const setValues = (values: EnumOperandValue) => {
    if (values.length > 0) {
      updateFacetFilters(field, {
        operator: "includes",
        field: field,
        operands: values,
      });
    }
    // no values remove the filter
    else {
      clearFilters(field);
    }
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative shadow-lg border-primary-lightest border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          label={description || "No description available"}
          position="bottom-start"
          multiline
          width={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>{facetTitle}</FacetText>
        </Tooltip>
        <div className="flex flex-row">
          <FacetIconButton
            onClick={() => {
              clearFilters(field);
            }}
            aria-label="clear selection"
          >
            <UndoIcon size="1.15em" className={controlsIconStyle} />
          </FacetIconButton>
        </div>
      </FacetHeader>
      <div className="p-2">
        <Button
          onClick={() => dispatch(showModal({ modal: FACET_TO_MODAL[field] }))}
          color="primary"
          variant="outline"
          size="xs"
          data-testid={`button-${facetTitle}`}
        >
          + Add {facetTitle}
        </Button>
        <Group spacing="xs" className="px-2 py-1" data-testid="values group">
          {facetValues.map((operand, i) => (
            <Badge
              size="sm"
              variant="filled"
              color="accent-cool"
              className="normal-case items-center pl-1.5 pr-0 cursor-pointer"
              key={`${field}-${operand}-${i}`}
              data-testid={`set-facet-${field}-${operand}-${i}`}
              rightSection={removeButton(operand)}
              onClick={() => {
                setValues(facetValues.filter((o) => o !== operand));
              }}
            >
              <QueryRepresentationLabel
                field={field}
                value={operand.toString()}
                geneSymbolDict={geneSymbolDict}
                geneSymbolSuccess={isSuccess}
                countHook={
                  field === "genes.gene_id"
                    ? useGeneSetCountQuery
                    : useSsmSetCountQuery
                }
              />
            </Badge>
          ))}
        </Group>
      </div>
    </div>
  );
};

export default SetFacet;
