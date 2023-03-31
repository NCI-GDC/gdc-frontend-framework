import { ActionIcon, Grid, Text } from "@mantine/core";
import { Image } from "@/components/Image";
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
    <Grid className="border-secondary-darkest border h-full items-center m-0 rounded-md p-0">
      <Grid.Col span={2}>
        <Image
          className="m-auto"
          src={`/user-flow/${entry.icon}`}
          height="64"
          width="64"
          alt={`${entry.name} icon`}
        />
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
        className="flex flex-row justify-end p-0 m-0"
      >
        <ActionIcon
          className="justify-self-end bg-secondary w-12 h-[6em] p-0 hover:bg-secondary-darker rounded-none rounded-r"
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
