import { Grid, Text } from "@mantine/core";
import { MdPlayArrow } from "react-icons/md";
import { AppRegistrationEntry } from "./utils";
import Link from "next/link";

export interface CoreToolCardProps {
  entry: AppRegistrationEntry;
}

const CoreToolCard: React.FC<CoreToolCardProps> = ({
  entry,
}: CoreToolCardProps) => {
  return (
    <Link
      href={{
        pathname: "/analysis_page",
        query: { app: entry.id },
      }}
      passHref
    >
      <a className="group">
        <Grid className="border-secondary-darkest border h-full m-0 rounded-md p-0">
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
            className="flex flex-row justify-end p-0 m-0"
          >
            <div className="justify-self-end bg-secondary w-12 h-[6em] p-0 group-hover:bg-secondary-darker group-focus:bg-secondary-darker rounded-none rounded-r flex justify-center items-center">
              <MdPlayArrow size={30} color="white" />
            </div>
          </Grid.Col>
        </Grid>
      </a>
    </Link>
  );
};

export default CoreToolCard;
