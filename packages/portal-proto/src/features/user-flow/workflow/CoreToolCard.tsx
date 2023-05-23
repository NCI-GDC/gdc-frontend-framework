import { ActionIcon, Grid, Text } from "@mantine/core";
import { MdPlayArrow } from "react-icons/md";

import { AppRegistrationEntry } from "./utils";

export interface CoreToolCardProps {
  entry: AppRegistrationEntry;
  readonly onClick?: (x: AppRegistrationEntry) => void;
}

const CoreToolCard: React.FC<CoreToolCardProps> = ({
  entry,
  onClick,
}: CoreToolCardProps) => {
  return (
    <Grid className="border-secondary-darkest m-0 h-full rounded-md border p-0">
      <Grid.Col span={2} className="self-center">
        {entry.icon}
      </Grid.Col>
      <Grid.Col span={8} className="text-base-content-darkest">
        <Text size="sm" className="font-heading font-bold">
          {entry.name}
        </Text>
        <Text size="xs" className="font-content">
          {entry.description}
        </Text>
      </Grid.Col>
      <Grid.Col
        span={2}
        style={{ minHeight: "6rem" }}
        className="m-0 flex flex-row justify-end p-0"
      >
        <ActionIcon
          className="bg-secondary hover:bg-secondary-darker h-[6em] w-12 justify-self-end rounded-none rounded-r p-0"
          variant="filled"
          onClick={() => onClick(entry)}
          aria-label={`Navigate to ${entry.name}`}
        >
          <MdPlayArrow size={30} color="white" />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
};

export default CoreToolCard;
