import { SummaryHeaderTitle } from "@/features/shared/tailwindComponents";

export interface SummaryHeaderProps {
  iconText: string;
  headerTitle: string | number;
}
export const SummaryHeader = ({
  iconText,
  headerTitle,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header className="fixed bg-primary-vivid py-4 pl-24 z-10 w-full flex flex-row nowrap items-center shadow-lg gap-4">
      <SummaryHeaderIcon iconText={iconText} />
      <SummaryHeaderTitle>{headerTitle}</SummaryHeaderTitle>
    </header>
  );
};

export const SummaryHeaderIcon = ({
  iconText,
}: {
  iconText: string;
}): JSX.Element => (
  <span className="w-9 h-9 uppercase rounded-full text-lg flex justify-center items-center leading-[22px] font-bold bg-base-lightest text-primary">
    {iconText}
  </span>
);
