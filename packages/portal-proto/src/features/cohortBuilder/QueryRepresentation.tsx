import { PropsWithChildren, useState } from "react";
import {
  Equals,
  ExcludeIfAny,
  Excludes,
  Exists,
  GreaterThan,
  GreaterThanOrEquals,
  handleOperation,
  Includes,
  Intersection,
  LessThan,
  LessThanOrEquals,
  Missing,
  NotEquals,
  Operation,
  OperationHandler,
  removeCohortFilter,
  Union,
  useCoreDispatch,
} from "@gff/core";

type RangeOperation =
  | LessThan
  | LessThanOrEquals
  | GreaterThanOrEquals
  | GreaterThan;

import { convertFieldToName } from "@/features/facets/utils";
import {
  MdArrowDropDown as DropDownIcon,
  MdClose as ClearIcon,
} from "react-icons/md";

const filter_set_label_v1 = {
  any_of: "any of:",
  all_of: "all:",
  none_of: "none:",
};

const filter_set_label_v2 = {
  any_of: "includes at least one:",
  all_of: "includes all:",
  none_of: "excludes:",
};

interface EnumFilterProps {
  readonly op: string;
  readonly field: string;
  readonly values: ReadonlyArray<string>;
}

const CohortValueFilterElement: React.FC<EnumFilterProps> = ({
  field,
  op,
  values,
  children,
}: PropsWithChildren<EnumFilterProps>) => {
  const [groupType, setGroupType] = useState(op);
  const [showPopup, setShowPopup] = useState(false);
  const handleChange = (event) => {
    setGroupType(event.target.value);
  };

  const menu_items = [
    { value: "any_of", label: "any of" },
    { value: "all_of", label: "all of" },
    { value: "none_of", label: "none of" },
  ];

  const coreDispatch = useCoreDispatch();

  const handleRemoveFilter = () => {
    coreDispatch(removeCohortFilter(field));
  };

  const handlePopupFacet = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="m-1 px-2 font-heading shadow-md font-medium text-sm rounded-xl bg-nci-gray-lighter text-nci-gray-darkest border-nci-gray-light border-1">
      <div className="flex flex-row items-center">
        {convertFieldToName(field)} is {children}
        <DropDownIcon size="1.5em" onClick={handlePopupFacet} />
        <button>
          <ClearIcon
            onClick={handleRemoveFilter}
            size="1.5em"
            className="pl-1 border-l-2 border-nci-gray-light "
          />
        </button>
      </div>
    </div>
  );
};

interface EnumValueElementProps {
  readonly values: ReadonlyArray<string>;
}

const EnumValueElement: React.FC<EnumValueElementProps> = ({
  values,
}: EnumValueElementProps) => {
  return (
    <>
      <span className="px-1 underline">{filter_set_label_v1["any_of"]}</span>
      <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">
        {values.join(",")}
      </div>
    </>
  );
};

const CohortEnumFilterElement: React.FC<EnumFilterProps> = (
  props: EnumFilterProps,
) => {
  return (
    <CohortValueFilterElement {...props}>
      <EnumValueElement values={props.values} />
    </CohortValueFilterElement>
  );
};

const CohortRangeFilterElement: React.FC<EnumFilterProps> = (
  props: EnumFilterProps,
) => {
  return (
    <CohortValueFilterElement {...props}>
      <EnumValueElement values={props.values} />
    </CohortValueFilterElement>
  );
};

/**
 *  Processes a Filter into a component representation
 */
class CohortFilterToComponent implements OperationHandler<JSX.Element> {
  handleIncludes = (f: Includes) => (
    <CohortEnumFilterElement
      key={f.field}
      field={f.field}
      op={f.operator}
      values={f.operands.map(String)}
    />
  );
  handleEquals = (f: Equals) => (
    <CohortEnumFilterElement
      key={f.field}
      field={f.field}
      op={f.operator}
      values={[String(f.operand)]}
    />
  );
  handleNotEquals = (f: NotEquals) => null;
  handleLessThan = (f: LessThan) => null;
  handleLessThanOrEquals = (f: LessThanOrEquals) => null;
  handleGreaterThan = (f: GreaterThan) => null;
  handleGreaterThanOrEquals = (f: GreaterThanOrEquals) => null;
  handleExists = (f: Exists) => null;
  handleExcludeIfAny = (f: ExcludeIfAny) => null;
  handleMissing = (f: Missing) => null;
  handleExcludes = (f: Excludes) => null;
  handleIntersection = (f: Intersection) => {
    return <div>Intersection</div>;
  };
  handleUnion = (_: Union) => {
    return <div>Union</div>;
  };
}

export const convertFilterToComponent = (filter: Operation): JSX.Element => {
  console.log("converting ", filter);
  const handler: OperationHandler<JSX.Element> = new CohortFilterToComponent();
  return handleOperation(handler, filter);
};
