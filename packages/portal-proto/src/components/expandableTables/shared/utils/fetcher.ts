export interface MutatedGenesFrequencyTable {
  explore: {
    cases: {
      denominators: string;
      numerators: number;
      remaining: Record<string, string>;
    };
  };
}

export type MutatedGenesFrequencyTableJSON =
  Partial<MutatedGenesFrequencyTable>;

export interface MutatedGenesFrequencyTableTSV {}

export interface MutationsFrequencyTableJSON {}

export interface MutationsFrequencyTableTSV {}

export interface DownloadFeature {
  data:
    | MutatedGenesFrequencyTableJSON
    | MutatedGenesFrequencyTableTSV
    | MutationsFrequencyTableJSON
    | MutationsFrequencyTableTSV;
}

const initialMutatedGenesTSVFilters = {
  filters_case: {
    content: [
      {
        content: {
          field: "cases.available_variation_data",
          value: ["ssm"],
        },
        op: "in",
      },
    ],
    op: "and",
  },
};

const initialMutationsFreqTSVFilters = {};

const getGeneFilter = (id) => {
  return {
    op: "and",
    content: [
      {
        content: {
          field: "genes.gene_id",
          includes: [id],
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

const appendFilters = (
  initial: Record<string, any>,
  appending: string[],
): Record<string, any> => {
  const filters = { ...initial };
  appending.forEach((id) => {
    filters[`filters_gene_${id}`] = getGeneFilter(id);
  });
  return filters;
};

export const getFilters = (feature: string, ids: string[]) => {
  switch (feature) {
    case "mutatedGenesTSV": {
      return appendFilters(initialMutatedGenesTSVFilters, ids);
    }
    case "mutationsFreqTSV": {
      return appendFilters(initialMutationsFreqTSVFilters, ids);
    }
  }
};

// 1 mutated genes json

// 2 mutated genes tsv

// 3 mutations freq json

// 4 mutations freq tsv

const downloadFeature = (
  data: DownloadFeature,
  feature: string,
  options?: Record<string, any>,
) => {
  switch (feature) {
    case "mutated-genes-frequency-table-json": {
      //   const { genes, cnvCases, filteredCases, mutationCounts } =
      //   options?.tableData;

      // const { denominators, ...remaining } =
      //   data?.data?.explore?.cases;

      // const mutatedGenes = genes.map(
      //   ({
      //     gene_id,
      //     symbol,
      //     name,
      //     cytoband,
      //     biotype,
      //     numCases,
      //     case_cnv_gain,
      //     case_cnv_loss,
      //     is_cancer_gene_census,
      //   }: {
      //     gene_id: string;
      //     symbol: string;
      //     name: string;
      //     cytoband: string[];
      //     biotype: string;
      //     numCases: number;
      //     case_cnv_gain: number;
      //     case_cnv_loss: number;
      //     is_cancer_gene_census: boolean;
      //   }) => {
      //     return {
      //       gene_id,
      //       symbol,
      //       name,
      //       cytoband: cytoband.join(", "),
      //       biotype,
      //       ssmsAffectedCasesInCohort: `${numCases} / ${filteredCases} (${(
      //         100 *
      //         (numCases / filteredCases)
      //       ).toFixed(2)}%)`,
      //       ssmsAffectedCasesAcrossGDC: remaining[
      //         `filters_genes_${gene_id}`.replaceAll("-", "_")
      //       ]?.project__project_id?.buckets
      //         ?.map(
      //           ({
      //             doc_count: n,
      //             key: project,
      //           }: {
      //             doc_count: number;
      //             key: string;
      //           }) => {
      //             const d = denominators?.project__project_id?.buckets.find(
      //               ({ key }: { key: string }) => key === project,
      //             )?.doc_count;
      //             return `${project}: ${n} / ${d} (${(100 * (n / d)).toFixed(
      //               2,
      //             )}%)`;
      //           },
      //         )
      //         .join(", "),
      //       cnvGain: `${case_cnv_gain} / ${cnvCases} (${(
      //         100 *
      //         (case_cnv_gain / cnvCases)
      //       ).toFixed(2)}%)`,
      //       cnvLoss: `${case_cnv_loss} / ${cnvCases} (${(
      //         100 *
      //         (case_cnv_loss / cnvCases)
      //       ).toFixed(2)}%)`,
      //       ...(mutationCounts[gene_id] && {
      //         mutations: mutationCounts[gene_id],
      //       }),
      //       is_cancer_gene_census: is_cancer_gene_census
      //         ? "Cancer Gene Census"
      //         : "",
      //     };
      //   },
      // );
      // debugger;
      return;
      // return {
      //   data: { results: mutatedGenes as any },
      // }
    }
    case "mutated-genes-frequency-table-tsv": {
      return;
    }
    case "mutations-frequency-table-json": {
      return;
    }
    case "mutations-frequency-table-tsv": {
      return;
    }
  }
};
