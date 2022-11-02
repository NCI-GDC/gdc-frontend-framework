import { useSpring } from "react-spring";
import ListSpring from "./ListSpring";

export interface SubrowProps {
  id: Record<string, string>;
  firstColumn: string;
  accessor: string;
  width: number;
  query: Function;
  subrowTitle: string;
}

export const Subrow: React.FC<SubrowProps> = ({
  id,
  firstColumn,
  accessor,
  width,
  query,
  subrowTitle,
}: SubrowProps) => {
  const horizontalSpring = useSpring({
    from: { width: width / 2, opacity: 0 },
    to: { width: width, opacity: 1 },
    immediate: true,
  });

  const { data: subData, isFetching, isSuccess } = query({ id });

  return (
    <>
      {firstColumn === accessor && isSuccess && (
        <div className={`relative`}>
          <ListSpring
            subData={subData}
            isFetching={isFetching}
            horizontalSpring={horizontalSpring}
            subrowTitle={subrowTitle}
          />
        </div>
      )}
    </>
  );
};

export default Subrow;
