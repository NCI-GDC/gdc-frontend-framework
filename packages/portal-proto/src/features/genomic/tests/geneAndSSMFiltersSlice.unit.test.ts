import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "../appApi";
import { updateGeneAndSSMFilter } from "../geneAndSSMFiltersSlice";

describe("updateGeneAndSSMFilter", () => {
  it("update fields normally", () => {
    const store = configureStore({ reducer: reducers });
    store.dispatch(
      updateGeneAndSSMFilter({
        field: "genes.is_cancer_gene_census",
        operation: {
          operator: "includes",
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
        },
      }),
    );
    expect(store.getState().filters).toEqual({
      mode: "and",
      root: {
        "genes.is_cancer_gene_census": {
          operator: "includes",
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
        },
      },
    });

    store.dispatch(
      updateGeneAndSSMFilter({
        field: "ssms.consequence.transcript.annotation.vep_impact",
        operation: {
          operator: "includes",
          field: "ssms.consequence.transcript.annotation.vep_impact",
          operands: ["high"],
        },
      }),
    );

    expect(store.getState().filters).toEqual({
      mode: "and",
      root: {
        "genes.is_cancer_gene_census": {
          operator: "includes",
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
        },
        "ssms.consequence.transcript.annotation.vep_impact": {
          operator: "includes",
          field: "ssms.consequence.transcript.annotation.vep_impact",
          operands: ["high"],
        },
      },
    });
  });

  it("update gene/ssm set filter clears other filters", () => {
    const store = configureStore({ reducer: reducers });
    store.dispatch(
      updateGeneAndSSMFilter({
        field: "genes.is_cancer_gene_census",
        operation: {
          operator: "includes",
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
        },
      }),
    );

    store.dispatch(
      updateGeneAndSSMFilter({
        field: "genes.gene_id",
        operation: {
          field: "genes.gene_id",
          operator: "includes",
          operands: ["ENSG00000141510"],
        },
      }),
    );

    expect(store.getState().filters).toEqual({
      mode: "and",
      root: {
        "genes.gene_id": {
          operator: "includes",
          field: "genes.gene_id",
          operands: ["ENSG00000141510"],
        },
      },
    });
  });

  it("removing ssm/gene set filter does not clear filters", () => {
    const store = configureStore({ reducer: reducers });
    store.dispatch(
      updateGeneAndSSMFilter({
        field: "genes.gene_id",
        operation: {
          field: "genes.gene_id",
          operator: "includes",
          operands: ["ENSG00000141510", "ENSG00000120332"],
        },
      }),
    );

    store.dispatch(
      updateGeneAndSSMFilter({
        field: "genes.is_cancer_gene_census",
        operation: {
          operator: "includes",
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
        },
      }),
    );

    store.dispatch(
      updateGeneAndSSMFilter({
        field: "genes.gene_id",
        operation: {
          field: "genes.gene_id",
          operator: "includes",
          operands: ["ENSG00000141510"],
        },
      }),
    );

    expect(store.getState().filters).toEqual({
      mode: "and",
      root: {
        "genes.is_cancer_gene_census": {
          operator: "includes",
          field: "genes.is_cancer_gene_census",
          operands: ["true"],
        },
        "genes.gene_id": {
          operator: "includes",
          field: "genes.gene_id",
          operands: ["ENSG00000141510"],
        },
      },
    });
  });
});
