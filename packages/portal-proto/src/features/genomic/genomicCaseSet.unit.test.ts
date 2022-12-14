import {
  buildCaseSetMutationQuery,
  divideFilterSetByPrefix,
  REQUIRES_CASE_SET_FILTERS,
} from "@gff/core";
import { buildCaseSetGQLQueryAndVariablesFromFilters } from "./genomicCaseSet";
import { FilterSet } from "@gff/core/dist/dts";

describe("caseSet creation", () => {
  test("build the createSetQuery", () => {
    const cohortFilters: FilterSet = {
      mode: "and",
      root: {
        "genes.symbol": {
          field: "genes.symbol",
          operands: ["KRAS"],
          operator: "includes",
        },
        "ssms.ssm_id": {
          field: "ssms.ssm_id",
          operands: ["84aef48f-31e6-52e4-8e05-7d5b9ab15087"],
          operator: "includes",
        },
        "cases.primary_site": {
          field: "cases.primary_site",
          operands: ["pancreas"],
          operator: "includes",
        },
      },
    };

    const dividedFilters = divideFilterSetByPrefix(
      cohortFilters,
      REQUIRES_CASE_SET_FILTERS,
    );
    const { query, parameters, variables } =
      buildCaseSetGQLQueryAndVariablesFromFilters(
        dividedFilters.withPrefix,
        "2394944y3",
      );

    expect(query).toEqual(
      "genesCases : case (input: $inputgenes) { set_id size }," +
        "ssmsCases : case (input: $inputssms) { set_id size }",
    );

    const expected = {
      inputgenes: {
        filters: {
          content: [
            {
              content: {
                field: "genes.symbol",
                value: ["KRAS"],
              },
              op: "in",
            },
          ],
          op: "and",
        },
        set_id: "genes-2394944y3",
      },
      inputssms: {
        filters: {
          content: [
            {
              content: {
                field: "ssms.ssm_id",
                value: ["84aef48f-31e6-52e4-8e05-7d5b9ab15087"],
              },
              op: "in",
            },
          ],
          op: "and",
        },
        set_id: "ssms-2394944y3",
      },
    };

    expect(variables).toEqual(expected);
    const graphQL = buildCaseSetMutationQuery(parameters, query);
    expect(graphQL).toEqual(`
mutation mutationsCreateRepositoryCaseSetMutation(
   $inputgenes: CreateSetInput, $inputssms: CreateSetInput
) {
  sets {
    create {
      explore {
       genesCases : case (input: $inputgenes) { set_id size },ssmsCases : case (input: $inputssms) { set_id size }
    }
  }
 }
}`);
  });
});
