import { SelectedEntities, SetOperationEntityType } from "./types";
import {
  useCreateSsmsSetFromFiltersMutation,
  useCreateGeneSetFromFiltersMutation,
  useCreateCaseSetFromFiltersMutation,
  GqlIntersection,
} from "@gff/core";

const ENTITY_TYPE_TO_FIELD = {
  cohort: "cases.case_id",
  genes: "genes.gene_id",
  mutations: "ssms.ssm_id",
};

export const createSetFiltersByKey = (
  key: string,
  entityType: SetOperationEntityType,
  sets: SelectedEntities,
): GqlIntersection => {
  let filters;

  const set1Filters = {
    content: {
      field: ENTITY_TYPE_TO_FIELD[entityType],
      value: `set_id:${sets[0].id}`,
    },
  };

  const set2Filters = {
    content: {
      field: ENTITY_TYPE_TO_FIELD[entityType],
      value: `set_id:${sets[1].id}`,
    },
  };

  const set3Filters = sets[2]
    ? {
        content: {
          field: ENTITY_TYPE_TO_FIELD[entityType],
          value: `set_id:${sets[2].id}`,
        },
      }
    : {};

  switch (key) {
    case "S1_intersect_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set2Filters,
          },
        ],
      };
      break;
    case "S1_minus_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
        ],
      };
      break;
    case "S2_minus_S1":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
        ],
      };
      break;
    case "S1_intersect_S2_intersect_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "in",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S1_intersect_S2_minus_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S2_intersect_S3_minus_S1":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "in",
            ...set3Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
        ],
      };
      break;
    case "S1_intersect_S3_minus_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "in",
            ...set3Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
        ],
      };
      break;
    case "S1_minus_S2_union_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S2_minus_S1_union_S3":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set2Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set3Filters,
          },
        ],
      };
      break;
    case "S3_minus_S1_union_S2":
      filters = {
        op: "and",
        content: [
          {
            op: "in",
            ...set3Filters,
          },
          {
            op: "exclude",
            ...set1Filters,
          },
          {
            op: "exclude",
            ...set2Filters,
          },
        ],
      };
      break;
  }

  return filters;
};

export const ENTITY_TYPE_TO_CREATE_SET_HOOK = {
  cohort: useCreateCaseSetFromFiltersMutation,
  genes: useCreateGeneSetFromFiltersMutation,
  mutations: useCreateSsmsSetFromFiltersMutation,
};
