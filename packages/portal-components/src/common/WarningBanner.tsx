import React, { ReactNode } from "react";
import { ActionIcon } from "@mantine/core";
import { AlertIcon, CloseIcon } from "src/commonIcons";

interface WarningBannerProps {
  readonly text: ReactNode;
  readonly dismissBanner?: () => void;
}

const WarningBanner: React.FC<WarningBannerProps> = ({
  text,
  dismissBanner,
}) => (
  <div className="flex h-12 border border-warningColor rounded-none">
    <div className="flex h-full w-12 bg-warningColor justify-center items-center">
      <AlertIcon color="white" className="h-6 w-6" aria-label="Warning" />
    </div>
    <div className="bg-[#FFAD0D33] h-full w-full flex items-center pl-4">
      <span data-testid="text-warning-banner" className="text-sm">
        {text}
      </span>
    </div>
    {dismissBanner && (
      <ActionIcon
        onClick={() => dismissBanner()}
        aria-label="Dismiss banner"
        variant="subtle"
        className="h-full bg-[#FFAD0D33]"
      >
        <CloseIcon className="text-base-darkest" />
      </ActionIcon>
    )}
  </div>
);

export default WarningBanner;
