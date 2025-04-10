import { GqlOperation } from "../gdcapi/filters";

export const createTopNQuery = (
  index: "genes" | "ssms",
  field: "gene_id" | "ssm_id",
) => {
  return `query topN${index}Query($case_filters: FiltersArgument,
    $filters: FiltersArgument, $score: String, $size: Int) {
    viewer {
      explore {
        ${index}  {
          hits(filters: $filters, case_filters: $case_filters, score:$score, first: $size) {
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
  set_id?: string;
  set_type: SetCreationType;
  intent: SetIntent;
}

export interface ModifySetFilterArgs {
  case_filters?: GqlOperation | Record<string, never>;
  filters?: GqlOperation | Record<string, never>;
  size?: number;
  score?: string;
  setId?: string;
}

export interface CreateSetValueArgs {
  values: readonly string[];
  set_type: SetCreationType;
  intent: SetIntent;
}
