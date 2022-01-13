import { useState } from "react";
import { convertFieldToName, FacetProps, useCaseFacet } from "./utility";
import { MdFlip as FlipIcon } from "react-icons/md";
import Select from "react-select";
import { Button } from "../layout/UserFlowVariedPages";

interface NumericFacetProps extends FacetProps {
  readonly facet_type: string;
  readonly minimum?: number;
  readonly maximum?: number;
}

interface FacetData {
  readonly field: string;
  readonly data: Record<string, any>;
  readonly minimum?: number
  readonly maximum?: number;
}

const greater_items = [
  { value :"gt", label:"\u2265" },
  { value :"ge", label:">" }
];

const less_items = [
  { value :"lt", label:"\u2264" },
  { value :"le", label:"<" }
];

const Age: React.FC<FacetData> = ({ field, data, minimum=undefined, maximum=undefined }: FacetData) => {

  const [ units, setUnits ] = useState("years")
  return (
    <div className="flex flex-col items-center mt-4 space-y-4 flex-shrink">
      <div className="flex items-center justify-center mb-3">
<form>
        <div className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"  role="group">

        <div >
          <input type="radio" name="unit_type" id={`${field}-years`}
                 className="peer hidden" value="years" onChange={(e) => console.log("years")}/>
          <label htmlFor={`${field}-years`}
                  className="rounded-l inline-block px-6 py-2.5 peer-checked:bg-nci-cyan-dark bg-nci-cyan-lighter text-white font-medium text-xs leading-tight uppercase hover:bg-nci-cyan focus:bg-nci-cyan focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Days
          </label>
        </div>
          <div >
          <input type="radio" name="unit_type" id={`${field}-days`}
                 className="peer hidden" value="days" onChange={(e) => console.log("days")}/>
          <label htmlFor={`${field}-days`}
                  className="rounded-r inline-block px-6 py-2.5 bg-nci-cyan-lighter peer-checked:bg-nci-cyan-dark text-white font-medium text-xs leading-tight uppercase hover:bg-nci-cyan focus:bg-nci-cyan focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Years
          </label>
          </div>

        </div>
</form>
      </div>
      <div className="flex flex-row items-center">
        <input type="radio" className="form-radio"  />
        <div className="ml-4"   >
          <div className="flex flex-row bg-gray-100 items-center flex-nowrap">
            <div className="w-1/5 ">From:</div>
            <Select className="w-8 mr-1"
              options={greater_items}
              defaultValue={greater_items[0]}
              components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
              />
            <input type="number" placeholder={`eg. ${minimum === undefined ? '1900' : minimum} `}
                                     min={minimum} max={maximum}
                                     className="h-8 w-1/2 mr-auto border-nci-gray-light rounded-md  focus:shadow focus:outline-none" />
            <div className="mx-1 h-8"></div>
          </div>
          <div className="flex flex-row mt-1 bg-gray-100 items-center flex-nowrap">
            <div className="float-right w-1/5">To:</div>
            <Select className="w-8 mr-1"
              options={less_items}
              defaultValue={less_items[0]}
              components={{ DropdownIndicator:() => null, IndicatorSeparator:() => null }}
            />
            <input type="number" placeholder={`eg. ${maximum === undefined ? '2050' : maximum} `}
                                   min={minimum} max={maximum}
                                   className="h-8 w-1/2  border-nci-gray-light rounded-md  focus:shadow focus:outline-none" />
            <Button className="mx-1 h-8 mr-auto">Ok</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Year: React.FC<FacetData> = ({ data }: FacetData) => {

  return (
    <div>
      Year
    </div>
  );
};


const NumericRange: React.FC<FacetData> = ({ data }: FacetData) => {

  return (
    <div>
      NumericRange
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
          <div className="has-tooltip">{(facetName === null) ? convertFieldToName(field) : facetName}
            <div
              className="inline-block tooltip w-full border-b-2 border-nci-cyan-lightest rounded shadow-lg p-2 bg-gray-100 text-nci-blue-darkest mt-8 absolute">{description}</div>
          </div>
          <div className="flex flex-row">
            <button
              className="bg-nci-gray-lighter hover:bg-grey text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={toggleFlip}>
              <FlipIcon />
            </button>
          </div>
        </div>
        {{
          "age": <Age field={field} data={data} minimum={minimum} maximum={maximum}/>,
          "year": <Year field={field} data={data}  minimum={minimum} maximum={maximum} />,
          "days": <Year field={field} data={data}  minimum={minimum} maximum={maximum} />,
          "numeric": <NumericRange field={field} data={data}  minimum={minimum} maximum={maximum} />,
          "integer": <NumericRange field={field} data={data}  minimum={minimum} maximum={maximum} />,
        }[facet_type]
        }
      </div>

    </div>
  );
};

export default NumericRangeFacet;
