import { SummaryHeaderTitle } from "@/components/tailwindComponents";
import { Divider } from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import { IconType } from "react-icons";

export interface SummaryHeaderProps {
  Icon?: IconType;
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
  const [topOffset, setTopOffset] = useState("0px");

  useEffect(() => {
    const updateTopOffset = () => {
      const globalHeader = document.querySelector("#global-header");
      if (globalHeader) {
        const rect = globalHeader.getBoundingClientRect();
        setTopOffset(`${rect.height}px`);
      }
    };

    updateTopOffset();

    window.addEventListener("resize", updateTopOffset);

    return () => {
      window.removeEventListener("resize", updateTopOffset);
    };
  }, []);

  return (
    <div
      className={`bg-primary-vivid py-4 px-4 w-full flex flex-col shadow-lg gap-4 ${
        isModal ? "sticky top-0 rounded-t-sm z-20" : "sticky z-10"
      }`}
      style={!isModal ? { top: topOffset } : undefined}
    >
      <div data-testid="text-summary-bar" className="flex gap-4">
        <div className="rounded-full w-9 h-9 bg-accent-cool-content-lighter text-primary flex-shrink-0">
          <Icon aria-hidden focusable="false" className="w-full h-full p-1" />
        </div>
        {/* issue when headerTitle breaks into the next line (1024 -> 1280) */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4">
          {headerTitleLeft && (
            <div className="font-bold uppercase text-xl text-base-lightest flex items-center">
              <span>{headerTitleLeft}</span>
              <span className="hidden lg:inline ml-4 text-2xl">&bull;</span>
            </div>
          )}
          <SummaryHeaderTitle>{headerTitle}</SummaryHeaderTitle>
        </div>
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
    </div>
  );
};
