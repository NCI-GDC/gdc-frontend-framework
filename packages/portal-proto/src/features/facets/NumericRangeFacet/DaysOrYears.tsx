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
  minimum,
  maximum,
}: NumericFacetData) => {
  const [units, setUnits] = useState("years");
  // no data if true means the Day/Year SegmentedControl should not be rendered.
  // TODO: this is not ideal and perhaps should be refactored
  const [hasData, setHasData] = useState(true);
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
        minimum={minimum ?? -32873}
        maximum={maximum ?? 32873}
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
