import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { TypeIcon } from "./TypeIcon";
import { Anchor } from "@mantine/core";

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
    <span className="flex gap-2 items-center">
      <Link href={href} passHref>
        <Anchor
          className="flex gap-1 underline font-content"
          size="sm"
          target="_blank"
        >
          <FiExternalLink className="mt-1" />
          {title}
        </Anchor>
      </Link>
      {iconText && <TypeIcon iconText={iconText} toolTipLabel={toolTipLabel} />}
    </span>
  );
};
