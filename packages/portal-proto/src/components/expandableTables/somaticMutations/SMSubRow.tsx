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
    config: config.slow,
  });

  useEffect(() => console.log("mutationId", mutationId), []);

  const getMutationSubrow = (mutationId: string) => {
    const SMQuery = gql`
      query getProjectDocCountsByMutation($filters_mutation: FiltersArgument) {
        explore {
          cases {
            aggregations(filters: $filters_mutation) {
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
        console.log("mutationId", mutationId);
        setSubData([]);
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
