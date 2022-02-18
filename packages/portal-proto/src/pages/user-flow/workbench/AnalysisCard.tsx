import React from "react";
import Image from "next/image";
import { AppRegistrationEntry } from "./utils"
import { Button, Card, Group, Badge } from '@mantine/core';

export interface AnalysisCardProps extends AppRegistrationEntry {
  applicable: boolean;
  readonly onClick?: (x) => void;
}

const AnalysisCard : React.FC<AnalysisCardProps> = ( entry: AnalysisCardProps ) => {
  return (
    <Card shadow="sm" padding="md">
      <Group position="center" direction="column">
      <Card.Section>
      <div className="font-heading text-lg mb-2">{entry.name}</div>
      <button onClick={() => entry.onClick(entry)} >
        <div className="flex flex-row items-center">
            <Image
              className="m-auto"
              src={`/user-flow/${entry.icon}`}
              height="64" width="64"
            />
        </div>
      </button>
      </Card.Section>
      <div className="flex-auto">
         <Badge  size="sm"># Cases</Badge>
        { entry.hasDemo ? <Button  compact size="xs" radius="xl" className="ml-2 bg-nci-gray-light hover:bg-nci-gray border-r-lg">Demo</Button> : null }
      </div>
      </Group>
    </Card>

  )
}

export default AnalysisCard;
