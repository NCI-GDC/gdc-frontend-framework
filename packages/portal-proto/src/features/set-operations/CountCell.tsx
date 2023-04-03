import { useGeneSetCountQuery, useSsmSetCountQuery } from "@gff/core";

export const GeneCountCell = ({ setId }: { setId: string }): JSX.Element => {
  const { data, isSuccess } = useGeneSetCountQuery({ setId });
  return isSuccess ? data.toLocaleString() : "...";
};

export const MutationCountCell = ({
  setId,
}: {
  setId: string;
}): JSX.Element => {
  const { data, isSuccess } = useSsmSetCountQuery({ setId });
  return isSuccess ? data.toLocaleString() : "...";
};
