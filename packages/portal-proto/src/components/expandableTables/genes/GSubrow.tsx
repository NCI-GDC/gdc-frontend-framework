import { useState, useEffect } from "react";
import { gql } from "graphql-request";
import { useSpring } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { useGetGeneTableSubrowQuery, TableSubrowData } from "@gff/core";

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

  const { data: subData } = useGetGeneTableSubrowQuery({ geneId });

  return (
    <>
      {!opening && firstColumn === accessor && subData?.length > 0 && (
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
