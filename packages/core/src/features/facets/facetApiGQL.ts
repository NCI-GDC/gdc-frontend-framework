import { DataStatus } from "../../dataAcess";


export const convertFacetNameToGQL = (x:string) => x.replaceAll('.', '__')
export const normalizeGQLFacetName = (x:string) => x.replaceAll('__', '.')

export const buildGraphGLBucketQuery = ( what: string, facetName: string, type = "explore" ) : string => {
  const queryGQL = `
  query ExploreCasesPies($filters_0: FiltersArgument!) {
      viewer {
          ${type} {
            ${what} {
              aggregations(
                filters: $filters_0
                aggregations_filter_themselves: false
              ) {
                ${facetName} {
                  buckets {
                    doc_count
                    key
                  }
                }
              }
            }
          }
        }
      }
  `
  return queryGQL;
}
export interface BucketCountsQueryProps {
  readonly type: string;
  readonly what: string;
  readonly facetName: string;
}

export interface FacetBuckets {
  readonly status: DataStatus;
  readonly error?: string;
  readonly buckets?: Record<string, number>;
}
