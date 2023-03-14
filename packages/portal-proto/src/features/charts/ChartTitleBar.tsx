import dynamic from "next/dynamic";
import { ReactNode } from "react";

const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
  ssr: false,
});

export interface ChartTitleBarProps {
  readonly title?: ReactNode;
  readonly filename: string;
  readonly divId: string;
  readonly jsonData: Record<string, unknown>;
}

const ChartTitleBar: React.FC<ChartTitleBarProps> = ({
  divId,
  title,
  filename,
  jsonData,
}: ChartTitleBarProps) => {
  return (
    <div className="flex items-center gap-6">
      {title}
      <DownloadOptions
        chartDivId={divId}
        chartName={filename}
        jsonData={jsonData}
      />
    </div>
  );
};

export default ChartTitleBar;
