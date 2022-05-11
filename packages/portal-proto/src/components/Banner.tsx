import {
  FaQuestion as InfoIcon,
  FaExclamation as WarningIcon,
  FaExclamationTriangle as ErrorIcon,
} from "react-icons/fa";
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
  INFO: <InfoIcon color="white" title="Info icon." />,
  WARNING: <WarningIcon color="white" title="Warning icon." />,
  ERROR: <ErrorIcon color="white" title="Error icon." />,
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
    >
      <div className="flex items-center">
        {icon[level]}
        <span className="pl-4 text-white">
          <Markdown
            components={{
              // eslint-disable-next-line react/prop-types
              a: ({ children, ...props }) => (
                <a className="underline" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {message}
          </Markdown>
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
