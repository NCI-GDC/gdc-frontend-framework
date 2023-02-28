import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";

interface WarningMessageProps {
  readonly message: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({
  message,
}: WarningMessageProps) => (
  <span className="flex items-center mt-2 text-[#976F21] text-sm">
    <WarningIcon className="mr-1 " />
    {message}
  </span>
);

export default WarningMessage;
