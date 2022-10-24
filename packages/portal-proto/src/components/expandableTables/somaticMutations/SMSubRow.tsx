import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useSpring, config } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { convertMutationFilter } from "./smTableUtils";
import { GDC_APP_API_AUTH } from "@gff/core/src/constants";

export interface SMSubrowProps {
  mutationId: string;
  firstColumn: string;
  accessor: string;
  width: number;
  opening: boolean;
}

export const SMSubrow: React.FC<SMSubrowProps> = ({
  mutationId,
  firstColumn,
  accessor,
  width,
  opening,
}: SMSubrowProps) => {
  const [subData, setSubData] = useState([]);

  const horizontalSpring = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const getMutationSubrow = (mutationId: string) => {
    const SMQuery = gql`
      query getProjectDocCountsByMutation(
        $filters_case: FiltersArgument
        $filters_mutation: FiltersArgument
      ) {
        explore {
          cases {
            denominators: aggregations(filters: $filters_case) {
              project__project_id {
                buckets {
                  key
                  doc_count
                }
              }
            }
            numerators: aggregations(filters: $filters_mutation) {
              project__project_id {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
      }
    `;
    fetch(`${GDC_APP_API_AUTH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: SMQuery,
        variables: convertMutationFilter(mutationId),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        const { numerators, denominators } = json?.data?.explore?.cases;
        const { buckets: nBuckets } = numerators?.project__project_id;
        const { buckets: dBuckets } = denominators?.project__project_id;
        const agg = [];
        nBuckets.forEach(({ doc_count: nCount, key: nKey }) => {
          agg.push([dBuckets.find(({ key: dKey }) => nKey === dKey), nCount]);
        });
        setSubData(agg);
      });
  };

  useEffect(() => {
    // when row.canExpand() is false, row.original (the whole row) is undefined
    // geneId state variable set in Genes Table set when row expand btn clicked
    if (mutationId && !opening) getMutationSubrow(mutationId);
  }, [mutationId, opening]);

  return (
    <>
      {!opening && firstColumn === accessor && subData.length > 0 && (
        <div className={`relative`}>
          <ListSpring
            subData={subData}
            horizontalSpring={horizontalSpring}
            opening={opening}
          />
        </div>
      )}
    </>
  );
};
