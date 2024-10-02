import { MdDownload as DownloadIcon } from "react-icons/md";
import { Menu, Tooltip } from "@mantine/core";
import Plotly from "plotly.js";
import { DownloadButton } from "@/components/tailwindComponents";
import { JSONArray } from "@/features/types";

interface ChartDownloadProps {
  readonly chartDivId: string;
  readonly chartName: string;
  readonly jsonData: JSONArray;
}

const DownloadOptions: React.FC<ChartDownloadProps> = ({
  chartDivId,
  chartName,
  jsonData,
}: ChartDownloadProps) => {
  const downloadImage = (filetype: "svg" | "png") => {
    Plotly.downloadImage(chartDivId, {
      format: filetype,
      height: 500,
      width: 700,
      filename: chartName,
    }).then((r) => r);
  };

  return (
    <Menu width="auto">
      <Menu.Target>
        <Tooltip label="Download image or data">
          <DownloadButton data-testid="button-download-image-or-data">
            <DownloadIcon size="1.25em" aria-label="Download" />
          </DownloadButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown data-testid="list-download-image-or-data-dropdown">
        <Menu.Item
          onClick={() => downloadImage("svg")}
          onKeyUp={(e) => e.key === "Enter" && downloadImage("svg")}
        >
          SVG
        </Menu.Item>
        <Menu.Item
          onClick={() => downloadImage("png")}
          onKeyUp={(e) => e.key === "Enter" && downloadImage("png")}
        >
          PNG
        </Menu.Item>
        <Menu.Item
          component="a"
          href={`data:text/json;charset=utf-8, ${encodeURIComponent(
            JSON.stringify(jsonData, null, 2), // prettify JSON
          )}`}
          download={`${chartName}.json`}
        >
          JSON
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default DownloadOptions;
