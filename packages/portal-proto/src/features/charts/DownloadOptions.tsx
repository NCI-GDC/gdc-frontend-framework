import { useState } from "react";
import { Button } from "../layout/UserFlowVariedPages";
import { MdFileDownload as DownloadIcon } from "react-icons/md";
import Plotly from "plotly.js";

interface ChartDownloadProps {
  readonly chartDivId: string;
  readonly chartName: string;
  readonly jsonData: any;
}

const DownloadOptions : React.FC<ChartDownloadProps> = ({ chartDivId, chartName, jsonData } : ChartDownloadProps) => {
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const downloadImage = (filetype : "svg" | "png") => {
    Plotly.downloadImage(chartDivId, {
      format: filetype,
      height: 500,
      width: 700,
      filename: chartName,
    });
  };

return (
	<div>
	  <Button
	    className="mx-2 "
	    onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
	  >
	    <DownloadIcon size="1.5em" />
	  </Button>
	  {downloadMenuOpen && (
	    <div className="z-10 w-44 absolute bg-white rounded shadow-md">
	      <ul className="py-1" role="menu">
	        <li role="menuitem">
	          <span
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
	        <li role="menuitem">
	          <span
	            tabIndex={0}
	            onClick={() => downloadImage("png")}
	            onKeyPress={(e) =>
	              e.key === "Enter" ? downloadImage("png") : undefined
	            }
	            className="cursor-pointer block py-2 px-4 text-sm text-nci-gray-darker hover:bg-nci-gray-lightest "
	          >
	            PNG
	          </span>
	        </li>
	        <li role="menuitem">
	          <a
	            href={`data:text/json;charset=utf-8, ${encodeURIComponent(
	              JSON.stringify(jsonData),
	            )}`}
	            download={`${chartName}.json`}
	            className="block py-2 px-4 text-sm text-nci-gray-darker hover:bg-nci-gray-lightest "
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
