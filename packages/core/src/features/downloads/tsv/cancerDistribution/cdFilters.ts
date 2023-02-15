export const filters_entity_tested = (
  entity: "ssm" | "cnv",
): Record<string, any> => {
  return {
    content: {
      field: "cases.available_variation_data",
      value: [entity],
    },
    op: "in",
  };
};

export const filters_cnv_tested = {
  content: [filters_entity_tested("cnv")],
  op: "and",
};

export const filters_ssms_counts = (id: string): Record<string, any> => {
  return {
    op: "and",
    content: [
      filters_entity_tested("ssm"),
      {
        op: "in",
        content: {
          field: "genes.gene_id",
          value: [id],
        },
      },
    ],
  };
};

export const filters_case_aggregations = (id: string): Record<string, any> => {
  return {
    op: "and",
    content: [
      filters_entity_tested("ssm"),
      {
        op: "NOT",
        content: {
          field: "cases.gene.ssm.observation.observation_id",
          value: "MISSING",
        },
      },
      {
        op: "in",
        content: {
          field: "genes.gene_id",
          value: [id],
        },
      },
    ],
  };
};

export const filters_cnv = (
  id: string,
  cnv: "Gain" | "Loss",
): Record<string, any> => {
  return {
    op: "and",
    content: [
      filters_entity_tested("cnv"),
      {
        content: {
          field: "cnvs.cnv_change",
          value: [cnv],
        },
        op: "in",
      },
      {
        op: "in",
        content: {
          field: "genes.gene_id",
          value: [id],
        },
      },
    ],
  };
};

export const cdFilters = (id: string): Record<string, any> => {
  // todo add camelCase key names for export
  return {
    filters_case_aggregations,
    id: filters_ssms_counts(id),
    filters_cnv_tested,
    filters_entity_tested,
  };
};
