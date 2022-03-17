import { PropsWithChildren } from "react";
import { Badge } from "@mantine/core";

export const CustomBadge: React.FC = ({
    children,
  } : PropsWithChildren<unknown>) => (
    <div className="absolute -top-2 -left-2">
        <Badge>{children}</Badge>
    </div>
);