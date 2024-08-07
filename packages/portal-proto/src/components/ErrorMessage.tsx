import { RiErrorWarningFill as WarningIcon } from "react-icons/ri";

interface ErrorMessageProps {
  readonly message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
}: ErrorMessageProps) => (
  <span className="flex items-center mt-2 text-utility-error">
    <WarningIcon className="mr-1" size="1rem" />
    {message}
  </span>
);

export default ErrorMessage;
