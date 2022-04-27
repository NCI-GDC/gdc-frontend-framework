import React, { useState } from "react";
import { convertFieldToName, FacetProps, useCaseFacet } from "./utility";
import { MdFlip as FlipIcon } from "react-icons/md";

import Select from "react-select";
import { Button, LoadingOverlay } from "@mantine/core";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import { Icon } from "@iconify/react";

const BUCKETS_TO_SHOW = 6;

interface NumericFacetProps extends FacetProps {
  readonly facet_type: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

interface FacetData {
  readonly field: string;
  readonly data: Record<string, any>;
  readonly minimum?: number;
  readonly maximum?: number;
}

const greater_items = [
  { value: "gt", label: "\u2265" },
  { value: "ge", label: ">" },
];

const less_items = [
  { value: "lt", label: "\u2264" },
  { value: "le", label: "<" },
];

interface ItemElement {
  readonly label?: string;
  readonly icon?: any;
  readonly onClick?: () => void;
}
interface FacetItemListHeaderProps {
  readonly items: ItemElement[];
}

const FacetItemListHeader: React.FC<FacetItemListHeaderProps> = ({
  items,
}: FacetItemListHeaderProps) => {
  return (
    <div className="flex flex-row items-center flex-nowrap border-2">
      {items.map((x, index, { length }) => {
        const lastItem =
          length == 1 ? "" : index + 1 == length ? "ml-auto" : "";
        return (
          <>
            <div className={`flex flex-row items-center ${lastItem} `}>
              <button className="hover:bg-grey text-grey-darkest font-medium px-6 rounded-sm inline-flex items-center ">
                {x.icon != undefined ? <Icon icon={x.icon}> </Icon> : null}
                {x.label != undefined ? (
                  <p className="px-2">{x.label} </p>
                ) : null}
              </button>
            </div>
          </>
        );
      })}
    </div>
  );
};

interface FromToProps {
  readonly minimum: number;
  readonly maximum: number;
  readonly units: string;
}

const FromTo: React.FC<FromToProps> = ({
  minimum,
  maximum,
  units = "years",
}: FromToProps) => {
  const unitsLabel = units != "%" ? ` ${units}` : "%";
  return (
    <div className="flex-grow m-1">
      <div className="flex flex-row items-center flex-nowrap">
        <div className="w-1/5 ">From:</div>
        <Select
          className="w-8 mr-1"
          options={greater_items}
          defaultValue={greater_items[0]}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
        <input
          type="number"
          placeholder={`eg. ${minimum}${unitsLabel} `}
          min={minimum}
          max={maximum}
          className="h-8 w-1/2 mr-auto border-nci-gray-light rounded-md focus:shadow focus:outline-none"
        />
        <div className="mx-1 h-8"></div>
      </div>
      <div className="flex flex-row mt-1 items-center flex-nowrap">
        <div className="float-right w-1/5">To:</div>
        <Select
          className="w-8 mr-1"
          options={less_items}
          defaultValue={less_items[0]}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
        <input
          type="number"
          placeholder={`eg. ${maximum}${unitsLabel} `}
          min={minimum}
          max={maximum}
          className="h-8 w-1/2  border-nci-gray-light rounded-md  focus:shadow focus:outline-none"
        />
        <Button className="mx-1 h-8 mr-auto">Ok</Button>
      </div>
    </div>
  );
};

interface FacetExpanderProps {
  readonly remainingValues: number;
  readonly isGroupExpanded: boolean;
  readonly onShowChanged: (v: boolean) => void;
}

const FacetExpander: React.FC<FacetExpanderProps> = ({
  remainingValues,
  isGroupExpanded,
  onShowChanged,
}: FacetExpanderProps) => {
  return (
    <div className={"mt-3"}>
      {!isGroupExpanded ? (
        <div className="bg-white border-2  p-1.5">
          <Button
            key="show-more"
            className="text-left p-2 w-auto hover:text-black"
            onClick={() => onShowChanged(!isGroupExpanded)}
          >
            {remainingValues} more
          </Button>
        </div>
      ) : (
        <div className="bg-white border-2  p-1.5">
          <Button
            key="show-less"
            className="text-left border-2 p-1.5 w-auto hover:text-black"
            onClick={() => onShowChanged(!isGroupExpanded)}
          >
            Show less
          </Button>
        </div>
      )}
    </div>
  );
};

const DaysOrYears: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const [units, setUnits] = useState("years");
  const handleSearch = () => null;

  let adjMinimum = minimum != undefined ? minimum : 0;
  let adjMaximum = maximum != undefined ? maximum : 32872;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 3652.5);
  adjMinimum =
    Math.round(10 * (adjMinimum / (units == "years" ? 365.25 : 1))) / 10;
  adjMaximum =
    Math.round(10 * (adjMaximum / (units == "years" ? 365.25 : 1))) / 10;

  const bucketsToShow = isGroupExpanded ? numBuckets : BUCKETS_TO_SHOW;
  const remainingValues = numBuckets - bucketsToShow;

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  const handleRadioSelection = (e) => {
    console.log(e);
  };

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <RadioButtonGroup
        items={["days", "years"]}
        checkedItem={"years"}
        onSelected={setUnits}
      />
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className="form-check-input  mr-4"
          id={`${field}_custom`}
          name={`${field}_age_range_selection`}
          onChange={handleRadioSelection}
        />
        <FromTo minimum={adjMinimum} maximum={adjMaximum} units={units} />
      </div>
      <div className="flex flex-col">
        <FacetItemListHeader
          items={[{ icon: "mdi:sort", onClick: handleSearch }, {}]}
        />
        <div role="group">
          {[...Array(bucketsToShow)].map((_, i) => {
            const low =
              (minimum + i * 3652.5) / (units == "years" ? 365.25 : 1);
            const high =
              (minimum + (i + 1) * 3652.5) / (units == "years" ? 365.25 : 1);
            return (
              <div
                key={`${field}_${i}`}
                className="flex flex-row justify-start items-center form-check"
              >
                <input
                  type="radio"
                  id={`${field}_${i}`}
                  name={`${field}_age_range_selection`}
                  className="form-radio mr-4"
                />
                <span>
                  From {"\u2265"} {low} to {"<"} {high} {units}{" "}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <FacetExpander
        remainingValues={remainingValues}
        isGroupExpanded={isGroupExpanded}
        onShowChanged={onShowModeChanged}
      />
    </div>
  );
};

const Year: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);
  const adjMinimum = minimum != undefined ? minimum : 1900;
  const adjMaximum = maximum != undefined ? maximum : 2050;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);
  const bucketsToShow = isGroupExpanded ? numBuckets : 3;
  const remainingValues = numBuckets - bucketsToShow;
  const handleSearch = () => null;

  const onShowModeChanged = () => {
    setIsGroupExpanded(!isGroupExpanded);
  };

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className="form-check-input  mr-4"
          id={`${field}_custom`}
          name={`${field}_year_range_selection`}
        />
        <FromTo minimum={adjMinimum} maximum={adjMaximum} units="" />
      </div>
      <div className="flex flex-col">
        <FacetItemListHeader
          items={[{ icon: "mdi:sort", onClick: handleSearch }]}
        />
        <div role="group">
          {[...Array(bucketsToShow)].map((_, i) => {
            const low = minimum + i * 10;
            const high = minimum + (i + 1) * 10;
            return (
              <div
                key={`${field}_${i}`}
                className="flex flex-row justify-start items-center form-check"
              >
                <input
                  type="radio"
                  id={`${field}_${i}`}
                  name={`${field}_year_range_selection`}
                  className="form-radio mr-4"
                />
                <span>
                  From {"\u2265"} {low} to {"<"} {high}{" "}
                </span>
              </div>
            );
          })}
        </div>
        <FacetExpander
          remainingValues={remainingValues}
          isGroupExpanded={isGroupExpanded}
          onShowChanged={onShowModeChanged}
        />
      </div>
    </div>
  );
};

const Years: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 89;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  const handleSearch = () => null;
  return (
    <div>
      <FacetItemListHeader
        items={[{ icon: "mdi:sort", onClick: handleSearch }]}
      />
    </div>
  );
};

const NumericRange: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 999999;
  return (
    <div>
      <FromTo minimum={adjMinimum} maximum={adjMaximum} units="" />
    </div>
  );
};

const PercentRange: React.FC<FacetData> = ({
  field,
  data,
  minimum = undefined,
  maximum = undefined,
}: FacetData) => {
  const [isGroupExpanded, setIsGroupExpanded] = useState(false);

  const adjMinimum = minimum != undefined ? minimum : 0;
  const adjMaximum = maximum != undefined ? maximum : 100;
  const numBuckets = Math.round((adjMaximum - adjMinimum) / 10);

  const bucketsToShow = isGroupExpanded ? numBuckets : BUCKETS_TO_SHOW;
  const remainingValues = numBuckets - bucketsToShow;
  const handleSearch = () => null;

  return (
    <div className="flex flex-col w-100 space-y-2 px-2  mt-1 ">
      <div className="flex flex-row justify-between items-center">
        <input
          type="radio"
          className="form-check-input  mr-4"
          id={`${field}_custom`}
          name={`${field}_percent_range_selection`}
        />
        <FromTo minimum={adjMinimum} maximum={adjMaximum} units="%" />
      </div>
      <div className="flex flex-col">
        <FacetItemListHeader
          items={[{ icon: "mdi:sort", onClick: handleSearch }]}
        />
        <div role="group">
          {[...Array(bucketsToShow)].map((_, i) => {
            const low = minimum + i * 10;
            const high = minimum + (i + 1) * 10;
            return (
              <div
                key={`${field}_${i}`}
                className="flex flex-row justify-start items-center form-check"
              >
                <input
                  type="radio"
                  id={`${field}_${i}`}
                  name={`${field}_percent_range_selection`}
                  className="form-radio mr-4"
                />
                <span>
                  From {"\u2265"} {`${low}%`} to {"<"} {`${high}%`}{" "}
                </span>
              </div>
            );
          })}
        </div>
        <div className={"mt-3"}>
          {!isGroupExpanded ? (
            <div className="bg-white border-2  p-1.5">
              <Button
                key="show-more"
                className="text-left p-2 w-auto hover:text-black"
                onClick={() => setIsGroupExpanded(!isGroupExpanded)}
              >
                {remainingValues} more
              </Button>
            </div>
          ) : (
            <div className="bg-white border-2  p-1.5">
              <Button
                key="show-less"
                className="text-left border-2 p-1.5 w-auto hover:text-black"
                onClick={() => setIsGroupExpanded(!isGroupExpanded)}
              >
                Show less
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NumericRangeFacet: React.FC<NumericFacetProps> = ({
  field,
  description,
  facet_type,
  minimum = undefined,
  maximum = undefined,
  facetName = null,
}: NumericFacetProps) => {
  const { data, error, isUninitialized, isFetching, isError } =
    useCaseFacet(field);

  const [isSearching, setIsSearching] = useState(false);
  const [isFacetView, setIsFacetView] = useState(true);

  if (isUninitialized) {
    return <div>Initializing facet...</div>;
  }

  if (isFetching) {
    return <div>Fetching facet...</div>;
  }

  if (isError) {
    return <div>Failed to fetch facet: {error}</div>;
  }

  const toggleSearch = () => {
    setIsSearching(!isSearching);
  };

  const toggleFlip = () => {
    setIsFacetView(!isFacetView);
  };

  return (
    <div>
      <div className="flex flex-col  border-2 bg-white p-1 relative drop-shadow-md border-nci-blumine-lighter">
        <div className="flex items-center justify-between flex-wrap bg-nci-gray-lighter px-1.5">
          <div className="has-tooltip">
            {facetName === null ? convertFieldToName(field) : facetName}
            <div className="inline-block tooltip w-full border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">
              {description}
            </div>
          </div>
          <div className="flex flex-row">
            <button
              className="bg-nci-gray-lighter hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={toggleFlip}
            >
              <FlipIcon />
            </button>
          </div>
        </div>
        {
          {
            age: (
              <DaysOrYears
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            year: (
              <Year
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            years: (
              <Years
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            days: (
              <DaysOrYears
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            numeric: (
              <NumericRange
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            percent: (
              <PercentRange
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
            integer: (
              <NumericRange
                field={field}
                data={data}
                minimum={minimum}
                maximum={maximum}
              />
            ),
          }[facet_type]
        }
      </div>
    </div>
  );
};

export default NumericRangeFacet;
