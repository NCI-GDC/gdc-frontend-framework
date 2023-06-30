import { Button, ButtonProps, Loader, Tooltip } from "@mantine/core";
import { FiDownload } from "react-icons/fi";
import download from "src/utils/download";
import { hideModal, Modals, useCoreDispatch } from "@gff/core";
import { Dispatch, SetStateAction, forwardRef } from "react";

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
  toolTip?: string;
}

export const DownloadButton = forwardRef<
  HTMLButtonElement,
  DownloadButtonProps & ButtonProps
>(
  (
    {
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
      toolTip,
      ...buttonProps
    }: DownloadButtonProps,
    ref,
  ) => {
    const text = active ? activeText : inactiveText;
    const dispatch = useCoreDispatch();
    const Icon = active ? (
      <Loader size="sm" className="p-1" />
    ) : (
      <FiDownload title="download" size={16} />
    );

    return (
      <Tooltip disabled={!toolTip} label={toolTip}>
        <Button
          ref={ref}
          leftIcon={showIcon && inactiveText && <FiDownload />}
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
      </Tooltip>
    );
  },
);
