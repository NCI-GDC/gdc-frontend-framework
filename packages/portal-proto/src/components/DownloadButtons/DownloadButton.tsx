import { Button } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import download from "src/utils/download";
import { hideModal, Modals, useCoreDispatch } from "@gff/core";
import { useState } from "react";

interface DownloadButtonProps {
  endpoint: string;
  disabled?: boolean;
  inactiveText: string;
  activeText: string;
  filename: string;
  size?: number;
  format?: string;
  fields?: Array<string>;
  filters?: Record<string, any>;
  extraParams: Record<string, string>;
  method?: string;
  queryParams?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  endpoint,
  disabled = false,
  filename,
  size = 10000,
  format = "JSON",
  fields = [],
  filters = {},
  inactiveText,
  activeText,
  extraParams,
  method = "POST",
  queryParams,
}: DownloadButtonProps) => {
  const [active, setActive] = useState(false);
  const text = active ? activeText : inactiveText;
  const dispatch = useCoreDispatch();
  return (
    <Button
      leftIcon={<FaDownload />}
      disabled={disabled}
      className={`text-base-lightest ${
        disabled ? "bg-base" : "bg-primary hover:bg-primary-darker"
      } `}
      loading={active}
      onClick={() => {
        dispatch(hideModal());
        const params = {
          size,
          attachment: true,
          format,
          fields: fields.join(),
          filters,
          pretty: true,
          ...(filename ? { filename } : {}),
          ...extraParams,
        };
        setActive(true);
        download({
          params,
          endpoint,
          method,
          queryParams,
          done: () => setActive(false),
          dispatch,
          Modal400: Modals.BAMSlicingErrorModal,
          Modal403: Modals.NoAccessModal,
        });
      }}
    >
      {text}
    </Button>
  );
};
