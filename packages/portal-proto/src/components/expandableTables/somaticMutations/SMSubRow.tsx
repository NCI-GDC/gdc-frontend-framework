import { useSpring } from "react-spring";
import ListSpring from "../shared/ListSpring";
import { useGetSomaticMutationTableSubrowQuery } from "@gff/core";

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
  const horizontalSpring = useSpring({
    from: { width: width / 2, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const {
    data: subData,
    isFetching,
    isSuccess,
  } = useGetSomaticMutationTableSubrowQuery({ mutationId });

  return (
    <>
      {!opening && firstColumn === accessor && !isFetching && isSuccess && (
        <div className={`relative`}>
          <ListSpring
            subData={subData}
            horizontalSpring={horizontalSpring}
            isFetching={isFetching}
            subrowTitle={`Affected Cases Across The GDC`}
          />
        </div>
      )}
    </>
  );
};
