import {
  FaQuestion as InfoIcon,
  FaExclamation as WarningIcon,
  FaExclamationTriangle as ErrorIcon,
} from "react-icons/fa";
import { MdClose as CloseIcon } from "react-icons/md";
import Markdown from "react-markdown";
import { CloseButton } from "@mantine/core";
import { dismissNotification, useCoreDispatch } from "@gff/core";

interface BannerProps {
  readonly message: string;
  readonly level: "INFO" | "WARNING" | "ERROR";
  readonly dismissible: boolean;
  readonly id: string;
}

const backgroundColor = {
  INFO: "bg-nci-blue-darker",
  WARNING: "bg-nci-yellow-darker",
  ERROR: "bg-nci-red-darker",
};

const icon = {
  INFO: <InfoIcon color="white" title="Info. Icon." />,
  WARNING: <WarningIcon color="white" title="Warning. Icon." />,
  ERROR: <ErrorIcon color="white" title="Error. Icon." />,
};

const Banner: React.FC<BannerProps> = ({
  message,
  level,
  dismissible,
  id,
}: BannerProps) => {
  const dispatch = useCoreDispatch();

  return (
    <div
      className={`w-full p-1 flex justify-between border-solid border-y-1 border-gdc-gray-lighter ${backgroundColor[level]}`}
      tabIndex={0}
    >
      <div className="flex items-center">
        {icon[level]}
        <span className="pl-4 text-white">
          <Markdown
            children={message}
            components={{
              a: ({ node, ...props }) => <a className="underline" {...props} />,
            }}
          />
        </span>
      </div>
      {dismissible && (
        <div className="flex items-center pl-1">
          <span className="text-white pr-1" id={`banner-dismiss-${id}`}>
            {"Dismiss"}
          </span>
          <CloseButton
            color="white"
            variant="transparent"
            onClick={() => dispatch(dismissNotification(id))}
            aria-labelledby={`banner-dismiss-${id}`}
          />
        </div>
      )}
    </div>
  );
};

export default Banner;
