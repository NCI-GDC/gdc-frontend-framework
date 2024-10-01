import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import {
  removeCohortFilter,
  removeCohortSet,
  updateActiveCohortFilter,
  useCaseSetCountQuery,
  useCoreDispatch,
  useGeneSetCountQuery,
  useSsmSetCountQuery,
} from "@gff/core";
import { ActionIcon, Badge } from "@mantine/core";
import { useState } from "react";
import { MdClose as ClearIcon } from "react-icons/md";
import QueryRepresentationLabel from "../facets/QueryRepresentationLabel";

const RemoveButton = ({ label }: { label: string }) => (
  <ActionIcon
    size="xs"
    color="white"
    radius="xl"
    variant="transparent"
    aria-label={`remove ${label}`}
  >
    <ClearIcon size={10} aria-hidden="true" />
  </ActionIcon>
);

interface CohortBadgeProps {
  field: string;
  value: string;
  customTestid: string;
  operands: readonly (string | number)[];
  operator: "includes" | "excludes" | "excludeifany";
  currentCohortId: string;
  geneSymbolDict: Record<string, string>;
  isSuccess: boolean;
}
const CohortBadge = ({
  field,
  value,
  customTestid,
  operands,
  operator,
  currentCohortId,
  geneSymbolDict,
  isSuccess,
}: CohortBadgeProps) => {
  const dispatch = useCoreDispatch();
  const [label, setLabel] = useState("");

  const handleOnClick = () => {
    const newOperands = operands.filter((o) => o !== value);

    if (newOperands.length === 0) {
      dispatch({
        type: "clear",
        cohortId: currentCohortId,
        field,
      });
      dispatch(removeCohortFilter(field));
    } else {
      dispatch(
        updateActiveCohortFilter({
          field,
          operation: {
            operator,
            field,
            operands: newOperands,
          },
        }),
      );
    }

    if (value.includes("set_id:")) {
      dispatch(removeCohortSet(value.split("set_id:")[1]));
    }
  };

  return (
    <Badge
      data-testid={customTestid}
      variant="filled"
      color="accent-cool"
      size="md"
      className="normal-case items-center max-w-[162px] cursor-pointer pl-1.5 pr-0 hover:bg-accent-cool-darker"
      rightSection={<RemoveButton label={label} />}
      onClick={handleOnClick}
    >
      <OverflowTooltippedLabel
        label={value}
        className="flex-grow text-md font-content-noto"
      >
        <QueryRepresentationLabel
          value={value}
          field={field}
          geneSymbolDict={geneSymbolDict}
          geneSymbolSuccess={isSuccess}
          useCountHook={
            field === "genes.gene_id"
              ? useGeneSetCountQuery
              : field === "ssms.ssm_id"
              ? useSsmSetCountQuery
              : useCaseSetCountQuery
          }
          setLabel={setLabel}
        />
      </OverflowTooltippedLabel>
    </Badge>
  );
};

export default CohortBadge;
