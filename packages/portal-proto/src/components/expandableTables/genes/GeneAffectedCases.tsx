import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useSpring, config } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { convertGeneFilter } from "./genesTableUtils";
import { GDC_APP_API_AUTH } from "../../../../../core/src/constants";

export interface GeneSubRow {
  geneId: any;
  firstColumn: string;
  accessor: string;
  width: number;
  opening: boolean;
}

export const GeneAffectedCases: React.FC<GeneSubRow> = ({
  geneId,
  firstColumn,
  accessor,
  width,
  opening,
}: GeneSubRow) => {
  const [subData, setSubData] = useState([]);

  const horizontalSpring = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: width, opacity: 1 },
    config: config.slow,
  });

  const getGeneSubRow = (geneId: string) => {
    const exploreCasesAggregatedProjectsBucketsQuery = gql`
      query getProjectDocCountsByGene($filters_1: FiltersArgument) {
        explore {
          cases {
            aggregations(filters: $filters_1) {
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
        query: exploreCasesAggregatedProjectsBucketsQuery,
        variables: convertGeneFilter(geneId),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setSubData(
          json?.data?.explore?.cases?.aggregations?.project__project_id
            ?.buckets,
        );
      });
  };

  useEffect(() => {
    // note:
    // when row.canExpand() is false, row.original (the whole row) is undefined...
    // geneId now being passed from GenesTable state variable
    if (geneId && !opening) getGeneSubRow(geneId);
  }, [geneId, opening]);

  return (
    <>
      {!opening && firstColumn === accessor && (
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
