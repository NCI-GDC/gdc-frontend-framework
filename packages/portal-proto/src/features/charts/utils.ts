import { MutableRefObject } from "react";
import { toPng, toSvg } from "html-to-image";

export const processJSONData = (
  facetData: Record<string, unknown>,
): ReadonlyArray<Record<string, unknown>> => {
  return Object.entries(facetData).map((e) => ({ label: e[0], value: e[1] }));
};

const DownloadFile = async (url: string, filename: string) => {
  const res = await fetch(url, {
    method: "get",
    mode: "no-cors",
    referrerPolicy: "no-referrer",
  });
  const blob = await res.blob();
  const aElement = document.createElement("a");
  aElement.setAttribute("download", filename);
  const href = URL.createObjectURL(blob);
  aElement.href = href;
  aElement.setAttribute("target", "_blank");
  aElement.click();
  URL.revokeObjectURL(href);
};

export const handleDownloadSVG = (
  ref: MutableRefObject<HTMLDivElement>,
  filename,
) => {
  if (ref.current) {
    toSvg(ref.current, { cacheBust: true }).then(function (blob) {
      DownloadFile(blob, filename);
    });
  }
};

export const handleDownloadPNG = (
  ref: MutableRefObject<HTMLDivElement>,
  filename,
) => {
  if (ref.current) {
    toPng(ref.current, { cacheBust: true }).then(function (blob) {
      DownloadFile(blob, filename);
    });
  }
};
