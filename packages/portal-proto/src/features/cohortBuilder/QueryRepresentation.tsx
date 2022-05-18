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

type ComparisonOperation = Equals | NotEquals | RangeOperation;

const IncludeExcludeQueryElement: React.FC<Includes | Excludes> = ({
  field,
  operator,
  operands,
}: Includes | Excludes) => {
  const [groupType, setGroupType] = useState(operator);

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

const ComparisonElement: React.FC<ComparisonOperation> = ({
  field,
  operator,
  operand,
}: ComparisonOperation) => {
  return (
    <div className="flex flex-row items-center">
      {convertFieldToName(field)}
      <span className="px-1 underline">{operator}</span>
      <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">
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

export const QueryElement: React.FC<Operation> = ({
  field,
  children,
}: PropsWithChildren<Operation>) => {
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

// interface EnumValueElementProps {
//   readonly values: ReadonlyArray<string> | ReadonlyArray<number>;
// }
//
// const EnumValueElement: React.FC<EnumValueElementProps> = ({
//   values,
// }: EnumValueElementProps) => {
//   return (
//     <>
//       <span className="px-1 underline">{filter_set_label_v1["any_of"]}</span>
//       <div className="flex truncate ... max-w-sm px-2 border-l-2 border-nci-gray-light ">
//         {values.join(",")}
//       </div>
//     </>
//   );
// };

// const CohortEnumFilterElement: React.FC<EnumFilterProps> = (
//   props: EnumFilterProps,
// ) => {
//   return (
//     <CohortValueFilterElement {...props}>
//       <EnumValueElement values={props.values} />
//     </CohortValueFilterElement>
//   );
// };

// const CohortRangeFilterElement: React.FC<EnumFilterProps> = (
//   props: EnumFilterProps,
// ) => {
//   return (
//     <CohortValueFilterElement {...props}>
//       <EnumValueElement values={props.values} />
//     </CohortValueFilterElement>
//   );
// };

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
    return <div>Intersection</div>;
  };
  handleUnion = (f: Union) => {
    return <div>Union</div>;
  };
}

export const convertFilterToComponent = (filter: Operation): JSX.Element => {
  console.log("converting ", filter);
  const handler: OperationHandler<JSX.Element> = new CohortFilterToComponent();
  return handleOperation(handler, filter);
};
