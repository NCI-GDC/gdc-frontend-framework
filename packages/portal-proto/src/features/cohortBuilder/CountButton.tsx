import { useEffect } from "react";
import {  Loader} from "@mantine/core";
import {
  useFilteredCohortCounts,
} from "@gff/core";

export interface CountButtonProp {
  readonly countName: string;
  readonly label: string;
  readonly className?: string;
}

const CountButton : React.FC<CountButtonProp> = ({countName, label, className = ""} : CountButtonProp) => {
  const cohortCounts = useFilteredCohortCounts();
  return (
    <div className={className}><div className="flex flex-row flex-nowrap items-center" >{(cohortCounts.isSuccess) ?`${cohortCounts.data[countName].toLocaleString()} ${label}` :  <><Loader color="gray" size="xs" className="mr-2"/> {label} </> }</div></div>
  )
}

export default CountButton;
