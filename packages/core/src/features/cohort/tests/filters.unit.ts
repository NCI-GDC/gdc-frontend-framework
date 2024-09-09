import { buildCohortGqlOperator, FilterSet } from "../filters";

describe("buildCohortGqlOperator", () => {
  test("build top-level or query", () => {
    const filterSet: FilterSet = {
      mode: "or",
      root: {
        "genes.cytoband": {
          operator: "includes",
          field: "genes.cytoband",
          operands: ["*TP53*"],
        },
        "genes.gene_id": {
          operator: "includes",
          field: "genes.gene_id",
          operands: ["*TP53*"],
        },
      },
    };

    const query = {
      op: "or",
      content: [
        {
          content: {
            field: "genes.cytoband",
            value: ["*TP53*"],
          },
          op: "in",
        },
        {
          content: {
            field: "genes.gene_id",
            value: ["*TP53*"],
          },
          op: "in",
        },
      ],
    };

    expect(buildCohortGqlOperator(filterSet)).toEqual(query);
  });
});
