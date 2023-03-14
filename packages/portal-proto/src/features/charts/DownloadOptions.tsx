import { useState } from "react";
import { MdFileDownload as DownloadIcon } from "react-icons/md";
import { Tooltip } from "@mantine/core";
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
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const downloadImage = (filetype: "svg" | "png") => {
    Plotly.downloadImage(chartDivId, {
      format: filetype,
      height: 500,
      width: 700,
      filename: chartName,
    }).then((r) => r);
  };

  return (
    <div>
      <Tooltip label="Download image or data">
        <DownloadButton
          onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
          aria-label="Download button with an icon"
        >
          <DownloadIcon size="1.25em" />
        </DownloadButton>
      </Tooltip>
      {downloadMenuOpen && (
        <div className="z-10 w-44 absolute bg-base-lightest rounded shadow-md">
          <ul className="py-1" role="menu">
            <li>
              <span
                role="menuitem"
                tabIndex={0}
                onClick={() => downloadImage("svg")}
                onKeyPress={(e) =>
                  e.key === "Enter" ? downloadImage("svg") : undefined
                }
                className="cursor-pointer block py-2 px-4 text-sm text-accent-contrast-lightest hover:bg-accent-lightest"
              >
                SVG
              </span>
            </li>
            <li>
              <span
                role="menuitem"
                tabIndex={0}
                onClick={() => downloadImage("png")}
                onKeyPress={(e) =>
                  e.key === "Enter" ? downloadImage("png") : undefined
                }
                className="cursor-pointer block py-2 px-4 text-sm text-accent-contrast-lightest hover:bg-accent-lightest "
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
                className="block py-2 px-4 text-sm text-accent-contrast-lightest hover:bg-accent-lightest "
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
