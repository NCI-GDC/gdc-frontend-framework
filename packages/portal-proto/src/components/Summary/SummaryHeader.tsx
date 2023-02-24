import { HeaderTitle } from "@/features/shared/tailwindComponents";
import { TypeIcon } from "../TypeIcon";

export interface SummaryHeaderProps {
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
      <HeaderTitle>{headerTitle}</HeaderTitle>
    </header>
  );
};
