import React, { PropsWithChildren, useContext, useEffect } from "react";
import { get } from "lodash";
import { ActionIcon, Divider, Group, Tooltip } from "@mantine/core";
import { QueryExpressionsExpandedContext } from "./QueryExpressionSection";
import CohortBadge from "./CohortBadge";
import { CloseIcon, RightArrowIcon, LeftArrowIcon } from "src/commonIcons";
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
  QueryExpressionHooks,
  Union,
} from "./types";

const QueryRepresentationText: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex truncate ... px-2 py-1 bg-base-max h-full">
    {children}
  </div>
);

const QueryFieldLabel: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="bg-accent-cool-content-lightest rounded-l-md text-base-darkest uppercase px-2 border-primary-darkest border-r-[1.5px] flex items-center">
    {children}
  </div>
);

const QueryContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-row items-stretch h-full bg-white rounded-md">
    {children}
  </div>
);

type RangeOperation =
  | LessThan
  | LessThanOrEquals
  | GreaterThanOrEquals
  | GreaterThan;

type ComparisonOperation = RangeOperation | Equals | NotEquals;

export const isRangeOperation = (x?: Operation): x is RangeOperation => {
  return (
    x !== undefined &&
    "operator" in x &&
    [">=", ">", "<", "<="].includes(x.operator)
  );
};

const IncludeExcludeQueryElement: React.FC<
  Includes | Excludes | ExcludeIfAny
> = ({
  field,
  operator,
  operands: operandsProp,
  hooks,
}: Includes | Excludes | ExcludeIfAny) => {
  const [queryExpressionsExpanded, setQueryExpressionsExpanded] = useContext(
    QueryExpressionsExpandedContext,
  );
  const currentCohort = hooks.useSelectCurrentCohort();
  const fieldNameToTitle = hooks.useFieldNameToTitle();

  useEffect(() => {
    if (get(queryExpressionsExpanded, field) === undefined) {
      setQueryExpressionsExpanded &&
        setQueryExpressionsExpanded({
          type: "expand",
          cohortId: currentCohort.id,
          field,
        });
    }
  }, [
    field,
    currentCohort.id,
    queryExpressionsExpanded,
    setQueryExpressionsExpanded,
  ]);

  const expanded = get(queryExpressionsExpanded, field, true);
  /*
  const fieldName =
    field === "genes.gene_id" ? "Mutated Gene" : fieldNameToTitle(field);
    */

  const fieldName = fieldNameToTitle(field);
  const operands =
    typeof operandsProp === "string" ? [operandsProp] : operandsProp;

  return (
    <QueryContainer>
      <QueryFieldLabel>
        {operator === "excludeifany" ? "EXCLUDES IF ANY" : fieldName}
      </QueryFieldLabel>
      <ActionIcon
        variant="transparent"
        size={"xs"}
        onClick={() => {
          setQueryExpressionsExpanded &&
            setQueryExpressionsExpanded({
              type: expanded ? "collapse" : "expand",
              cohortId: currentCohort.id,
              field,
            });
        }}
        className="ml-1 my-auto hover:bg-accent-darker hover:text-white"
        aria-label={expanded ? `collapse ${fieldName}` : `expand ${fieldName}`}
        aria-expanded={expanded}
      >
        {expanded ? (
          <LeftArrowIcon aria-hidden="true" />
        ) : (
          <RightArrowIcon aria-hidden="true" />
        )}
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
          <Group gap="xs">
            {operands.map((x, i) => {
              const value = x.toString();
              return (
                <CohortBadge
                  key={`query-rep-${field}-${value}-${i}`}
                  field={field}
                  value={value}
                  customTestid={`query-rep-${field}-${value}-${i}`}
                  operands={operands}
                  operator={operator}
                  hooks={hooks}
                />
              );
            })}
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
  const currentCohort = operation.hooks.useSelectCurrentCohort();
  const updateActiveCohortFilter = operation.hooks.useUpdateCohortFilter();
  const removeCohortFilter = operation.hooks.useRemoveCohortFilter();
  const fieldNameToTitle = operation.hooks.useFieldNameToTitle();

  const handleRemove = (remove: ComparisonOperation) => {
    const fieldDetail = currentCohort.filters.root[remove.field];

    if (!fieldDetail) return;

    if ("operands" in fieldDetail) {
      const remainingOperands = (
        fieldDetail.operands as readonly ComparisonOperation[]
      ).filter(
        (operand) =>
          operand.operand !== remove.operand &&
          operand.operator !== remove.operator,
      );

      if (remainingOperands.length > 0) {
        const [firstOperand] = remainingOperands;
        updateActiveCohortFilter({
          field: firstOperand.field,
          operation: firstOperand,
        });
      } else {
        removeCohortFilter(remove.field);
      }
    } else {
      removeCohortFilter(remove.field);
    }
  };

  /*
  const { data: geneSymbolDict, isSuccess } = useGeneSymbol([
    operation.operand.toString(),
  ]);

  let value = "";
  if (operation.field === "genes.gene_id") {
    value = isSuccess ? geneSymbolDict[operation.operand] ?? "..." : "...";
  } else {
    value = operation.operand.toString();
  }
    */

  const value = operation.operand.toString();

  return (
    <>
      {showLabel ? (
        <QueryFieldLabel>{fieldNameToTitle(operation.field)}</QueryFieldLabel>
      ) : null}
      <div className="flex flex-row items-center">
        <Tooltip label="Click to remove">
          <button
            className="h-[25px] w-[25px] mx-2 rounded-[50%] bg-accent-cool-content-lightest text-base pb-1"
            onClick={() => handleRemove(operation)}
          >
            {operation.operator}
          </button>
        </Tooltip>
        <QueryRepresentationText>{value}</QueryRepresentationText>
      </div>
    </>
  );
};

const ExistsElement: React.FC<Exists | Missing> = ({
  field,
  operator,
  hooks,
}: Exists | Missing) => {
  const fieldNameToTitle = hooks.useFieldNameToTitle();

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
  readonly hooks: QueryExpressionHooks;
  readonly op?: "and";
}

export const ClosedRangeQueryElement: React.FC<
  ClosedRangeQueryElementProps
> = ({
  lower,
  upper,
  hooks,
  op = "and",
}: PropsWithChildren<ClosedRangeQueryElementProps>) => {
  const field = lower.field; // As this is a Range the field for both lower and upper will be the same

  return (
    <>
      <QueryElement field={field} hooks={hooks}>
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
  hooks: QueryExpressionHooks;
}

export const QueryElement = ({
  field,
  hooks,
  children,
}: PropsWithChildren<QueryElementProps>) => {
  const [, setQueryExpressionsExpanded] = useContext(
    QueryExpressionsExpandedContext,
  );
  console.log({ hooks }, "3");
  const currentCohort = hooks.useSelectCurrentCohort();
  const removeCohortFilter = hooks.useRemoveCohortFilter();
  const fieldNameToTitle = hooks.useFieldNameToTitle();

  const handleRemoveFilter = () => {
    removeCohortFilter(field);
    setQueryExpressionsExpanded &&
      setQueryExpressionsExpanded({
        type: "clear",
        cohortId: currentCohort.id,
        field,
      });
  };

  return (
    <div className="flex flex-row items-center font-heading font-medium text-sm rounded-md border-[1.5px] mr-1 mb-2 border-secondary-darkest w-inherit">
      {children}
      {/* ---
        // TODO: enable facet dropdown
         <button onClick={handlePopupFacet}>
        <DropDownIcon size="1.5em" onClick={handlePopupFacet} />
      </button>
      -- */}
      <button
        className="bg-accent-vivid p-0 m-0 h-full rounded-r-sm text-white hover:bg-accent-darker"
        onClick={handleRemoveFilter}
        aria-label={`remove ${fieldNameToTitle(field)}`}
      >
        <CloseIcon size="1.5em" className="px-1" aria-hidden="true" />
      </button>
    </div>
  );
};

/**
 *  Processes a Filter into a component representation
 */
class CohortFilterToComponent implements OperationHandler<React.ReactNode> {
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
  handleExcludeIfAny = (f: ExcludeIfAny) => (
    <QueryElement key={f.field} {...f}>
      <IncludeExcludeQueryElement {...f} />
    </QueryElement>
  );
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
          hooks={f.hooks}
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

export const convertFilterToComponent = (
  filter: Operation,
  hooks: QueryExpressionHooks,
): React.ReactNode => {
  console.log({ hooks });
  const handler: OperationHandler<React.ReactNode> =
    new CohortFilterToComponent();
  console.log({ hooks });
  return handleOperation(handler, filter, hooks);
};
