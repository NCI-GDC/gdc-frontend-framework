import {
  FaQuestion as InfoIcon,
  FaExclamation as WarningIcon,
  FaExclamationTriangle as ErrorIcon,
} from "react-icons/fa";
import Markdown from "react-markdown";
import { Button } from "@mantine/core";
import { MdClose } from "react-icons/md";
import { dismissNotification, useCoreDispatch } from "@gff/core";

interface BannerProps {
  readonly message: string;
  readonly level: "INFO" | "WARNING" | "ERROR";
  readonly dismissible: boolean;
  readonly id: number;
}

const backgroundColor = {
  INFO: "bg-utility-info",
  WARNING: "bg-utility-warning",
  ERROR: "bg-utility-error",
};

const textColor = {
  INFO: "text-utility-contrast-info",
  WARNING: "text-utility-contrast-warning",
  ERROR: "text-utility-contrast-error",
};

const icon = {
  INFO: <InfoIcon className="text-utility-contrast-info" title="Info icon." />,
  WARNING: (
    <WarningIcon
      className="text-utility-contrast-warning"
      title="Warning icon."
    />
  ),
  ERROR: (
    <ErrorIcon className="text-utility-contrast-error" title="Error icon." />
  ),
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
      className={`w-full p-1 flex justify-between border-solid border-y-1 border-primary-content-lighter text-sm ${backgroundColor[level]} font-content`}
    >
      <div className="flex items-center pl-4 ">
        {icon[level]}
        <span className={`pl-4 ${textColor[level]}`}>
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
          <Button
            onClick={() => dispatch(dismissNotification(id))}
            rightIcon={
              <MdClose className={`${textColor[level]}`} aria-hidden="true" />
            }
            styles={{
              root: {
                background: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            }}
          >
            <div className={`${textColor[level]}`}>Dismiss</div>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Banner;
