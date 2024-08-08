import { SegmentedControl } from "@mantine/core";
import { useState } from "react";
import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetData } from "./types";

const DaysOrYears: React.FC<NumericFacetData> = ({
  field,
  rangeDatatype,
  hooks,
  valueLabel,
  clearValues,
  isFacetView,
}: NumericFacetData) => {
  const [units, setUnits] = useState("years");
  // no data if true means the Day/Year SegmentedControl should not be rendered.
  // TODO: this is not ideal and perhaps should be refactored
  const [hasData, setHasData] = useState(true);
  // set up a fixed range -90 to 90 years over 19 buckets
  const rangeMinimum = -32873;
  const rangeMaximum = 32873;
  const numBuckets = 18;

  return (
    <div className="flex flex-col w-100 space-y-2 px-2 mt-1 ">
      {hasData && (
        <SegmentedControl
          data={[
            { label: "Days", value: "days" },
            { label: "Years", value: "years" },
          ]}
          value={units}
          color="primary"
          onChange={setUnits}
        />
      )}

      <RangeInputWithPrefixedRanges
        units={units}
        rangeDatatype={rangeDatatype}
        hooks={{ ...hooks }}
        minimum={rangeMinimum}
        maximum={rangeMaximum}
        numBuckets={numBuckets}
        field={field}
        valueLabel={valueLabel}
        clearValues={clearValues}
        isFacetView={isFacetView}
        setHasData={(value) => setHasData(value)}
      />
    </div>
  );
};

export default DaysOrYears;
