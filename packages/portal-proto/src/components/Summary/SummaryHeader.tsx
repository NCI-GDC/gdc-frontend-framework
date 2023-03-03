import { SummaryHeaderTitle } from "@/features/shared/tailwindComponents";
import { Divider } from "@mantine/core";
import { ReactNode } from "react";
import { theme } from "tailwind.config";

export interface SummaryHeaderProps {
  iconText: string;
  headerTitle: string | number;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}
export const SummaryHeader = ({
  iconText,
  headerTitle,
  leftElement,
  rightElement,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header className="fixed bg-primary-vivid py-4 px-4 z-10 w-full flex flex-col shadow-lg gap-4">
      <div className="flex flex-row nowrap items-center gap-4">
        <SummaryHeaderIcon iconText={iconText} />
        <SummaryHeaderTitle>{headerTitle}</SummaryHeaderTitle>
      </div>
      {(leftElement || rightElement) && (
        <>
          <Divider size="md" color="white" opacity={0.4} />
          <div className="flex justify-between">
            <>{leftElement && leftElement}</>
            <>{rightElement && rightElement}</>
          </div>
        </>
      )}
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
