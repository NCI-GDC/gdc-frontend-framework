import {
  FaQuestion as InfoIcon,
  FaExclamation as WarningIcon,
  FaExclamationTriangle as ErrorIcon,
} from "react-icons/fa";
import { MdClose as CloseIcon } from "react-icons/md";
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
  INFO: <InfoIcon color="white" />,
  WARNING: <WarningIcon color="white" />,
  ERROR: <ErrorIcon color="white" />,
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
      className={`w-full p-1 flex justify-between ${backgroundColor[level]}`}
    >
      <div className="flex items-center">
        {icon[level]}
        <span className="pl-4 text-white">{message}</span>
      </div>
      {dismissible && (
        <div className="flex items-center">
          <span className="text-white pr-1">{"Dismiss"}</span>
          <CloseIcon
            color="white"
            onClick={() => dispatch(dismissNotification(id))}
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default Banner;
