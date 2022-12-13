import React from "react";
import { partition } from "lodash";
import { Badge, Group, Tooltip, Button, ActionIcon } from "@mantine/core";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";
import {
  trimFirstFieldNameToTitle,
  useCoreDispatch,
  showModal,
  EnumOperandValue,
  Modals,
  useCoreSelector,
  selectSets,
} from "@gff/core";
import {
  controlsIconStyle,
  FacetIconButton,
  FacetText,
  FacetHeader,
} from "@/features/facets/components";
import { FacetCardProps, FacetRequiredHooks } from "./types";

const FACET_TO_MODAL = {
  "genes.gene_id": Modals.GeneSetModal,
  "cases.case_id": Modals.CaseSetModal,
  "ssms.ssm_id": Modals.MutationSetModal,
};

const FACET_TO_SET_TYPE = {
  "genes.gene_id": "gene",
  "cases.case_id": "case",
  "ssms.ssm_id": "ssm",
};

const SetFacet: React.FC<
  FacetCardProps<FacetRequiredHooks> & { modal: Modals }
> = ({
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  hooks,
}) => {
  const clearFilters = hooks.useClearFilter();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const dispatch = useCoreDispatch();
  const facetValues = (hooks.useGetFacetFilters(field) || []) as string[];
  const sets = useCoreSelector((state) =>
    selectSets(state, FACET_TO_SET_TYPE[field]),
  );
  const displayValues = facetValues.every((v) => v.includes("set_id"))
    ? facetValues.map((v) => sets[v.split("set_id:")[1]])
    : facetValues.length === 1
    ? [facetValues[0]]
    : [
        `${facetValues.length.toLocaleString()} input ${
          FACET_TO_SET_TYPE[field]
        }s`,
      ];

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

  const removeButton = (x: string | number) => {
    return (
      <ActionIcon
        size="xs"
        color="white"
        radius="xl"
        variant="transparent"
        arial-label="remove value from filter"
        onClick={() => setValues(facetValues.filter((i) => i !== x))}
      >
        <CloseIcon size={10} />
      </ActionIcon>
    );
  };

  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-1"
      } bg-base-max relative shadow-lg border-primary-lightest border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          label={description || "No description available"}
          classNames={{
            arrow: "bg-base-light",
            tooltip: "bg-base-max text-base-contrast-max",
          }}
          position="bottom-start"
          multiline
          width={220}
          withArrow
          transition="fade"
          transitionDuration={200}
        >
          <FacetText>{facetTitle}</FacetText>
        </Tooltip>
        <div className="flex flex-row">
          <FacetIconButton
            onClick={() => clearFilters(field)}
            aria-label="clear selection"
          >
            <UndoIcon size="1.15em" className={controlsIconStyle} />
          </FacetIconButton>
          {dismissCallback ? (
            <FacetIconButton
              onClick={() => {
                clearFilters(field);
                dismissCallback(field);
              }}
              aria-label="Remove the facet"
            >
              <CloseIcon size="1.25em" className={controlsIconStyle} />
            </FacetIconButton>
          ) : null}
        </div>
      </FacetHeader>
      <div className="p-2">
        <Button
          onClick={() => dispatch(showModal({ modal: FACET_TO_MODAL[field] }))}
        >
          + Add {facetTitle}
        </Button>
        <Group spacing="xs" className="px-2 py-1" data-testid="values group">
          {displayValues.map((x) => (
            <Badge
              size="sm"
              variant="filled"
              color="accent"
              key={x}
              rightSection={removeButton(x)}
            >
              {x}
            </Badge>
          ))}
        </Group>
      </div>
    </div>
  );
};

export default SetFacet;
