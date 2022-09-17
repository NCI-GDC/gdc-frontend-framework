import { Button } from "@mantine/core";
import { FaDownload } from "react-icons/fa";
import download from "src/utils/download";
import { hideModal, Modals, useCoreDispatch } from "@gff/core";
import { Dispatch, SetStateAction } from "react";

interface DownloadButtonProps {
  endpoint?: string;
  disabled?: boolean;
  inactiveText: string;
  activeText: string;
  filename?: string;
  size?: number;
  format?: string;
  fields?: Array<string>;
  filters?: Record<string, any>;
  extraParams?: Record<string, string>;
  method?: string;
  queryParams?: string;
  options?: Record<string, any>;
  customStyle?: string;
  onClick?: () => void;
  setActive?: Dispatch<SetStateAction<boolean>>;
  active?: boolean;
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
  options,
  customStyle,
  setActive,
  onClick,
  active,
}: DownloadButtonProps) => {
  const text = active ? activeText : inactiveText;
  const dispatch = useCoreDispatch();
  return (
    <Button
      leftIcon={inactiveText && <FaDownload />}
      disabled={disabled}
      className={
        customStyle ||
        `text-base-lightest ${
          disabled ? "bg-base" : "bg-primary hover:bg-primary-darker"
        } `
      }
      loading={active}
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
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
          options,
        });
      }}
    >
      {text || <FaDownload title="download" />}
    </Button>
  );
};
