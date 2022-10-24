import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useSpring, config } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { convertGeneFilter } from "./genesTableUtils";
import { GDC_APP_API_AUTH } from "../../../../../core/src/constants";

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
    from: { width: width / 2, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const getGeneSubRow = (geneId: string) => {
    const exploreCasesAggregatedProjectsBucketsQuery = gql`
      query getProjectDocCountsByGene(
        $filters_case: FiltersArgument
        $filters_gene: FiltersArgument
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
            numerators: aggregations(filters: $filters_gene) {
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
        // todo: refactor
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
    if (geneId && !opening) getGeneSubRow(geneId);
  }, [geneId, opening]);

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

export default GSubrow;
