import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useSpring, config } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { convertGeneFilter } from "./genesTableUtils";
import { GDC_APP_API_AUTH } from "@gff/core/src/constants";

export interface GeneSubrowProps {
  geneId: string;
  firstColumn: string;
  accessor: string;
  width: number;
  opening: boolean;
}

export const GSubrow: React.FC<GeneSubrowProps> = ({
  geneId,
  firstColumn,
  accessor,
  width,
  opening,
}: GeneSubrowProps) => {
  const [subData, setSubData] = useState([]);

  const horizontalSpring = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: width, opacity: 1 },
    config: config.slow,
  });

  const getGeneSubRow = (geneId: string) => {
    const exploreCasesAggregatedProjectsBucketsQuery = gql`
      query getProjectDocCountsByGene($filters_gene: FiltersArgument) {
        explore {
          cases {
            aggregations(filters: $filters_gene) {
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
        const { buckets } =
          json?.data?.explore?.cases?.aggregations?.project__project_id || [];
        setSubData(buckets);
      });
  };

  useEffect(() => {
    // when row.canExpand() is false, row.original (the whole row) is undefined
    // geneId state variable set in Genes Table set when row expand btn clicked
    if (geneId && !opening) getGeneSubRow(geneId);
  }, [geneId, opening]);

  return (
    <>
      {!opening && firstColumn === accessor && subData.length && (
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
