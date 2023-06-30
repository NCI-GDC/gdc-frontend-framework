import { Loader } from "@mantine/core";
import { useFilteredCohortCounts, CountsData } from "@gff/core";

export interface CountButtonProp {
  readonly countName: keyof CountsData;
  readonly label: string;
  readonly className?: string;
  readonly bold?: boolean;
}

const CohortCountButton: React.FC<CountButtonProp> = ({
  countName,
  label,
  className = "",
  bold = false,
}: CountButtonProp) => {
  const cohortCounts = useFilteredCohortCounts();
  const adjustedLabel =
    cohortCounts.data[countName] !== 1 ? label : label.slice(0, -1);
  return (
    <div className={className}>
      <div className="flex flex-row flex-nowrap items-center font-heading">
        {cohortCounts.isSuccess ? (
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
            <Loader color="gray" size="xs" className="mr-2" /> {adjustedLabel}{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default CohortCountButton;
