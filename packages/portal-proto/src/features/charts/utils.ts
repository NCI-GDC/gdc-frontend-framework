import { MutableRefObject } from "react";
import { toPng, toSvg } from "html-to-image";

export const processJSONData = (
  facetData: Record<string, unknown>,
): ReadonlyArray<Record<string, unknown>> => {
  return Object.entries(facetData).map((e) => ({ label: e[0], value: e[1] }));
};

/**
 * Downloads the url containing data. The URl is assumed to contain
 * an image Blob.
 * @param url
 * @param filename
 */
const DownloadFile = async (url: string, filename: string) => {
  const res = await fetch(url, {
    method: "get",
    mode: "no-cors",
    referrerPolicy: "no-referrer",
  });
  const dataUrl = await res.blob();
  const aElement = document.createElement("a");
  aElement.setAttribute("download", filename);
  const href = URL.createObjectURL(dataUrl);
  aElement.href = href;
  aElement.setAttribute("target", "_blank");
  aElement.click();
  URL.revokeObjectURL(href);
};
/**
 * handles a request to save a chart as SVG.
 * @param ref reference to the chart div
 * @param filename name of file to save to, extension should be included e.g. chart1.svg
 */
export const handleDownloadSVG = (
  ref: MutableRefObject<HTMLElement>,
  filename: string,
): void => {
  if (ref.current) {
    toSvg(ref.current, { cacheBust: true }).then(function (dataUrl) {
      void DownloadFile(dataUrl, filename);
    });
  }
};

/**
 * handles a request to save a chart as a PNG image with a white background.
 * @param ref reference to the chart div
 * @param filename name of file to save to, extension should be included e.g. chart1.png
 */
export const handleDownloadPNG = (
  ref: MutableRefObject<HTMLElement>,
  filename: string,
): void => {
  if (ref.current) {
    toPng(ref.current, { cacheBust: true, backgroundColor: "#FFFFFF" }).then(
      function (blob) {
        void DownloadFile(blob, filename);
      },
    );
  }
};
