import { FiDownload as DownloadIcon } from "react-icons/fi";
import { Menu, Tooltip } from "@mantine/core";
import Plotly from "plotly.js";
import { DownloadButton } from "@/features/shared/tailwindComponents";

interface ChartDownloadProps {
  readonly chartDivId: string;
  readonly chartName: string;
  readonly jsonData: Record<string, unknown>;
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
    <Menu
      width="auto"
      classNames={{
        item: "data-hovered:bg-accent-lightest data-hovered:text-accent-contrast-lightest",
      }}
    >
      <Menu.Target>
        <Tooltip label="Download image or data">
          <DownloadButton aria-label="Download button with an icon">
            <DownloadIcon size="1.25em" />
          </DownloadButton>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
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
            JSON.stringify(jsonData),
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
