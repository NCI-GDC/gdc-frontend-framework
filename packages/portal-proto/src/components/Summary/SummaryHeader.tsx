import React, { JSX, ReactNode, useEffect, useState } from "react";
import { SummaryHeaderTitle } from "@/components/tailwindComponents";
import { Divider } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconType } from "react-icons";
import { XL_BREAKPOINT } from "src/styles/breakpoints";

export interface SummaryHeaderProps {
  Icon: IconType;
  headerTitleLeft:
    | "File"
    | "Case"
    | "Project"
    | "Gene"
    | "Mutation"
    | "Annotation";
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
  const { width } = useViewportSize();
  const [topOffset, setTopOffset] = useState("0px");
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevScrollTop, setPrevScrollTop] = useState(0);

  const isFile = headerTitleLeft === "File";
  const isProject = headerTitleLeft === "Project";
  const isSmallScreenSize = width < XL_BREAKPOINT;

  useEffect(() => {
    const globalHeader = document.querySelector("#global-header");
    const resizeObserver = new ResizeObserver((entries) => {
      setTopOffset(`${entries[0].contentRect.height}px`);
    });

    if (globalHeader) {
      resizeObserver.observe(globalHeader);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isModal || !isSmallScreenSize) return;

    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      const globalHeader = document.querySelector("#global-header");
      const globalHeaderBottom =
        globalHeader?.getBoundingClientRect().bottom || 0;

      // Only start hiding/showing behavior after scrolling past the global header's bottom
      if (currentScrollTop > globalHeaderBottom) {
        if (currentScrollTop > prevScrollTop) {
          setIsScrollingDown(true);
        } else {
          setIsScrollingDown(false);
        }
      } else {
        setIsScrollingDown(false);
      }

      setPrevScrollTop(currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollTop, isModal, isSmallScreenSize]);

  const headerClassName = (() => {
    const baseClasses =
      "bg-primary-vivid py-4 px-4 w-full flex flex-col shadow-lg gap-4 transition-transform duration-500 ease-in-out";

    const positionClasses = isModal
      ? "sticky top-0 rounded-t-sm z-320"
      : "sticky z-10";

    const transformClasses =
      !isModal && isSmallScreenSize && isScrollingDown
        ? "transform -translate-y-full"
        : "transform translate-y-0";

    return `${baseClasses} ${positionClasses} ${transformClasses}`;
  })();

  return (
    <div
      className={headerClassName}
      style={!isModal ? { top: topOffset } : undefined}
    >
      <div data-testid="text-summary-bar" className="flex gap-4">
        <div className="rounded-full w-9 h-9 bg-accent-cool-content-lighter text-primary shrink-0">
          <Icon aria-hidden focusable="false" className="w-full h-full p-1" />
        </div>
        <div
          className={`flex ${
            isFile
              ? "flex-col lg:flex-row lg:items-center lg:gap-4"
              : "flex-row items-center gap-4"
          }`}
        >
          {headerTitleLeft && (
            <div className="font-bold uppercase text-xl text-base-lightest flex items-center">
              <span>{headerTitleLeft}</span>
              <span
                className={`ml-4 text-2xl ${
                  isFile ? "hidden lg:inline" : "inline"
                }`}
              >
                &bull;
              </span>
            </div>
          )}
          <SummaryHeaderTitle $isFile={isFile}>
            {headerTitle}
          </SummaryHeaderTitle>
        </div>
      </div>
      {(leftElement || rightElement) && (
        <>
          <Divider size="sm" color="white" opacity={0.4} />
          <div
            className={`flex flex-col gap-2 ${
              isProject
                ? "xl:flex-row xl:justify-between xl:items-center"
                : "lg:flex-row lg:justify-between lg:items-center"
            }`}
          >
            {leftElement && (
              <div
                className={`order-2 ${isProject ? "xl:order-1" : "lg:order-1"}`}
              >
                {leftElement}
              </div>
            )}
            {rightElement && (
              <div
                className={`order-1 ${isProject ? "xl:order-2" : "lg:order-2"}`}
              >
                {rightElement}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
