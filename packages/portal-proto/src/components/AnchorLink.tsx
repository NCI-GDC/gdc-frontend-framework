import { Anchor } from "@mantine/core";
import { FiExternalLink } from "react-icons/fi";
import { TypeIcon } from "./TypeIcon";

export const AnchorLink = ({
  href,
  title,
  iconText,
  toolTipLabel,
}: {
  href: string;
  title: string;
  iconText?: string;
  toolTipLabel?: string;
}): JSX.Element => {
  return (
    <Anchor
      href={href}
      target="_blank"
      className="flex gap-1 underline"
      size="sm"
    >
      <FiExternalLink className="mt-1" />
      {title}
      {iconText && <TypeIcon iconText={iconText} toolTipLabel={toolTipLabel} />}
    </Anchor>
  );
};
