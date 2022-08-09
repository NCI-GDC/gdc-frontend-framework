export interface ProjectDocCount {
  doc_count: number;
  key: string;
  geneId: string;
}

export interface GetCountsByGeneResponse {
  data: {
    explore: {
      cases: {
        aggregations: {
          project__project_id: {
            buckets: ProjectDocCount[];
          };
        };
      };
    };
  };
}

export const getGraphQLGeneId = (geneId: string | undefined) => {
  return {
    op: "and",
    content: [
      {
        content: {
          field: "genes.gene_id",
          value: [geneId],
        },
        op: "in",
      },
      {
        op: "NOT",
        content: {
          field: "cases.gene.ssm.observation.observation_id",
          value: "MISSING",
        },
      },
    ],
  };
};
