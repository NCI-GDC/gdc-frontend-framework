import { useState, useEffect } from "react";
import { animated, useSpring, config } from "react-spring";
import { GeneSubRow } from "./types";
import ListSpring from "../shared/ListSpring";
import { convertGeneFilter } from "./genesTableUtils";

export const GeneAffectedCases: React.VFC<GeneSubRow> = ({
  geneId,
  spring,
  width,
  height,
}: GeneSubRow) => {
  const [subData, setSubData] = useState([]);
  const [loading, setLoading] = useState(true);
  const horizontalSpring = useSpring({
    from: { width: 0, opacity: 0 },
    to: { width: width, opacity: 1 },
    config: config.molasses,
  });

  const getGeneSubRow = (geneId: string) => {
    fetch("https://api.gdc.cancer.gov/v0/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
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
        `,
        variables: convertGeneFilter(geneId),
      }),
    })
      .then((res) => res.json())
      .then((json) =>
        setSubData(
          json?.data?.explore?.cases?.aggregations?.project__project_id
            ?.buckets,
        ),
      );
  };

  useEffect(() => {
    getGeneSubRow(geneId);
  }, []);

  return (
    <ListSpring
      subData={subData}
      horizontalSpring={horizontalSpring}
      verticalSpring={spring}
    />
  );
};

// style={verticalSpring}
//
