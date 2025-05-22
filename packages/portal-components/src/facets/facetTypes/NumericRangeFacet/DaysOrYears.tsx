import React, { useState } from "react";
import SegmentedControl from "@/common/SegmentedControl";
import RangeInputWithPrefixedRanges from "./RangeInputWithPrefixedRanges";
import { NumericFacetProps, NumericUnits } from "./types";

const DaysOrYears: React.FC<NumericFacetProps> = ({
  field,
  rangeDatatype,
  hooks,
  valueLabel,
  clearValues,
  isFacetView,
  minimum,
  maximum,
  queryOptions,
  Chart,
}) => {
  const [units, setUnits] = useState("years");
  // no data if true means the Day/Year SegmentedControl should not be rendered.
  // TODO: this is not ideal and perhaps should be refactored
  const [hasData, setHasData] = useState(true);
  const numBuckets = 18;

  return (
    <div className="flex flex-col w-100 space-y-2 px-2 mt-1 ">
      {hasData && (
        <div className="flex flex-col items-stretch w-100 mt-1">
          <SegmentedControl
            data={[
              { label: "Days", value: "days" },
              { label: "Years", value: "years" },
            ]}
            value={units}
            color="primary"
            onChange={setUnits}
            padding={2}
          />
        </div>
      )}

      <RangeInputWithPrefixedRanges
        units={units as NumericUnits}
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
        queryOptions={queryOptions}
        Chart={Chart}
      />
    </div>
  );
};

export default DaysOrYears;
