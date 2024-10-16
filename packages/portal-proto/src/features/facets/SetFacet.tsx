import React from "react";
import { Badge, Group, Tooltip, Button, ActionIcon } from "@mantine/core";
import { MdClose as CloseIcon } from "react-icons/md";
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

import { FacetCardProps, SetFacetHooks } from "./types";
import QueryRepresentationLabel from "./QueryRepresentationLabel";
import FacetControlsHeader from "./FacetControlsHeader";

const FACET_TO_MODAL = {
  "genes.gene_id": Modals.LocalGeneSetModal,
  "cases.case_id": Modals.LocalCaseSetModal,
  "ssms.ssm_id": Modals.LocalMutationSetModal,
};

const removeButton = (x: string | number) => {
  return (
    <ActionIcon size="xs" color="white" radius="xl" variant="transparent">
      <CloseIcon size={10} aria-label={`remove ${x} from filter`} />
    </ActionIcon>
  );
};

const SetFacet: React.FC<FacetCardProps<SetFacetHooks>> = ({
  field,
  description,
  facetName = undefined,
  facetTitle = undefined,
  facetBtnToolTip = undefined,
  width = undefined,
  hooks,
}) => {
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  if (!facetName) {
    facetName = trimFirstFieldNameToTitle(field, true);
  }
  const isFilterExpanded =
    hooks?.useFilterExpanded && hooks.useFilterExpanded(field);
  const showFilters = isFilterExpanded === undefined || isFilterExpanded;

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
      } bg-base-max relative border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetControlsHeader
        field={field}
        description={description}
        hooks={hooks}
        facetName={facetTitle}
      />
      <div
        className={showFilters ? "h-full" : "h-0 invisible"}
        aria-hidden={!showFilters}
      >
        <div className="p-2">
          <Tooltip
            label={facetBtnToolTip}
            disabled={!facetBtnToolTip}
            position="bottom-start"
            multiline
            w={220}
            withArrow
            transitionProps={{ duration: 200, transition: "fade" }}
          >
            <Button
              onClick={() =>
                dispatch(showModal({ modal: FACET_TO_MODAL[field] }))
              }
              color="primary"
              variant="outline"
              size="sm"
              data-testid={`button-${facetName}`}
              classNames={{
                label: "break-words whitespace-pre-wrap",
                root: "w-full",
              }}
            >
              Upload {facetName}
            </Button>
          </Tooltip>
          <Group
            gap="xs"
            className="px-2 py-1 max-h-96 overflow-y-auto"
            data-testid="values group"
          >
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
                  useCountHook={
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
    </div>
  );
};

export default SetFacet;
