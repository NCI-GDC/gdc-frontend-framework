import { AccessType } from "@gff/core";
import { Badge } from "@mantine/core";

export const FileAccessBadge = ({
  access,
}: {
  access: AccessType;
}): JSX.Element => (
  <Badge
    className={`w-full max-w-[8em] capitalize text-xs font-bold font-content
      ${
        access === "open" //TODO: keep or change to theme color (used same for the repository file table)
          ? "bg-nci-green-lighter/50 text-nci-green-darkest"
          : "bg-nci-red-lighter/50 text-nci-red-darkest"
      }
    `}
    data-testid="badgeElement"
  >
    {access}
  </Badge>
);
