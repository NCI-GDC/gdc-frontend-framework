import { Loader } from "@mantine/core";
import { CountsData, useCurrentCohortCounts } from "@gff/core";
import { capitalizeFirstLetter } from "@/utils/index";

export interface CountButtonProp {
  readonly countName: keyof CountsData;
  readonly singularLabel: string;
  readonly bold?: boolean;
  readonly capitalize?: boolean;
  readonly customDataTestID?: string;
}

const CohortCountButton: React.FC<CountButtonProp> = ({
  countName,
  singularLabel,
  bold = false,
  capitalize = false,
  customDataTestID,
}: CountButtonProp) => {
  const { data, status } = useCurrentCohortCounts();

  const count = data?.[countName] ?? 0;
  const isLoading = status !== "fulfilled";

  let displayLabel = count === 1 ? singularLabel : `${singularLabel}s`;
  if (capitalize) {
    displayLabel = displayLabel.toUpperCase();
  } else {
    displayLabel = capitalizeFirstLetter(displayLabel);
  }

  const countClassName = bold ? "font-bold pr-1" : "pr-1";
  const labelClassName = bold ? "font-medium" : "";

  return (
    <div
      data-testid={customDataTestID}
      className="flex flex-nowrap items-center font-heading"
    >
      {isLoading ? (
        <>
          <Loader
            data-testid="loading-spinner-cohort-case-count"
            color="gray"
            size="xs"
            className="mr-2"
          />{" "}
          {displayLabel}
        </>
      ) : (
        <>
          <span className={countClassName}>{count.toLocaleString()}</span>{" "}
          <span className={labelClassName}>{displayLabel}</span>
        </>
      )}
    </div>
  );
};

export default CohortCountButton;
