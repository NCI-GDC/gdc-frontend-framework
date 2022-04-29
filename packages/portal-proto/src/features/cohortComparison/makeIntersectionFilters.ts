import { GqlOperation } from "@gff/core";

interface IntersectionFilters {
  cohort1: GqlOperation;
  cohort2: GqlOperation;
  intersection: GqlOperation;
}

const makeIntersectionFilters = (
  cohort1Filters: GqlOperation,
  cohort2Filters: GqlOperation,
  caseIds: string[][],
): IntersectionFilters => {
  // Data should be in only one of the cohorts, not both so exclude cases ids from the other set

  const cohort1Content = [];
  const cohort2Content = [];
  const intersectionContent = [];

  if (cohort1Filters) {
    cohort1Content.push(cohort1Filters);
  }

  if (cohort2Filters) {
    cohort2Content.push(cohort2Filters);
  }

  if (caseIds[0]) {
    cohort2Content.push({
      op: "exclude",
      content: { field: "cases.case_id", value: caseIds[0] },
    });

    intersectionContent.push({
      op: "in",
      content: { field: "cases.case_id", value: caseIds[0] },
    });
  }

  if (caseIds[1]) {
    cohort1Content.push({
      op: "exclude",
      content: { field: "cases.case_id", value: caseIds[1] },
    });

    intersectionContent.push({
      op: "in",
      content: { field: "cases.case_id", value: caseIds[1] },
    });
  }

  return {
    cohort1: {
      op: "and",
      content: cohort1Content,
    },
    cohort2: {
      op: "and",
      content: cohort2Content,
    },
    intersection: {
      op: "and",
      content: intersectionContent,
    },
  };
};

export default makeIntersectionFilters;
