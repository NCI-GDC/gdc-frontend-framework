import React, { useState } from "react";
import Image from "next/image";
import { Divider } from "@mantine/core";
import {
  MdPlayArrow,
  MdArrowDropDown,
  MdArrowDropUp,
  MdInfo,
} from "react-icons/md";
import { Button, Card, Loader, Tooltip, Collapse } from "@mantine/core";
import { useCoreSelector, selectCohortCounts } from "@gff/core";
import { AppRegistrationEntry } from "./utils";

export interface AnalysisCardProps {
  entry: AppRegistrationEntry;
  readonly onClick?: (x: AppRegistrationEntry) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  entry,
  onClick,
}: AnalysisCardProps) => {
  const cohortCounts = useCoreSelector((state) => selectCohortCounts(state));
  let caseCounts = cohortCounts?.caseCounts || 0;
  const [descriptionVisisble, setDescriptionVisible] = useState(false);

  // TODO - remove, just for demo purposes
  if (entry.name === "scRNA-Seq" || entry.name === "Gene Expression") {
    caseCounts = 0;
  }

  return (
    <Card
      shadow="sm"
      p="xs"
      className="border-nci-blue-darkest border-2 border-t-6 h-full"
      aria-label={`${entry.name} Tool`}
    >
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
            className={`bg-nci-blue-darkest mb-1 w-12 ${
              caseCounts === 0 ? "opacity-50" : ""
            }`}
            variant="filled"
            onClick={() => onClick(entry)}
            compact
            size="xs"
            radius="sm"
            disabled={caseCounts === 0}
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
              className="text-nci-blue-darkest border-nci-blue-darkest"
            >
              Demo
            </Button>
          ) : null}
        </div>
      </div>
      <Divider variant="dotted" />
      <div className="flex flex-col items-center text-xs">
        <Button
          onClick={() => setDescriptionVisible(!descriptionVisisble)}
          variant="white"
          size="xs"
          rightIcon={
            descriptionVisisble ? (
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
        <Collapse
          in={descriptionVisisble}
          className="bg-nci-blue-lightest -mx-2.5 mb-2.5 p-2"
        >
          {entry.description}
        </Collapse>
        {entry.hideCounts ? null : cohortCounts ? (
          <div className="text-nci-blue-darkest">
            <span>{`${caseCounts.toLocaleString()} Cases`}</span>
            {caseCounts === 0 && (
              <Tooltip
                label={entry?.noDataTooltip}
                withArrow
                wrapLines
                width={200}
              >
                {" "}
                <MdInfo className="inline-block ml-1" />{" "}
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
