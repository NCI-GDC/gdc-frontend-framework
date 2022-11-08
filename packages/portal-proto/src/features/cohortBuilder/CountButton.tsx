import { Loader } from "@mantine/core";
import { useFilteredCohortCounts } from "@gff/core";

export interface CountButtonProp {
  readonly countName: string;
  readonly label: string;
  readonly className?: string;
  readonly bold?: boolean;
}

const CountButton: React.FC<CountButtonProp> = ({
  countName,
  label,
  className = "",
  bold = false,
}: CountButtonProp) => {
  const cohortCounts = useFilteredCohortCounts();
  console.log("COHORTCOUNTS: ", cohortCounts);
  return (
    <div className={className}>
      <div className="flex flex-row flex-nowrap items-center">
        {cohortCounts.isSuccess ? (
          <>
            <span className={`${bold ? "font-bold pr-1" : "pr-1"}`}>
              {cohortCounts.data[countName].toLocaleString()}
            </span>{" "}
            <span className={`${bold ? "font-medium pr-1" : "pr-1"}`}>
              {label}
            </span>
          </>
        ) : (
          <>
            <Loader color="gray" size="xs" className="mr-2" /> {label}{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default CountButton;
