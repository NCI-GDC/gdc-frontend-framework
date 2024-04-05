import { SummaryHeaderTitle } from "@/components/tailwindComponents";
import { Divider } from "@mantine/core";
import { ReactNode } from "react";

export interface SummaryHeaderProps {
  Icon?: any;
  headerTitleLeft?: string;
  headerTitle: string | number;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isModal?: boolean;
}
export const SummaryHeader = ({
  Icon,
  headerTitleLeft,
  headerTitle,
  leftElement,
  rightElement,
  isModal = false,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header
      className={`bg-primary-vivid py-4 px-4 w-full flex flex-col shadow-lg gap-4 ${
        isModal ? "sticky top-0 rounded-t-sm z-20" : "fixed z-10"
      }`}
    >
      <div
        data-testid="text-summary-bar"
        className="flex flex-nowrap items-center gap-2"
       >
        <div className="rounded-full bg-accent-cool-content-lighter">
          <Icon
            className="w-10 h-10 text-primary p-1.5"
            aria-hidden
            focusable="false"
          />
        </div>
        <SummaryHeaderTitle>
          {headerTitleLeft && (
            <span className="font-bold uppercase">
              {headerTitleLeft} &bull;{" "}
            </span>
          )}
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
