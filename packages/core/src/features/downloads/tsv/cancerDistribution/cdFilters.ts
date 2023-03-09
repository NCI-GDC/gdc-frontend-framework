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

export const filters_ssm_counts = (id: string): Record<string, any> => {
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

export const filters_mutations = (id: string): Record<string, any> => {
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
  return {
    filters_mutations,
    id: filters_ssm_counts(id),
    filters_cnv_tested,
    filters_entity_tested,
  };
};

export const cdTableGeneSummaryQuery = (id: string) => {
  return {
    project: `key`,
    diseaseType: `disease_type`,
    primarySite: `primary_site`,
    ssmsAffectedCases: `filters_ssmAffectedCases_${id}`,
    cnvGains: `filters_cnvGains_${id}`,
    cnvLosses: `filters_cnvLosses_${id}`,
    mutations: `filters_mutations_${id}`,
  };
};

export const cdTableGeneSummaryFilters = (id: string) => {
  return {
    cnvGains: filters_cnv(id, "Gain"),
    cnvLosses: filters_cnv(id, "Loss"),
    mutations: filters_mutations(id),
    ssmsAffectedCases: filters_mutations(id),
  };
};

export const cdTableMutationSummaryQuery = (id: string) => {
  return {
    project: `key`,
    diseaseType: `disease_type`,
    primarySite: `primary_site`,
    ssmsAffectedCases: `filters_ssmAffectedCases_${id}`,
  };
};

export const cdTableMutationSummaryFilters = (id: string) => {
  return {
    id: () => {
      id;
    },
    // todo
  };
};
