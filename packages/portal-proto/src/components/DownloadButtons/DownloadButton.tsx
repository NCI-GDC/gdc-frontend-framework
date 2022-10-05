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
  extraParams?: Record<string, any>;
  method?: string;
  queryParams?: string;
  options?: Record<string, any>;
  customStyle?: string;
  onClick?: () => void;
  setActive?: Dispatch<SetStateAction<boolean>>;
  active?: boolean;
  Modal403?: Modals;
  Modal400?: Modals;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  endpoint,
  disabled = false,
  inactiveText,
  activeText,
  filename,
  queryParams,
  options,
  customStyle,
  setActive,
  onClick,
  active,
  Modal400,
  Modal403,
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
        setActive(true);
        download({
          endpoint,
          queryParams,
          filename,
          done: () => setActive(false),
          dispatch,
          Modal400,
          Modal403,
          options,
        });
      }}
    >
      {text || <FaDownload title="download" />}
    </Button>
  );
};
