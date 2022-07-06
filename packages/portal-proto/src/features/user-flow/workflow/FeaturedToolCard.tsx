import Image from "next/image";
import { ActionIcon, Grid } from "@mantine/core";
import { MdPlayArrow } from "react-icons/md";
import { AppRegistrationEntry } from "./utils";

export interface FeaturedToolCardProps {
  entry: AppRegistrationEntry;
  readonly onClick?: (x: AppRegistrationEntry) => void;
}

const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({
  entry,
  onClick,
}: FeaturedToolCardProps) => {
  return (
    <Grid className="bg-white h-full items-center m-1 rounded">
      <Grid.Col span={2}>
        <Image
          className="m-auto"
          src={`/user-flow/${entry.icon}`}
          height="64"
          width="64"
          alt={`${entry.name} icon`}
        />
      </Grid.Col>
      <Grid.Col span={8} className="text-nci-blue-darkest">
        <h3 className="font-bold">{entry.name}</h3>
        {entry.description}
      </Grid.Col>
      <Grid.Col span={2}>
        <ActionIcon
          className="self-center bg-nci-blue-darkest w-12 h-12 p-2 hover:bg-nci-blue"
          variant="filled"
          onClick={() => onClick(entry)}
          aria-label={`Navigate to ${entry.name}`}
        >
          <MdPlayArrow size={30} color={"white"} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
};

export default FeaturedToolCard;
