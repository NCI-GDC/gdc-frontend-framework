export const SingularOrPluralSpan = ({
  count,
  title,
}: {
  count: number;
  title: string;
}) => {
  const updatedTitle = count > 1 ? `${title}s` : title;
  return (
    <span>
      {count.toLocaleString()} {updatedTitle}
    </span>
  );
};
