import React from "react";
import Image from "next/image";
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

export interface AnalysisCardProps {
  entry: AppRegistrationEntry;
  readonly onClick?: (x: AppRegistrationEntry) => void;
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
  let caseCounts = cohortCounts?.caseCounts || 0;

  // TODO - remove, just for demo purposes
  if (entry.name === "scRNA-Seq" || entry.name === "Gene Expression") {
    caseCounts = 0;
  }

  const inactive = caseCounts === 0;
  const { ref: descRef, height: descHeight } = useElementSize();

  return (
    <Card
      shadow="sm"
      p="xs"
      className={`border-nci-blue-darkest border ${inactive ? "" : "border-t-6"}
       `}
      aria-label={`${entry.name} Tool`}
    >
      {/* Spacer so that the cards are the same height without setting an explicit height for the later transition */}
      {inactive && <div className="h-1" />}
      <div className="flex justify-between mb-1">
        {entry.iconSize ? (
          <Image
            className="m-auto"
            src={`/user-flow/${entry.icon}`}
            height={entry.iconSize.height}
            width={entry.iconSize.width}
            alt={`${entry.name} icon`}
          />
        ) : (
          <Image
            className="m-auto"
            src={`/user-flow/${entry.icon}`}
            height="48"
            width="48"
            alt={`${entry.name} icon`}
          />
        )}
        <div className="flex flex-col">
          <Button
            className={`bg-nci-blue-darkest hover:bg-nci-blue hover:border-nci-blue mb-1 w-[50px] ${
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
            <MdPlayArrow size={16} color={"white"} />
          </Button>
          {entry.hasDemo ? (
            <Button
              onClick={() =>
                onClick({
                  ...entry,
                  name: `${entry.name} Demo`,
                  id: `${entry.id}Demo`,
                })
              }
              compact
              size="xs"
              radius="sm"
              aria-label={`Navigate to ${entry.name} Demo`}
              variant={"outline"}
              className="text-nci-blue-darkest border-nci-blue-darkest hover:bg-nci-blue hover:text-white hover:border-nci-blue w-[50px]"
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
            root: "text-nci-blue-darkest font-bold",
            rightIcon: "ml-0",
          }}
        >
          {entry.name}
        </Button>
        <div
          style={{ height: descriptionVisible ? descHeight : 0 }}
          className={`transition-[height] duration-300 bg-nci-blue-lightest -mx-2.5 mb-2.5`}
        >
          <div
            className={`${
              descriptionVisible ? "opacity-100" : "opacity-0"
            } transition-opacity`}
            ref={descRef}
          >
            <p className="p-2">{entry.description}</p>
          </div>
        </div>
        {entry.hideCounts ? (
          <div className="h-4" />
        ) : cohortCounts ? (
          <div className="text-nci-blue-darkest">
            <span>{`${caseCounts.toLocaleString()} Cases`}</span>
            {caseCounts === 0 && (
              <Tooltip label={entry?.noDataTooltip} withArrow width={200}>
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
