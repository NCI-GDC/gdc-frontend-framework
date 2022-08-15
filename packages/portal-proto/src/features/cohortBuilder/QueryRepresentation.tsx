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
  updateCohortFilter,
  removeCohortFilter,
  Union,
  useCoreDispatch,
} from "@gff/core";
import { ActionIcon, Badge, Group } from "@mantine/core";
import { convertFieldToName } from "@/features/facets/utils";
import {
  MdArrowDropDown as DropDownIcon,
  MdClose as ClearIcon,
} from "react-icons/md";
import tw from "tailwind-styled-components";

const QueryRepresentationText = tw.div`
flex truncate ... px-2 bg-base-max
`;

const QueryFieldLabel = tw.span`
text-accent-content-darkest uppercase px-2 border-accent border-r-2
`;

const QueryItemContainer = tw.div`
flex
flex-row
items-center
font-heading 
shadow-md 
font-medium
text-md
rounded-md 
border-1
mr-1
border-accent-light
`;

type RangeOperation =
  | LessThan
  | LessThanOrEquals
  | GreaterThanOrEquals
  | GreaterThan;

type ValueOperation = Exclude<Operation, Intersection | Union>;
type ComparisonOperation = RangeOperation | Equals | NotEquals;

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

  const removeButton = (
    <ActionIcon
      size="xs"
      color="accent-content.0"
      radius="xl"
      variant="transparent"
    >
      <ClearIcon />
    </ActionIcon>
  );

  return (
    <div className="flex flex-row items-center">
      <QueryFieldLabel>{convertFieldToName(field)}</QueryFieldLabel>
      <QueryRepresentationText>
        <Group noWrap>
          {operands.map((x) => (
            <Badge
              key={`query-rep-${field}-{x}`}
              variant="filled"
              color="accent.3"
              size="md"
              className="normal-case"
              rightSection={removeButton}
            >
              {x}
            </Badge>
          ))}
        </Group>
      </QueryRepresentationText>
    </div>
  );
};

interface ComparisonElementProps {
  operation: ComparisonOperation;
  readonly showLabel?: boolean;
}

const ComparisonElement: React.FC<ComparisonElementProps> = ({
  operation,
  showLabel = true,
}: ComparisonElementProps) => {
  const coreDispatch = useCoreDispatch();
  const handleKeepMember = (keep: ValueOperation) => {
    coreDispatch(updateCohortFilter({ field: keep.field, operation: keep }));
  };

  return (
    <>
      {showLabel ? (
        <QueryFieldLabel>{convertFieldToName(operation.field)}</QueryFieldLabel>
      ) : null}
      <div className="flex flex-row items-center bg-accent-content-max">
        <button
          className="p-1 mx-2 rounded-md bg-accent-lightest "
          onClick={() => handleKeepMember(operation)}
        >
          {operation.operator}
        </button>
        <QueryRepresentationText>{operation.operand}</QueryRepresentationText>
      </div>
    </>
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

interface ClosedRangeQueryElementProps {
  readonly lower: ComparisonOperation;
  readonly upper: ComparisonOperation;
  readonly op?: "and";
}

export const ClosedRangeQueryElement: React.FC<ClosedRangeQueryElementProps> =
  ({
    lower,
    upper,
    op = "and",
  }: PropsWithChildren<ClosedRangeQueryElementProps>) => {
    const field = lower.field; // As this is a Range the field for both lower and upper will be the same

    return (
      <>
        <QueryElement field={field}>
          <ComparisonElement operation={lower} />
          <span
            className={
              "uppercase bg-accent-content-max text-accent-content-darkest text-bold"
            }
          >
            {op}
          </span>
          <ComparisonElement operation={upper} showLabel={false} />
        </QueryElement>
      </>
    );
  };

interface QueryElementProps {
  field: string;
}

export const QueryElement: React.FC<QueryElementProps> = ({
  field,
  children,
}: PropsWithChildren<QueryElementProps>) => {
  //  const [showPopup, setShowPopup] = useState(false);
  const coreDispatch = useCoreDispatch();

  const handleRemoveFilter = () => {
    coreDispatch(removeCohortFilter(field));
  };

  // TODO: Enable facet dropdown
  //const handlePopupFacet = () => {
  //  setShowPopup(!showPopup);
  //};

  return (
    <QueryItemContainer>
      {children}
      {/* ---
        // TODO: enable facet dropdown
         <button onClick={handlePopupFacet}>
        <DropDownIcon size="1.5em" onClick={handlePopupFacet} />
      </button>
      -- */}
      <button
        className="bg-accent p-0 m-0 h-full round-r-lg text-accent-content-max "
        onClick={handleRemoveFilter}
      >
        <ClearIcon size="1.5em" className="px-1" />
      </button>
    </QueryItemContainer>
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
      <ComparisonElement operation={f} />
    </QueryElement>
  );
  handleNotEquals = (f: NotEquals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement operation={f} />
    </QueryElement>
  );
  handleLessThan = (f: LessThan) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement operation={f} />
    </QueryElement>
  );
  handleLessThanOrEquals = (f: LessThanOrEquals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement operation={f} />
    </QueryElement>
  );
  handleGreaterThan = (f: GreaterThan) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement operation={f} />
    </QueryElement>
  );
  handleGreaterThanOrEquals = (f: GreaterThanOrEquals) => (
    <QueryElement key={f.field} {...f}>
      <ComparisonElement operation={f} />
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleExcludeIfAny = (_f: ExcludeIfAny) => null;
  handleIntersection = (f: Intersection) => {
    if (f.operands.length < 1) return null;

    // special case of ranges combined with AND
    if (
      f.operands.length == 2 &&
      isRangeOperation(f.operands[0]) &&
      isRangeOperation(f.operands[1])
    ) {
      return (
        <ClosedRangeQueryElement
          key={(f.operands[0] as ComparisonOperation).field}
          lower={f.operands[0] as ComparisonOperation}
          upper={f.operands[1] as ComparisonOperation}
        />
      );
    }
    return null;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleUnion = (_f: Union) => {
    return <div>Union</div>;
  };
}

export const convertFilterToComponent = (filter: Operation): JSX.Element => {
  const handler: OperationHandler<JSX.Element> = new CohortFilterToComponent();
  return handleOperation(handler, filter);
};
