import { WarningIconMessage } from "@/utils/icons";

interface WarningMessageProps {
  readonly message: string;
}

const WarningMessage: React.FC<WarningMessageProps> = ({
  message,
}: WarningMessageProps) => (
  <span className="flex items-center mt-2 text-warningColorText text-sm">
    <WarningIconMessage className="mr-1 text-warningColor" />
    {message}
  </span>
);

export default WarningMessage;
