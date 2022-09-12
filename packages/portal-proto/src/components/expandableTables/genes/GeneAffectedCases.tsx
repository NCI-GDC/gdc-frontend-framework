import { useState, useRef, useEffect } from "react";
import { useMeasure } from "react-use";
import { GeneSubRow } from "./types";
import { get } from "lodash";

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
}: GeneSubRow) => {
  const [subData, setSubData] = useState([]);
  const [ref, { height, width }] = useMeasure();
  const [containerHeight, setContainerHeight] = useState(undefined);
  const [adjustedWidth, setAdjustedWidth] = useState("w-full");

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
    <>
      <div
        ref={ref}
        className={`flex flex-wrap bg-gray-200 absolute w-screen ${
          containerHeight ? "w-screen" : `hidden ${adjustedWidth}`
        }`}
      >
        {subData.map((t, key) => {
          return (
            <>
              <div key={`key-${key}`} className={`p-2 text-xs`}>
                <span className="font-bold">{t.key}</span>: {t.doc_count} / 9999
                ({(t.doc_count / 9999).toFixed(2)}%)
              </div>
            </>
          );
        })}
      </div>
      {/* relative div's height below is derived from the absolute div's height above
        this is to displace the rest of the table when in expanded state
     */}
      {/* update height here */}
      <div className={`relative`}></div>
    </>
  );
};
