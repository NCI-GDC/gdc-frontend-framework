export const SingularOrPluralSpan = ({
  count,
  title,
}: {
  count: number;
  title: string;
}): JSX.Element => {
  const updatedTitle = count === 1 ? title : `${title}s`;
  return (
    <div className="flex gap-1">
      <span className="font-bold">{count.toLocaleString()}</span>
      {updatedTitle}
    </div>
  );
};
