import React, { useContext } from "react";
import { MdDownload as DownloadIcon } from "react-icons/md";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { DashboardDownloadContext } from "@/utils/contexts";

const DownloadAllButton: React.FC = () => {
  const { state } = useContext(DashboardDownloadContext);
  const downloadAllSvg = () => {
    state.map((download) => {
      handleDownloadSVG(download.chartRef, `${download.filename}.svg`);
    });
  };

  const downloadAllPng = () => {
    state.map((download) => {
      handleDownloadPNG(download.chartRef, `${download.filename}.png`);
    });
  };

  return (
    <DropdownWithIcon
      dropdownElements={[
        { title: "SVG", onClick: downloadAllSvg },
        { title: "PNG", onClick: downloadAllPng },
      ]}
      TargetButtonChildren={"Download All Images"}
      LeftSection={<DownloadIcon aria-hidden="true" size="1rem" />}
    />
  );
};

export default DownloadAllButton;
