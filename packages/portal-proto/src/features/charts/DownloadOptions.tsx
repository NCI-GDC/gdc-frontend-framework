import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import Plotly from "plotly.js";
import { JSONArray } from "@/features/types";
import { DownloadIcon } from "@/utils/icons";
import { useDisclosure } from "@mantine/hooks";

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
  const [opened, { open, close }] = useDisclosure(false);

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
      closeOnItemClick={false}
      opened={opened}
      onOpen={open}
      onClose={close}
    >
      <Menu.Target>
        <Tooltip label="Download image or data">
          <ActionIcon
            data-testid="button-download-image-or-data"
            variant="outline"
            aria-expanded={opened}
          >
            <DownloadIcon size="1rem" aria-hidden="true" />
          </ActionIcon>
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
