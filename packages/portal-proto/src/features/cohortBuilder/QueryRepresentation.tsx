import { PropsWithChildren, useContext, useEffect } from "react";
import { omit } from "lodash";
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
  fieldNameToTitle,
} from "@gff/core";
import { ActionIcon, Badge, Divider, Group } from "@mantine/core";
import {
  MdClose as ClearIcon,
  MdOutlineArrowBack as LeftArrow,
  MdOutlineArrowForward as RightArrow,
} from "react-icons/md";
import tw from "tailwind-styled-components";
import { QueryExpressionsExpandedContext } from "./QueryExpressionSection";

const QueryRepresentationText = tw.div`
flex truncate ... px-2 bg-base-max h-full
`;

const QueryFieldLabel = tw.span`
bg-accent-lightest
text-primary-darkest
uppercase
px-2
border-primary-darkest
border-r-[1.5px]
`;

const QueryItemContainer = tw.div`
flex
flex-row
items-center
font-heading
shadow-md
font-medium
text-md
rounded-sm
border-[1.5px]
mr-1
mb-2
border-primary-darkest
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
  const dispatch = useCoreDispatch();
  const [queryExpressionsExpanded, setQueryExpressionsExpanded] = useContext(
    QueryExpressionsExpandedContext,
  );

  useEffect(() => {
    setQueryExpressionsExpanded({ ...queryExpressionsExpanded, [field]: true });
    // Should only be run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const RemoveButton = ({
    operand,
    operands,
  }: {
    readonly operand: string | number;
    readonly operands: readonly (string | number)[];
  }): JSX.Element => (
    <ActionIcon
      size="xs"
      color="accent-content.0"
      radius="xl"
      variant="transparent"
      onClick={() => {
        const newOperands = operands.filter((o) => o !== operand);
        dispatch(
          updateCohortFilter({
            field,
            operation: {
              operator,
              field,
              operands: newOperands,
            },
          }),
        );
        if (newOperands.length === 0) {
          dispatch(removeCohortFilter(field));
        }
        setQueryExpressionsExpanded(omit(queryExpressionsExpanded, field));
      }}
    >
      <ClearIcon />
    </ActionIcon>
  );

  return (
    <div className="flex flex-row items-center h-full bg-white">
      <QueryFieldLabel>{fieldNameToTitle(field)}</QueryFieldLabel>
      <div className="p-1 h-full">
        <ActionIcon
          variant="transparent"
          size={"xs"}
          onClick={() =>
            setQueryExpressionsExpanded({
              ...queryExpressionsExpanded,
              [field]: !queryExpressionsExpanded[field],
            })
          }
        >
          {queryExpressionsExpanded[field] ? <LeftArrow /> : <RightArrow />}
        </ActionIcon>
      </div>
      <Divider
        orientation="vertical"
        size="xs"
        className="m-1"
        color="base.2"
      />
      <QueryRepresentationText>
        {!queryExpressionsExpanded[field] ? (
          <b className="text-primary-darkest">{operands.length}</b>
        ) : (
          <Group noWrap>
            {operands.map((x, i) => (
              <Badge
                key={`query-rep-${field}-${x}-${i}`}
                variant="filled"
                color="primary.9"
                size="md"
                className="normal-case max-w-[162px]"
                rightSection={<RemoveButton operand={x} operands={operands} />}
                title={x.toString()}
              >
                {x}
              </Badge>
            ))}
          </Group>
        )}
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
        <QueryFieldLabel>{fieldNameToTitle(operation.field)}</QueryFieldLabel>
      ) : null}
      <div className="flex flex-row items-center">
        <button
          className="h-[25px] w-[25px] mx-2 rounded-[50%] bg-accent-lightest "
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
      {fieldNameToTitle(field)} is
      <span className="px-1 underline">{operator}</span>
    </div>
  );
};

interface ClosedRangeQueryElementProps {
  readonly lower: ComparisonOperation;
  readonly upper: ComparisonOperation;
  readonly op?: "and";
}

export const ClosedRangeQueryElement: React.FC<
  ClosedRangeQueryElementProps
> = ({
  lower,
  upper,
  op = "and",
}: PropsWithChildren<ClosedRangeQueryElementProps>) => {
  const field = lower.field; // As this is a Range the field for both lower and upper will be the same

  return (
    <>
      <QueryElement field={field}>
        <ComparisonElement operation={lower} />
        <span className={"uppercase text-accent-contrast-max font-bold"}>
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
      <div className="bg-white flex">{children}</div>
      {/* ---
        // TODO: enable facet dropdown
         <button onClick={handlePopupFacet}>
        <DropDownIcon size="1.5em" onClick={handlePopupFacet} />
      </button>
      -- */}
      <button
        className="bg-primary-darkest p-0 m-0 h-full round-r-lg text-accent-contrast "
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
