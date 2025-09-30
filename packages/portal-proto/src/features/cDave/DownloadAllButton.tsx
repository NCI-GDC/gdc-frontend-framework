import React, { useContext, useState } from "react";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { DashboardDownloadContext } from "@gff/portal-components";
import { DownloadIcon } from "@/utils/icons";
import { Loader } from "@mantine/core";
import { ADDITIONAL_DOWNLOAD_MESSAGE } from "@/utils/constants";

const DownloadAllButton: React.FC = () => {
  const { state } = useContext(DashboardDownloadContext);
  const [isAllSvgDownloading, setIsAllSvgDownloading] = useState(false);
  const [isAllPngDownloading, setIsAllPngDownloading] = useState(false);

  const downloadAllSvg = async () => {
    setIsAllSvgDownloading(true);
    await Promise.all(
      state.map((download) =>
        handleDownloadSVG(download.chartRef, `${download.filename}.svg`),
      ),
    );
    setIsAllSvgDownloading(false);
  };

  const downloadAllPng = async () => {
    setIsAllPngDownloading(true);
    await Promise.all(
      state.map((download) =>
        handleDownloadPNG(download.chartRef, `${download.filename}.png`),
      ),
    );
    setIsAllPngDownloading(false);
  };

  return (
    <DropdownWithIcon
      dropdownElements={[
        {
          title: "SVG",
          onClick: downloadAllSvg,
          icon: isAllSvgDownloading ? <Loader size="xs" /> : null,
          isLoading: isAllSvgDownloading,
          loadingTooltip: ADDITIONAL_DOWNLOAD_MESSAGE,
        },
        {
          title: "PNG",
          onClick: downloadAllPng,
          icon: isAllPngDownloading ? <Loader size="xs" /> : null,
          isLoading: isAllPngDownloading,
          loadingTooltip: ADDITIONAL_DOWNLOAD_MESSAGE,
        },
      ]}
      TargetButtonChildren={"Download All Images"}
      LeftSection={<DownloadIcon aria-hidden="true" size="1rem" />}
      closeOnItemClick={false}
    />
  );
};

export default DownloadAllButton;
