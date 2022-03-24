import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AppRegistrationEntry } from "./utils";
import { Badge, Button, Card, Group, Loader, Tooltip } from "@mantine/core";
import { FaUserCog as OptimizeIcon } from "react-icons/fa";
import { useCoreSelector, selectCohortCounts } from "@gff/core";

export interface AnalysisCardProps  {
  entry: AppRegistrationEntry;
  readonly onClick?: (x:AppRegistrationEntry) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ( { entry, onClick } : AnalysisCardProps) => {
  const cohortCounts = useCoreSelector((state) => selectCohortCounts(state));
  return (
    <Card shadow="sm" padding="xs" className={ `bg-white hover:bg-nci-gray-lightest`} aria-label={`${entry.name} Tool`}>
      <Group position="center" direction="column">
        <Card.Section>
          <Tooltip
            label={entry.description}
            classNames={{
              wrapper: "shadow-lg",
              body: "shadow-lg bg-white text-nci-gray-darkest"
            }}
            position="right"
            placement="start"
            wrapLines
            width={220}
          >
          <div className="flex flex-col items-center">
            <div className="font-heading text-xs mb-1">{entry.name}</div>
            <button onClick={() => onClick(entry)}>
              {entry.iconSize ?
                <Image
                  className="m-auto"
                  src={`/user-flow/${entry.icon}`}
                  height={entry.iconSize.height} width={entry.iconSize.width}
                  alt={`${entry.name} icon`}
                /> :
                <Image
                  className="m-auto"
                  src={`/user-flow/${entry.icon}`}
                  height="48" width="48"
                  alt={`${entry.name} icon`}
                />
              }
            </button>

          </div>
          </Tooltip>
      </Card.Section>
      <div className="flex flex-row items-center text-xs">
        { entry.hideCounts ? null :
         <Badge variant="outline" size="sm" className="border-nci-gray-light text-nci-gray-darker">
           {
             (cohortCounts) ? `${cohortCounts["caseCounts"].toLocaleString()} Cases` :
               <span><Loader color="gray" size="xs" className="mr-2" /></span>
           }
         </Badge>
        }
        { entry.hasDemo ? <Button  onClick={() => onClick({ ...entry, name: `${entry.name} Demo`, id: `${entry.id}Demo` })}
          compact size="xs"
          radius="lg"
          className="ml-1 text-xs bg-nci-gray-lighter hover:bg-nci-gray text-nci-gray-darkest" arial-label={`${entry.name} Demo`}
        >Demo</Button> : null }
      </div>
      </Group>
    </Card>

  )
}

export default AnalysisCard;
