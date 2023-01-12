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
  useCoreSelector,
  selectSets,
  useGeneSymbol,
  SetTypes,
} from "@gff/core";
import {
  controlsIconStyle,
  FacetIconButton,
  FacetText,
  FacetHeader,
} from "@/features/facets/components";
import { FacetCardProps, SetFacetHooks } from "./types";

const FACET_TO_MODAL = {
  "genes.gene_id": Modals.LocalGeneSetModal,
  "cases.case_id": Modals.LocalCaseSetModal,
  "ssms.ssm_id": Modals.LocalMutationSetModal,
};

const SetFacet: React.FC<FacetCardProps<SetFacetHooks>> = ({
  field,
  description,
  facetName = undefined,
  width = undefined,
  hooks,
}) => {
  const clearFilters = hooks.useClearFilter();
  const clearGroups = hooks.useClearGroups();
  const updateFacetFilters = hooks.useUpdateFacetFilters();
  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  const dispatch = useCoreDispatch();
  const facetValues = (hooks.useGetFacetValues(field) ||
    []) as EnumOperandValue;
  const [setType] = field.split(".");
  const sets = useCoreSelector((state) =>
    selectSets(state, setType as SetTypes),
  );
  const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
    field === "genes.gene_id" ? facetValues.map((x) => x.toString()) : [],
  );

  const groups = hooks.useFilterGroups(field);

  const tempOperands = [...facetValues];
  const displayOperands = [];

  if (groups) {
    // Replace operands from groups
    groups.forEach((group) => {
      displayOperands.push({
        label: `${group.ids.length} input ${setType.toLowerCase()}`,
        group,
      });

      group.ids.forEach((id) => {
        const index = tempOperands.findIndex((o) => o === id);
        if (index >= 0) {
          tempOperands.splice(index, 1);
        }
      });
    });
  }

  tempOperands.forEach((operand) => {
    if (typeof operand === "string" && operand.includes("set_id:")) {
      const setId = operand.split("set_id:")[1];

      const setName = sets?.[setId];
      displayOperands.push({ label: setName, value: operand });
    } else {
      if (field === "genes.gene_id") {
        displayOperands.push({
          label: isSuccess
            ? geneSymbolDict[operand.toString()] ?? "..."
            : "...",
          value: operand,
        });
      } else {
        displayOperands.push({ label: operand, value: operand });
      }
    }
  });

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
        arial-label={`remove ${x} from filter`}
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
            onClick={() => {
              clearFilters(field);
              clearGroups(field);
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
          color="accent"
        >
          + Add {facetTitle}
        </Button>
        <Group spacing="xs" className="px-2 py-1" data-testid="values group">
          {displayOperands.map((x, i) => {
            const value = x?.group ? x.label : x.value.toString();

            return (
              <Badge
                size="sm"
                variant="filled"
                color="accent"
                key={`${field}-${value}-${i}`}
                rightSection={removeButton(value)}
                className="cursor-pointer"
                onClick={() => {
                  let newOperands: (string | number)[];
                  if (x.group) {
                    const tempOperands = [...facetValues];
                    x.group.ids.forEach((id) => {
                      const index = tempOperands.findIndex((o) => o === id);
                      if (index >= 0) {
                        tempOperands.splice(index, 1);
                      }
                    });
                    newOperands = tempOperands;
                  } else {
                    newOperands = facetValues.filter((o) => o !== x.value);
                  }
                  setValues(newOperands);
                  if (x.group) {
                    hooks.removeFilterGroup(x.group);
                  }
                }}
              >
                {x.label}
              </Badge>
            );
          })}
        </Group>
      </div>
    </div>
  );
};

export default SetFacet;
