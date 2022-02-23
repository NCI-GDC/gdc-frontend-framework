import React from "react";
import Image from "next/image";
import { AppRegistrationEntry } from "./utils";
import { Badge, Button, Card, Group, Loader, Tooltip } from "@mantine/core";
import { FaUserCog as OptimizeIcon } from "react-icons/fa";
import { useFilteredCohortCounts}  from "@gff/core";

export interface AnalysisCardProps  {
  entry: AppRegistrationEntry;
  readonly onClick?: (x:AppRegistrationEntry) => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ( { entry, onClick } : AnalysisCardProps) => {
  const cohortCounts = useFilteredCohortCounts();

  return (
    <Card shadow="sm" padding="sm" className="bg-white hover:bg-nci-gray-lightest">
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
            <div className="font-heading text-lg mb-2">{entry.name}</div>
            <button onClick={() => onClick(entry)}>

              {entry.iconSize ?
                <Image
                  className="m-auto"
                  src={`/user-flow/${entry.icon}`}
                  height={entry.iconSize.height} width={entry.iconSize.width}
                /> :
                <Image
                  className="m-auto"
                  src={`/user-flow/${entry.icon}`}
                  height="64" width="64"
                />
              }
            </button>

          </div>
          </Tooltip>
      </Card.Section>
      <div className="flex flex-row items-center">
        { entry.optimizeRules ? <Button compact size="xs" radius="xl" className="bg-nci-gray-light hover:bg-nci-gray border-r-lg mr-2">
          <OptimizeIcon size="1.25rem" />
        </Button> : null }
         <Badge variant="outline" size="md" className="border-nci-gray-light text-nci-gray-darker">
           {
             (cohortCounts.isSuccess) ? `${ entry.caseCounts ?
               Math.round(cohortCounts.data["caseCounts"] * entry.caseCounts).toLocaleString()
               :
               cohortCounts.data["caseCounts"].toLocaleString() } Cases` : <><Loader
               color="gray" size="xs" className="mr-2" />Cases</>
           }

         </Badge>
        { entry.hasDemo ? <Button  onClick={() => onClick({ ...entry, name: `${entry.name} Demo`, id: `${entry.id}Demo` })}
          compact size="xs"
          radius="xl"
          className="ml-2 bg-nci-gray-light hover:bg-nci-gray border-r-lg">Demo</Button> : null }
      </div>
      </Group>
    </Card>

  )
}

export default AnalysisCard;
