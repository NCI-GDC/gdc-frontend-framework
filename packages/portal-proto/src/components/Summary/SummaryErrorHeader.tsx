export const SummaryErrorHeader = ({
  label,
}: {
  label: string;
}): JSX.Element => (
  <div className="p-4 text-primary-content">
    <div className="flex-auto bg-base-lightest mr-4">
      <h2 className="p-2 text-2xl mx-4">{label}</h2>
    </div>
  </div>
);
