export const SingularOrPluralSpan = ({
  count,
  title,
  customDataTestID,
}: {
  count: number;
  title: string;
  customDataTestID?: string;
}): JSX.Element => {
  const updatedTitle = count === 1 ? title : `${title}s`;
  return (
    <div className="flex gap-1">
      <span data-testid={customDataTestID} className="font-bold">
        {count.toLocaleString()}
      </span>
      {updatedTitle}
    </div>
  );
};
