import { useState, useEffect } from "react";
import { animated, useSpring, config } from "react-spring";
import { GeneSubRow } from "./types";

export const convertGeneFilter = (geneId: string) => {
  return {
    op: "and",
    content: [
      {
        content: {
          field: "genes.gene_id",
          value: [geneId],
        },
        op: "in",
      },
      {
        op: "NOT",
        content: {
          field: "cases.gene.ssm.observation.observation_id",
          value: "MISSING",
        },
      },
    ],
  };
};

export const GeneAffectedCases: React.VFC<GeneSubRow> = ({
  geneId,
  spring,
  width,
  height,
}: GeneSubRow) => {
  const [subData, setSubData] = useState([]);

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
  //className={`flex flex-wrap bg-gray-200 absolute w-screen `}

  return (
    <>
      <animated.div
        className={`flex flex-wrap bg-white absolute mt-5`}
        style={horizontalSpring}
      >
        {subData.map((t, key) => {
          return (
            <>
              <ul key={`key-${key}`} className={`p-2 text-xs list-disc `}>
                <li className={`text-red-500 pr-1`}>
                  <span className={`font-medium text-black`}>{t.key}</span>:{" "}
                  <span
                    className={`text-blue-500 underline hover:cursor-pointer font-medium`}
                  >
                    {t.doc_count}
                  </span>
                  <span className={`text-black`}> / </span>
                  <span
                    className={`text-blue-500 underline hover:cursor-pointer font-medium`}
                  >
                    9999
                  </span>
                </li>
                ({(t.doc_count / 9999).toFixed(2)}%)
              </ul>
            </>
          );
        })}
      </animated.div>
      {/* relative div's height below is derived from the absolute div's height above
        this is to displace the rest of the table when in expanded state
     */}
      <animated.div style={spring}></animated.div>
    </>
  );
};

// style={verticalSpring}
//
