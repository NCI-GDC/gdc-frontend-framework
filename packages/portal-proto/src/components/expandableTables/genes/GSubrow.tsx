import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useSpring } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { useGetGeneTableSubrowQuery } from "@gff/core";

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
  const horizontalSpring = useSpring({
    from: { width: width / 2, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const {
    data: subData,
    isFetching,
    isSuccess,
  } = useGetGeneTableSubrowQuery({ geneId });

  return (
    <>
      {!opening && firstColumn === accessor && isSuccess && (
        <div className={`relative`}>
          <ListSpring
            subData={subData}
            isFetching={isFetching}
            horizontalSpring={horizontalSpring}
            subrowTitle={`# SSMS Affected Cases Across The GDC`}
          />
        </div>
      )}
    </>
  );
};

export default GSubrow;
