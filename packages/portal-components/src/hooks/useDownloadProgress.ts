import { useState, useCallback } from "react";
import { DownloadType } from "src/analysis";

/**
 * A custom hook to manage the download progress state for a component.
 * Each component that calls this hook will get its own independent state.
 * This is used for DownloadProgressContext
 */
export const useDownloadProgress = () => {
  const [activeDownloads, setActiveDownloads] = useState<Set<DownloadType>>(
    new Set(),
  );

  const startDownload = useCallback((type: DownloadType) => {
    setActiveDownloads((prev) => new Set(prev).add(type));
  }, []);

  const finishDownload = useCallback((type: DownloadType) => {
    setActiveDownloads((prev) => {
      const next = new Set(prev);
      next.delete(type);
      return next;
    });
  }, []);

  const isDownloading = useCallback(
    (type: DownloadType) => activeDownloads.has(type),
    [activeDownloads],
  );

  return { activeDownloads, startDownload, finishDownload, isDownloading };
};
