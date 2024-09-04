import { Loader } from "@mantine/core";
import { CountsData, useCurrentCohortCounts } from "@gff/core";

export interface CountButtonProp {
  readonly countName: keyof CountsData;
  readonly label: string;
  readonly className?: string;
  readonly bold?: boolean;
  readonly customDataTestID?: string;
}

const CohortCountButton: React.FC<CountButtonProp> = ({
  countName,
  label,
  className = "",
  bold = false,
  customDataTestID,
}: CountButtonProp) => {
  const cohortCounts = useCurrentCohortCounts();
  const adjustedLabel =
    cohortCounts.data !== undefined && cohortCounts.data[countName] !== 1
      ? label
      : label.slice(0, -1);
  return (
    <div className={className}>
      <div
        data-testid={customDataTestID}
        className="flex flex-row flex-nowrap items-center font-heading"
      >
        {cohortCounts.status === "fulfilled" ? (
          <>
            <span className={`pr-1 ${bold && "font-bold"}`}>
              {cohortCounts.data[countName]?.toLocaleString()}
            </span>{" "}
            <span className={`${bold ? "font-medium pr-1" : "pr-1"}`}>
              {adjustedLabel}
            </span>
          </>
        ) : (
          <>
            <Loader
              data-testid="loading-spinner-cohort-case-count"
              color="gray"
              size="xs"
              className="mr-2"
            />{" "}
            {adjustedLabel}{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default CohortCountButton;
