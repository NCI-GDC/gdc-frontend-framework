import React, { useContext } from "react";
import { ActionIcon, Badge } from "@mantine/core";
import OverflowTooltippedLabel from "@/common/OverflowTooltippedLabel";
import { Cohort } from "@/cohort/types";
import { Operation } from "@/cohort/QueryExpression/types";
import { QueryExpressionsExpandedContext } from "@/cohort/QueryExpression/QueryExpressionSection";
import { CloseIcon } from "src/commonIcons";
import FormattedFilterLabel from "./FormattedFilterLabel";

const RemoveButton = ({ label }: { label: string }) => (
  <ActionIcon
    size="xs"
    color="white"
    radius="xl"
    variant="transparent"
    aria-label={`remove ${label}`}
  >
    <CloseIcon size={10} aria-hidden="true" />
  </ActionIcon>
);

interface FilterBadgeProps {
  field: string;
  value: string;
  customTestid: string;
  operands: readonly (string | number)[];
  operator: "includes" | "excludes" | "excludeifany";
  hooks: {
    useSelectCurrentCohort?: () => Cohort;
    useClearFilter: () => (field: string) => void;
    useUpdateFilter: () => (field: string, operation: Operation) => void;
    useFormatValue: () => (value: string, field: string) => Promise<string>;
  };
}
const FilterBadge: React.FC<FilterBadgeProps> = ({
  field,
  value,
  customTestid,
  hooks,
  operands,
  operator,
}: FilterBadgeProps) => {
  const [, setQueryExpressionsExpanded] = useContext(
    QueryExpressionsExpandedContext,
  );
  const { useSelectCurrentCohort = () => undefined } = hooks;
  const currentCohort = useSelectCurrentCohort();
  const updateFilter = hooks.useUpdateFilter();
  const removeFilter = hooks.useClearFilter();

  const handleOnClick = () => {
    const newOperands = operands.filter((o) => o !== value);

    if (newOperands.length === 0) {
      currentCohort &&
        setQueryExpressionsExpanded &&
        setQueryExpressionsExpanded({
          type: "clear",
          cohortId: currentCohort.id,
          field,
        });
      removeFilter(field);
    } else {
      updateFilter(field, {
        operator,
        field,
        operands: newOperands,
      });
    }
  };

  return (
    <Badge
      data-testid={customTestid}
      variant="filled"
      color="accent-cool"
      size="md"
      className="normal-case items-center max-w-[162px] cursor-pointer pl-1.5 pr-0 hover:bg-accent-cool-darker"
      rightSection={<RemoveButton label={value} />}
      onClick={handleOnClick}
    >
      <OverflowTooltippedLabel
        label={value}
        className="flex-grow text-md font-content-noto"
      >
        <FormattedFilterLabel
          field={field}
          value={value}
          useFormatValue={hooks.useFormatValue}
        />
      </OverflowTooltippedLabel>
    </Badge>
  );
};

export default FilterBadge;
