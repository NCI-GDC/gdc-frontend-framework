import { SummaryHeaderTitle } from "@/components/tailwindComponents";
import { Divider } from "@mantine/core";
import { ReactNode } from "react";

export interface SummaryHeaderProps {
  iconText: string;
  headerTitle: string | number;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isModal?: boolean;
  isFile?: boolean;
}
export const SummaryHeader = ({
  iconText,
  headerTitle,
  leftElement,
  rightElement,
  isModal = false,
  isFile = false,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header
      className={`bg-primary-vivid py-4 px-4 w-full flex flex-col shadow-lg gap-4 ${
        isModal ? "sticky top-0 rounded-t-sm z-20" : "fixed z-10"
      }`}
    >
      <div className="flex flex-nowrap items-center gap-4">
        <SummaryHeaderIcon iconText={iconText} />
        <SummaryHeaderTitle $isFileSummary={isFile}>
          {headerTitle}
        </SummaryHeaderTitle>
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
