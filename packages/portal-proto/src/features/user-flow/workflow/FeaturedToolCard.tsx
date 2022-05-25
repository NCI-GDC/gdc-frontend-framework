import Image from "next/image";
import { ActionIcon, Grid } from "@mantine/core";
import { MdArrowForwardIos } from "react-icons/md";
import * as tailwindConfig from "tailwind.config";
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
    <Grid className="bg-white h-full items-center m-1" gutter="lg">
      <Grid.Col span={2}>
        <Image
          className="m-auto"
          src={`/user-flow/${entry.icon}`}
          height="64"
          width="64"
          alt={`${entry.name} icon`}
        />
      </Grid.Col>
      <Grid.Col span={8}>
        <h3 className="font-bold">{entry.name}</h3>
        {entry.description}
      </Grid.Col>
      <Grid.Col span={2}>
        <ActionIcon
          className="self-center bg-nci-blue-darkest w-12 h-12 p-2"
          variant="filled"
          onClick={() => onClick(entry)}
        >
          <MdArrowForwardIos size={30} color={"white"} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
};

export default FeaturedToolCard;
