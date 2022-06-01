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
import { convertFieldToName } from "@/features/facets/utils";
import {
  MdArrowDropDown as DropDownIcon,
  MdClose as ClearIcon,
} from "react-icons/md";

type RangeOperation =
  | LessThan
  | LessThanOrEquals
  | GreaterThanOrEquals
  | GreaterThan;

type ValueOperation = Exclude<Operation, Intersection | Union>;

export const isRangeOperation = (x?: Operation): x is RangeOperation => {
  return (
    x !== undefined &&
    "operator" in x &&
    [">=", ">", "<", "<="].includes(x.operator)
  );
};

export const isValueOperation = (x: Operation): x is ValueOperation => {
  return "field" in x;
};

const IncludeExcludeQueryElement: React.FC<Includes | Excludes> = ({
  field,
  operator,
  operands,
}: Includes | Excludes) => {
  const [groupType] = useState(operator);

  const filter_set_label_v1 = {
    includes: "any of:",
    excludes: "none:",
  };

  return (
    <div className="flex flex-row items-center">
      {convertFieldToName(field)} is
      <span className="px-1 underline">{filter_set_label_v1[groupType]}</span>
      <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">
        {operands.join(",")}
      </div>
    </div>
  );
};

interface ComparisonElementProps {
  readonly operator: string;
  readonly field: string;
  readonly operand: string | number;
  readonly showLabel?: boolean;
}

const ComparisonElement: React.FC<ComparisonElementProps> = ({
  field,
  operator,
  operand,
  showLabel = true,
}: ComparisonElementProps) => {
  return (
    <div className="flex flex-row items-center">
      {showLabel ? convertFieldToName(field) : null}
      <span className="px-1">{operator}</span>
      <div className="flex truncate ... max-w-sm  border-nci-gray-light ">
        {operand}
      </div>
    </div>
  );
};

const ExistsElement: React.FC<Exists | Missing> = ({
  field,
  operator,
}: Exists | Missing) => {
  return (
    <div className="flex flex-row items-center">
      {convertFieldToName(field)} is
      <span className="px-1 underline">{operator}</span>
    </div>
  );
};

interface QueryElementProps {
  field: string;
}

export const QueryElement: React.FC<QueryElementProps> = ({
  field,
  children,
}: PropsWithChildren<QueryElementProps>) => {
  const [showPopup, setShowPopup] = useState(false);
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
        {children}
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

/**
 *  Processes a Filter into a component representation
 */
class CohortFilterToComponent implements OperationHandler<JSX.Element> {
  handleIncludes = (f: Includes) => (
    <QueryElement key={f.field} {...f}>
      <IncludeExcludeQueryElement {...f} />
    </QueryElement>
  );
  handleExcludes = (f: Excludes) => (
    <QueryElement key={f.field} {...f}>
      <IncludeExcludeQueryElement {...f} />
    </QueryElement>
  );
  handleEquals = (f: Equals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement {...f} />
    </QueryElement>
  );
  handleNotEquals = (f: NotEquals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement {...f} />
    </QueryElement>
  );
  handleLessThan = (f: LessThan) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement {...f} />
    </QueryElement>
  );
  handleLessThanOrEquals = (f: LessThanOrEquals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement {...f} />
    </QueryElement>
  );
  handleGreaterThan = (f: GreaterThan) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement {...f} />
    </QueryElement>
  );
  handleGreaterThanOrEquals = (f: GreaterThanOrEquals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement {...f} />
    </QueryElement>
  );
  handleExists = (f: Exists) => (
    <QueryElement key={f.field} {...f}>
      <ExistsElement {...f} />
    </QueryElement>
  );
  handleMissing = (f: Missing) => (
    <QueryElement key={f.field} {...f}>
      <ExistsElement {...f} />
    </QueryElement>
  );
  handleExcludeIfAny = (f: ExcludeIfAny) => null;
  handleIntersection = (f: Intersection) => {
    if (f.operands.length < 1) return null;

    // special case of ranges combined with AND
    if (
      f.operands.length == 2 &&
      isRangeOperation(f.operands[0]) &&
      isRangeOperation(f.operands[1])
    ) {
      const a = f.operands[0] as RangeOperation;
      const b = f.operands[1] as RangeOperation;
      return (
        <>
          <QueryElement key={a.field} {...a}>
            <ComparisonElement {...a} /> <span className="pr-1" />
          </QueryElement>
          and{" "}
          <QueryElement key={b.field} {...b}>
            <ComparisonElement showLabel={false} {...b} />
          </QueryElement>
        </>
      );
    }
    return null;
  };
  handleUnion = (f: Union) => {
    return <div>Union</div>;
  };
}

export const convertFilterToComponent = (filter: Operation): JSX.Element => {
  const handler: OperationHandler<JSX.Element> = new CohortFilterToComponent();
  return handleOperation(handler, filter);
};
