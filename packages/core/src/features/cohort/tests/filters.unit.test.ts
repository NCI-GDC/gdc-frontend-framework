import { GqlIntersection, GqlUnion } from "src/features/gdcapi/filters";
import {
  buildCohortGqlOperator,
  buildGqlOperationToFilterSet,
  FilterSet,
} from "../filters";

describe("buildGqlOperationToFilterSet", () => {
  it("should correctly transform nested GqlIntersection to FilterSet", () => {
    const input: GqlIntersection = {
      content: [
        {
          content: [
            {
              content: {
                field: "cases.diagnoses.age_at_diagnosis",
                value: 14610,
              },
              op: ">=",
            },
            {
              content: {
                field: "cases.diagnoses.age_at_diagnosis",
                value: 18263,
              },
              op: "<",
            },
          ],
          op: "and",
        },
      ],
      op: "and",
    };

    const expected = {
      mode: "and",
      root: {
        "cases.diagnoses.age_at_diagnosis": {
          operator: "and",
          operands: [
            {
              operator: ">=",
              field: "cases.diagnoses.age_at_diagnosis",
              operand: 14610,
            },
            {
              operator: "<",
              field: "cases.diagnoses.age_at_diagnosis",
              operand: 18263,
            },
          ],
        },
      },
    };

    const result = buildGqlOperationToFilterSet(input);
    expect(result).toEqual(expected);
  });

  it("should return empty FilterSet for empty input", () => {
    const input = {};
    const expected = { mode: "and", root: {} };

    const result = buildGqlOperationToFilterSet(input);
    expect(result).toEqual(expected);
  });

  it("should correctly transform GqlUnion to FilterSet", () => {
    const input: GqlUnion = {
      content: [
        {
          content: {
            field: "cases.project.project_id",
            value: ["TCGA-BRCA", "TCGA-OV"],
          },
          op: "in",
        },
        {
          content: {
            field: "cases.demographic.vital_status",
            value: ["alive"],
          },
          op: "in",
        },
      ],
      op: "or",
    };

    const expected = {
      mode: "or",
      root: {
        "cases.project.project_id": {
          operator: "includes",
          field: "cases.project.project_id",
          operands: ["TCGA-BRCA", "TCGA-OV"],
        },
        "cases.demographic.vital_status": {
          operator: "includes",
          field: "cases.demographic.vital_status",
          operands: ["alive"],
        },
      },
    };

    const result = buildGqlOperationToFilterSet(input);
    expect(result).toEqual(expected);
  });

  it("should handle nested AND and OR operations", () => {
    const input: GqlIntersection | GqlUnion | Record<string, never> = {
      content: [
        {
          content: [
            {
              content: {
                field: "cases.diagnoses.age_at_diagnosis",
                value: 14610,
              },
              op: ">=",
            },
            {
              content: {
                field: "cases.diagnoses.age_at_diagnosis",
                value: 18263,
              },
              op: "<",
            },
          ],
          op: "and",
        },
        {
          content: [
            {
              content: {
                field: "cases.project.project_id",
                value: ["TCGA-BRCA", "TCGA-OV"],
              },
              op: "in",
            },
            {
              content: {
                field: "cases.demographic.vital_status",
                value: ["alive"],
              },
              op: "in",
            },
          ],
          op: "or",
        },
      ],
      op: "and",
    };

    const expected = {
      mode: "and",
      root: {
        "cases.diagnoses.age_at_diagnosis": {
          operator: "and",
          operands: [
            {
              operator: ">=",
              field: "cases.diagnoses.age_at_diagnosis",
              operand: 14610,
            },
            {
              operator: "<",
              field: "cases.diagnoses.age_at_diagnosis",
              operand: 18263,
            },
          ],
        },
        "cases.project.project_id": {
          operator: "or",
          operands: [
            {
              operator: "includes",
              field: "cases.project.project_id",
              operands: ["TCGA-BRCA", "TCGA-OV"],
            },
            {
              operator: "includes",
              field: "cases.demographic.vital_status",
              operands: ["alive"],
            },
          ],
        },
      },
    };

    const result = buildGqlOperationToFilterSet(input);
    expect(result).toEqual(expected);
  });

  it("should handle a single operation", () => {
    const input: GqlIntersection = {
      content: [
        {
          content: {
            field: "cases.project.project_id",
            value: "TCGA-BRCA",
          },
          op: "=",
        },
      ],
      op: "and",
    };

    const expected = {
      mode: "and",
      root: {
        "cases.project.project_id": {
          operator: "=",
          field: "cases.project.project_id",
          operand: "TCGA-BRCA",
        },
      },
    };

    const result = buildGqlOperationToFilterSet(input);
    expect(result).toEqual(expected);
  });
});

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
