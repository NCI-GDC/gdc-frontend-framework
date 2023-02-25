import { AccessType } from "@gff/core";
import { Badge } from "@mantine/core";

export const FileAccessBadge = ({
  access,
}: {
  access: AccessType;
}): JSX.Element => (
  <Badge
    className={`capitalize text-xs font-bold
      ${
        access === "open" //TODO: keep or change to theme color (used same for the repository file table)
          ? "bg-accent-cool-light text-accent-cool-dark bg-opacity-15"
          : "bg-nci-red-lighter/50 text-nci-red-darkest"
      }
    `}
    data-testid="badgeElement"
  >
    {access}
  </Badge>
);
