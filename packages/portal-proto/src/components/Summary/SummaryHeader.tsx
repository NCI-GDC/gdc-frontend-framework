import { TypeIcon } from "../TypeIcon";

interface SummaryHeaderProps {
  iconText: string;
  headerTitle: string | number;
}
export const SummaryHeader = ({
  iconText,
  headerTitle,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <div className="bg-base-lightest py-3 pl-24 shadow-lg">
      <TypeIcon iconText={iconText} />
      <span className="text-2xl text-primary-darker">{headerTitle}</span>
    </div>
  );
};
