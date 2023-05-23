import { selectCohortCounts, useCoreSelector } from "@gff/core";

import { Divider } from "@mantine/core";
import { Button, Card, Loader, Tooltip } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import React from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdInfo,
  MdPlayArrow,
} from "react-icons/md";

import { AppRegistrationEntry } from "./utils";

export interface AnalysisCardProps {
  entry: AppRegistrationEntry;
  readonly onClick?: (x: AppRegistrationEntry, demoMode?: boolean) => void;
  readonly descriptionVisible: boolean;
  readonly setDescriptionVisible: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  entry,
  onClick,
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
      shadow="sm"
      p={6}
      className={`bg-base-max border-secondary-darkest overflow-visible border ${
        inactive ? "" : "border-t-6"
      }
       `}
      aria-label={`${entry.name} Tool`}
    >
      {/* Spacer so that the cards are the same height without setting an explicit height for the later transition */}
      {inactive && <div className="h-1" />}
      <div className="mb-1 flex justify-between">
        {entry.icon}
        <div className="flex flex-col">
          <Button
            className={`bg-secondary hover:bg-secondary-dark hover:border-secondary-dark mb-1 w-[50px] ${
              inactive ? "opacity-50" : ""
            }`}
            variant="filled"
            onClick={() => onClick(entry)}
            compact
            size="xs"
            radius="sm"
            disabled={inactive}
            aria-label={`Navigate to ${entry.name} tool`}
          >
            <MdPlayArrow size={16} color="white" />
          </Button>
          {entry.hasDemo ? (
            <Button
              onClick={() =>
                onClick(
                  {
                    ...entry,
                    name: `${entry.name}`,
                    id: `${entry.id}`,
                  },
                  true,
                )
              }
              compact
              size="xs"
              radius="sm"
              aria-label={`Navigate to ${entry.name} Demo`}
              variant="outline"
              className="text-secondary border-secondary hover:bg-secondary-dark hover:text-primary-content-max hover:border-secondary-dark w-[50px] p-0 text-xs"
            >
              Demo
            </Button>
          ) : null}
        </div>
      </div>
      <Divider variant="dotted" />
      <div className="flex flex-col items-center text-xs">
        <Button
          onClick={() => setDescriptionVisible()}
          variant="white"
          size="xs"
          rightIcon={
            descriptionVisible ? (
              <MdArrowDropUp size={16} />
            ) : (
              <MdArrowDropDown size={16} />
            )
          }
          classNames={{
            root: "text-secondary-darkest font-bold bg-transparent",
            rightIcon: "ml-0",
          }}
        >
          {entry.name}
        </Button>
        <div
          style={{ height: descriptionVisible ? descHeight : 0 }}
          className="bg-primary-lightest -mx-1.5 mb-1 overflow-hidden transition-[height] duration-300"
        >
          <div
            className={`${
              descriptionVisible ? "opacity-100" : "opacity-0"
            } transition-opacity`}
            ref={descRef}
          >
            <p className="font-content p-2">{entry.description}</p>
          </div>
        </div>
        {entry.hideCounts ? (
          <div className="h-4" />
        ) : cohortCounts ? (
          <div className="text-secondary-darkest flex items-center">
            <span>{`${caseCounts.toLocaleString()} Cases`}</span>
            {caseCounts === 0 && (
              <Tooltip
                label={entry?.noDataTooltip}
                withArrow
                width={200}
                multiline
              >
                <div>
                  <MdInfo className="ml-1 inline-block" />
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
