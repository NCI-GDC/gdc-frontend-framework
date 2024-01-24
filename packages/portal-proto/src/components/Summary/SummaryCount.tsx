import Link from "next/link";
import { IconType } from "react-icons";

export interface SummaryCountProps {
  readonly title: string;
  readonly count: string;
  readonly Icon: IconType;
  href?: string;
  shouldOpenInNewTab?: boolean;
}

/**
 * Summary Component for displaying summery data with icon and possible click event
 */
const SummaryCount = ({
  title,
  count,
  Icon,
  href,
  shouldOpenInNewTab,
}: SummaryCountProps): JSX.Element => {
  const addLinkValue = () => (
    <>
      {href ? (
        <Link
          href={href}
          passHref
          className="text-utility-link underline"
          target={shouldOpenInNewTab ? "_blank" : undefined}
        >
          {count}
        </Link>
      ) : (
        count
      )}
    </>
  );

  return (
    <div className="bg-base-lightest p-2 mb-4 flex items-center max-w-xs">
      <div className="flex-auto">
        <div className="uppercase tracking-tight text-xs">{title}</div>
        <div className="text-xl">{addLinkValue()}</div>
      </div>
      <div className="flex-none text-4xl" aria-hidden="true">
        <Icon color="primary" />
      </div>
    </div>
  );
};

export default SummaryCount;
