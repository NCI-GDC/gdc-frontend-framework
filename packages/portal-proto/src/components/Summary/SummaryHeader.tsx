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
    <div className="bg-white py-4 px-8 shadow-lg">
      <TypeIcon iconText={iconText} />
      <span className="text-2xl text-nci-blue-darker">{headerTitle}</span>
    </div>
  );
};
