import { useState } from "react";
import { MdFileDownload as DownloadIcon } from "react-icons/md";
import { Tooltip } from "@mantine/core";
import Plotly from "plotly.js";

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
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const downloadImage = (filetype: "svg" | "png") => {
    Plotly.downloadImage(chartDivId, {
      format: filetype,
      height: 500,
      width: 700,
      filename: chartName,
    }).then(r => r);
  };

  return (
    <div>
      <Tooltip label="Download image or data">
      <button
        className="px-1.5 min-h-[28px] nim-w-[40px] border-nci-gray-light border rounded-[4px] "
        onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
      >
        <DownloadIcon size="1.25em" />
      </button>
      </Tooltip>
      {downloadMenuOpen && (
        <div className="z-10 w-44 absolute bg-white rounded shadow-md">
          <ul className="py-1" role="menu">
            <li >
              <span role="menuitem"
                tabIndex={0}
                onClick={() => downloadImage("svg")}
                onKeyPress={(e) =>
                  e.key === "Enter" ? downloadImage("svg") : undefined
                }
                className="cursor-pointer block py-2 px-4 text-sm text-nci-gray-darker hover:bg-nci-gray-lightest "
              >
                SVG
              </span>
            </li>
            <li>
              <span role="menuitem" tabIndex={0}
                onClick={() => downloadImage("png")}
                onKeyPress={(e) =>
                  e.key === "Enter" ? downloadImage("png") : undefined
                }
                className="cursor-pointer block py-2 px-4 text-sm text-nci-gray-darker hover:bg-nci-gray-lightest "
              >
                PNG
              </span>
            </li>
            <li>
              <a
                href={`data:text/json;charset=utf-8, ${encodeURIComponent(
                  JSON.stringify(jsonData),
                )}`}
                download={`${chartName}.json`}
                className="block py-2 px-4 text-sm text-nci-gray-darker hover:bg-nci-gray-lightest "
                role="menuitem"
              >
                JSON
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DownloadOptions;
