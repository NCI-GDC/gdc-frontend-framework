import React from "react";
import { Divider } from "@mantine/core";
import {
  MdPlayArrow,
  MdArrowDropDown,
  MdArrowDropUp,
  MdInfo,
} from "react-icons/md";
import { Button, Card, Loader, Tooltip } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useCoreSelector, selectCohortCounts } from "@gff/core";
import { AppRegistrationEntry } from "./utils";
import Link from "next/link";

export interface AnalysisCardProps {
  entry: AppRegistrationEntry;
  readonly descriptionVisible: boolean;
  readonly setDescriptionVisible: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  entry,
  descriptionVisible,
  setDescriptionVisible,
}: AnalysisCardProps) => {
  const cohortCounts = useCoreSelector((state) => selectCohortCounts(state));
  let caseCounts = cohortCounts?.[entry.countsField] || 0;

  // TODO - remove, just for demo purposes
  if (entry.name === "scRNA-Seq" || entry.name === "Gene Expression") {
    caseCounts = 0;
  }

  const inactive = caseCounts === 0;
  const { ref: descRef, height: descHeight } = useElementSize();

  return (
    <Card
      data-testid={`${entry.name}-tool`}
      p={6}
      className={`bg-base-max border-secondary-darkest overflow-visible border ${
        inactive ? "" : "border-t-6"
      }
       `}
      aria-label={`${entry.name} Tool`}
    >
      {/* Spacer so that the cards are the same height without setting an explicit height for the later transition */}
      {inactive && <div className="h-1" />}
      <div className="flex justify-between mb-1">
        {entry.icon}
        <div className="flex flex-col">
          <Link
            href={{
              pathname: "/analysis_page",
              query: { app: entry.id },
            }}
            passHref
          >
            <a
              data-testid={`button-${entry.name}`}
              className={`
                flex
                justify-center
                items-center
                bg-secondary
                hover:bg-secondary-dark
                hover:border-secondary-dark
                focus:bg-secondary-dark
                focus:border-secondary-dark
                mb-1
                w-[50px]
                ${inactive ? "opacity-50 pointer-events-none" : ""}
                rounded
                h-5
              `}
              aria-disabled={inactive}
              aria-label={entry.name}
            >
              <MdPlayArrow size={16} color="white" />
            </a>
          </Link>

          {entry.hasDemo ? (
            <Link
              href={{
                pathname: "/analysis_page",
                query: {
                  app: entry.id,
                  demoMode: true,
                },
              }}
              passHref
            >
              <a
                data-testid={`button-${entry.name} Demo`}
                className={`
                  flex
                  justify-center
                  items-center
                  hover:bg-secondary-dark
                  hover:border-secondary-dark
                  hover:text-primary-content-max
                  focus:bg-secondary-dark
                  focus:border-secondary-dark
                  focus:text-primary-content-max
                  mb-1
                  w-[50px]
                  rounded
                  h-5
                  text-xs
                  text-secondary
                  p-0
                  border
                  border-secondary
                  font-semibold
                `}
              >
                Demo
              </a>
            </Link>
          ) : null}
        </div>
      </div>
      <Divider variant="dotted" aria-hidden="true" />
      <div className="flex flex-col items-center text-xs">
        <Button
          data-testid="select-description-tool"
          onClick={() => setDescriptionVisible()}
          variant="white"
          size="xs"
          rightIcon={
            descriptionVisible ? (
              <MdArrowDropUp size={16} aria-hidden="true" />
            ) : (
              <MdArrowDropDown size={16} aria-hidden="true" />
            )
          }
          classNames={{
            root: "text-secondary-darkest font-bold bg-transparent",
            rightIcon: "ml-0",
          }}
          aria-expanded={descriptionVisible}
        >
          {entry.name}
        </Button>
        <div
          data-testid="text-description-tool"
          style={{ height: descriptionVisible ? descHeight : 0 }}
          className="transition-[height] duration-300 bg-primary-lightest overflow-hidden -mx-1.5 mb-1"
          aria-hidden={!descriptionVisible}
        >
          <div
            className={`${
              descriptionVisible ? "opacity-100" : "opacity-0"
            } transition-opacity`}
            ref={descRef}
          >
            <p className="p-2 font-content">{entry.description}</p>
          </div>
        </div>
        {entry.hideCounts ? (
          <div className="h-4" />
        ) : cohortCounts ? (
          <div
            data-testid="text-case-count-tool"
            className="flex items-center text-secondary-darkest"
          >
            {cohortCounts.status === "fulfilled" ? (
              <span>{`${caseCounts.toLocaleString()} Cases`}</span>
            ) : (
              <span className="flex mr-2 items-center">
                <Loader color="gray" size="xs" className="mr-2" /> Cases
              </span>
            )}
            {caseCounts === 0 && (
              <Tooltip
                label={entry?.noDataTooltip}
                withArrow
                width={200}
                multiline
              >
                <div>
                  <MdInfo className="inline-block ml-1" />
                </div>
              </Tooltip>
            )}
          </div>
        ) : (
          <span>
            <Loader color="gray" size="xs" className="mr-2" />
          </span>
        )}
      </div>
    </Card>
  );
};

export default AnalysisCard;
