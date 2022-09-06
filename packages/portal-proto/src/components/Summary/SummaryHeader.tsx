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
      <div className="rounded-full flex flex-row items-center p-1 px-2">
        <TypeIcon iconText={iconText} />
      </div>
      <span className="text-2xl text-base-contrast-max">{headerTitle}</span>
    </header>
  );
};
