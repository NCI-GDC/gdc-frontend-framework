import { AccessType } from "@gff/core";
import { Badge } from "@mantine/core";

export const FileAccessBadge = ({
  access,
}: {
  access: AccessType;
}): JSX.Element => (
  <Badge
    className={
      access === "open" //TODO: keep or change to theme color (used same for the repository file table)
        ? "bg-nci-green-lighter/50 text-nci-green-darkest capitalize text-sm"
        : "bg-nci-red-lighter/50 text-nci-red-darkest capitalize text-sm"
    }
    data-testid="badgeElement"
  >
    {access}
  </Badge>
);
