import React, { useContext } from "react";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { DashboardDownloadContext } from "./chartDownloadContext";

const DownloadAllButton: React.FC = () => {
  const { state } = useContext(DashboardDownloadContext);
  const downloadAllSvg = () => {
    state.map((download) => {
      handleDownloadPNG(download.chartRef, `${download.filename}.png`);
    });
  };

  const downloadAllPng = () => {
    state.map((download) => {
      handleDownloadSVG(download.chartRef, `${download.filename}.png`);
    });
  };

  return (
    <DropdownWithIcon
      dropdownElements={[
        { title: "SVG", onClick: downloadAllSvg },
        { title: "PNG", onClick: downloadAllPng },
      ]}
      TargetButtonChildren={"Download All Images"}
      LeftIcon={<DownloadIcon />}
    />
  );
};

export default DownloadAllButton;
