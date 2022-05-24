import Image from "next/image";
import { ActionIcon } from "@mantine/core";
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
    <div className="bg-white flex p-2 h-full">
      <Image
        className="m-auto"
        src={`/user-flow/${entry.icon}`}
        height="64"
        width="64"
        alt={`${entry.name} icon`}
      />
      <div className="m-1">
        <h3 className="font-bold">{entry.name}</h3>
        {entry.description}
      </div>
      <ActionIcon
        styles={{
          root: {
            backgroundColor:
              tailwindConfig.theme.extend.colors["nci-blue"].darkest,
          },
        }}
        className="self-center"
        variant="filled"
        onClick={() => onClick(entry)}
      >
        <MdArrowForwardIos size={30} color={"white"} />
      </ActionIcon>
    </div>
  );
};

export default FeaturedToolCard;
