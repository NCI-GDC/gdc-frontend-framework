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
    <header className="fixed bg-base-max py-3 pl-24 z-10 w-full flex flex-row nowrap items-center shadow-lg">
      <TypeIcon className="rounded-lg" iconText={iconText} />
      <span className="text-2xl text-primary-darker">{headerTitle}</span>
    </header>
  );
};
