import dynamic from "next/dynamic";

const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
  ssr: false,
});

export interface ChartTitleBarProps {
  readonly title?: string;
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
    <div className="flex items-center justify-between flex-wrap p-1.5">
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
