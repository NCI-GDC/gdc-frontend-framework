import React, { useContext } from "react";
import { ActionIcon, Badge } from "@mantine/core";
import OverflowTooltippedLabel from "@/common/OverflowTooltippedLabel";
import { CloseIcon } from "src/commonIcons";
import { QueryExpressionsExpandedContext } from "./QueryExpressionSection";
import { QueryExpressionHooks } from "./types";

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

interface CohortBadgeProps {
  field: string;
  value: string;
  customTestid: string;
  operands: readonly (string | number)[];
  operator: "includes" | "excludes" | "excludeifany";
  hooks: QueryExpressionHooks;
}
const CohortBadge: React.FC<CohortBadgeProps> = ({
  field,
  value,
  customTestid,
  hooks,
  operands,
  operator,
}: CohortBadgeProps) => {
  const [, setQueryExpressionsExpanded] = useContext(
    QueryExpressionsExpandedContext,
  );
  const currentCohort = hooks.useSelectCurrentCohort();
  const updateActiveCohortFilter = hooks.useUpdateCohortFilter();
  const removeCohortFilter = hooks.useRemoveCohortFilter();

  const handleOnClick = () => {
    const newOperands = operands.filter((o) => o !== value);

    if (newOperands.length === 0) {
      setQueryExpressionsExpanded &&
        setQueryExpressionsExpanded({
          type: "clear",
          cohortId: currentCohort.id,
          field,
        });
      removeCohortFilter(field);
    } else {
      updateActiveCohortFilter({
        field,
        operation: {
          operator,
          field,
          operands: newOperands,
        },
      });
    }

    /*
    if (value.includes("set_id:")) {
      dispatch(removeCohortSet(value.split("set_id:")[1]));
    }
      */
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
        {value}
      </OverflowTooltippedLabel>
    </Badge>
  );
};

export default CohortBadge;
