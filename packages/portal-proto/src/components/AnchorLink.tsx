import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";
import { TypeIcon } from "./TypeIcon";

export const AnchorLink = ({
  href,
  title,
  iconText,
  toolTipLabel,
  customDataTestID,
  customStyle = "",
}: {
  href: string;
  title: string;
  iconText?: string;
  customDataTestID?: string;
  toolTipLabel?: string;
  customStyle?: string;
}): JSX.Element => {
  return (
    <span className={`flex gap-2 items-center ${customStyle}`}>
      <Link
        href={href}
        target="_blank"
        className="flex gap-1 underline font-content"
        data-testid={customDataTestID}
      >
        <>
          <FiExternalLink className="mt-1" />
          {title}
        </>
      </Link>
      {iconText && <TypeIcon iconText={iconText} toolTipLabel={toolTipLabel} />}
    </span>
  );
};
