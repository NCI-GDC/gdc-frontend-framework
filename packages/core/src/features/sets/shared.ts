import { GqlOperation } from "../gdcapi/filters";
import { SortOption } from "../gdcapi/gdcgraphql";

export const createTopNQuery = (
  index: "genes" | "ssms",
  field: "gene_id" | "ssm_id",
) => {
  return `query topN${index}Query($case_filters: FiltersArgument,
    $filters: FiltersArgument, $score: String, $size: Int, $sort: [Sort]) {
    viewer {
      explore {
        ${index}  {
          hits(filters: $filters, case_filters: $case_filters, score:$score, first: $size, sort:$sort) {
            edges {
              node {
                  ${field}
              }
            }
          }
        }
      }
    }
  }`;
};

type SetIntent = "user" | "portal";
type SetCreationType = "instant" | "ephemeral" | "mutable" | "frozen";

export interface CreateSetFilterArgs {
  case_filters?: GqlOperation | Record<string, never>;
  filters?: GqlOperation | Record<string, never>;
  size?: number;
  score?: string;
  sort?: SortOption[];
  set_id?: string;
  set_type: SetCreationType;
  intent: SetIntent;
}

export interface ModifySetFilterArgs {
  case_filters?: GqlOperation | Record<string, never>;
  filters?: GqlOperation | Record<string, never>;
  size?: number;
  score?: string;
  sort?: SortOption[];
  setId?: string;
}

export interface CreateSetValueArgs {
  values: readonly string[];
  set_type: SetCreationType;
  intent: SetIntent;
}
