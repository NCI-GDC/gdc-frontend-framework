import { PropsWithChildren, useContext, useEffect } from "react";
import { get } from "lodash";
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
  useCoreSelector,
  selectCurrentCohortId,
} from "@gff/core";
import { ActionIcon, Badge, Divider, Group } from "@mantine/core";
import {
  MdClose as ClearIcon,
  MdOutlineArrowBack as LeftArrow,
  MdOutlineArrowForward as RightArrow,
} from "react-icons/md";
import tw from "tailwind-styled-components";
import OverflowTooltippedLabel from "@/components/OverflowTooltippedLabel";
import { QueryExpressionsExpandedContext } from "./QueryExpressionSection";

const QueryRepresentationText = tw.div`
flex truncate ... px-2 py-1 bg-base-max h-full
`;

const QueryFieldLabel = tw.div`
bg-accent-lightest
text-primary-darkest
uppercase
px-2
border-primary-darkest
border-r-[1.5px]
flex
items-center
`;

const QueryItemContainer = tw.div`
flex
flex-row
items-center
font-heading
shadow-md
font-medium
text-sm
rounded-sm
border-[1.5px]
mr-1
mb-2
border-primary-darkest
w-inherit
`;

const QueryContainer = tw.div`
flex
flex-row
items-stretch
h-full
bg-white
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
  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );

  useEffect(() => {
    if (get(queryExpressionsExpanded, field) === undefined) {
      setQueryExpressionsExpanded({
        type: "expand",
        cohortId: currentCohortId,
        field,
      });
    }
  }, [
    field,
    currentCohortId,
    queryExpressionsExpanded,
    setQueryExpressionsExpanded,
  ]);

  const expanded = get(queryExpressionsExpanded, field, true);

  const RemoveButton = () => (
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
    <QueryContainer>
      <QueryFieldLabel>{fieldNameToTitle(field)}</QueryFieldLabel>
      <ActionIcon
        variant="transparent"
        size={"xs"}
        onClick={() => {
          setQueryExpressionsExpanded({
            type: expanded ? "collapse" : "expand",
            cohortId: currentCohortId,
            field,
          });
        }}
        className="ml-1 my-auto"
      >
        {expanded ? <LeftArrow /> : <RightArrow />}
      </ActionIcon>
      <Divider
        orientation="vertical"
        size="xs"
        className="m-1"
        color="base.2"
      />
      {!expanded ? (
        <b className="text-primary-darkest px-2 py-1 flex items-center">
          {operands.length}
        </b>
      ) : (
        <QueryRepresentationText>
          <Group spacing="xs">
            {operands.map((x, i) => (
              <Badge
                variant="filled"
                color="primary.9"
                size="md"
                className="normal-case max-w-[162px]"
                rightSection={<RemoveButton />}
                onClick={() => {
                  const newOperands = operands.filter((o) => o !== x);
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
                    setQueryExpressionsExpanded({
                      type: "clear",
                      cohortId: currentCohortId,
                      field,
                    });
                    dispatch(removeCohortFilter(field));
                  }
                }}
              >
                <OverflowTooltippedLabel label={x.toString()}>
                  {x}
                </OverflowTooltippedLabel>
              </Badge>
            ))}
          </Group>
        </QueryRepresentationText>
      )}
    </QueryContainer>
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
          className="h-[25px] w-[25px] mx-2 rounded-[50%] bg-accent-lightest text-base"
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
        <QueryContainer>
          <ComparisonElement operation={lower} />
          <div className="flex items-center">
            <span className={"uppercase text-accent-contrast-max font-bold"}>
              {op}
            </span>
          </div>
          <ComparisonElement operation={upper} showLabel={false} />
        </QueryContainer>
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
  const [, setQueryExpressionsExpanded] = useContext(
    QueryExpressionsExpandedContext,
  );
  const currentCohortId = useCoreSelector((state) =>
    selectCurrentCohortId(state),
  );

  const handleRemoveFilter = () => {
    coreDispatch(removeCohortFilter(field));
    setQueryExpressionsExpanded({
      type: "clear",
      cohortId: currentCohortId,
      field,
    });
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
