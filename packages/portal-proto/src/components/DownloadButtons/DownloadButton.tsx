import { Button, ButtonProps, Loader } from "@mantine/core";
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
  extraParams?: Record<string, any>;
  method?: string;
  queryParams?: string;
  options?: Record<string, any>;
  customStyle?: string;
  showLoading?: boolean;
  showIcon?: boolean;
  preventClickEvent?: boolean;
  onClick?: () => void;
  setActive?: Dispatch<SetStateAction<boolean>>;
  active?: boolean;
  Modal403?: Modals;
  Modal400?: Modals;
}

export const DownloadButton: React.FC<DownloadButtonProps & ButtonProps> = ({
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
  showLoading = true,
  showIcon = true,
  preventClickEvent = false,
  active,
  Modal400,
  Modal403,
  ...buttonProps
}: DownloadButtonProps) => {
  const text = active ? activeText : inactiveText;
  const dispatch = useCoreDispatch();
  const Icon = active ? (
    <Loader size="sm" className="p-1" />
  ) : (
    <FaDownload title="download" />
  );

  return (
    <Button
      leftIcon={showIcon && inactiveText && <FaDownload />}
      disabled={disabled}
      className={
        customStyle ||
        `text-base-lightest ${
          disabled ? "bg-base" : "bg-primary hover:bg-primary-darker"
        } `
      }
      loading={showLoading && active}
      onClick={() => {
        if (!preventClickEvent && onClick) {
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
        setActive && setActive(true);
        download({
          params,
          endpoint,
          method,
          queryParams,
          done: () => setActive && setActive(false),
          dispatch,
          Modal400,
          Modal403,
          options,
        });
      }}
      {...buttonProps}
    >
      {text || Icon}
    </Button>
  );
};
