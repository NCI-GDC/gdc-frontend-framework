import { MutableRefObject } from "react";

export const processJSONData = (
  facetData: Record<string, unknown>,
): ReadonlyArray<Record<string, unknown>> => {
  return Object.entries(facetData).map((e) => ({ label: e[0], value: e[1] }));
};

const handleDownload = (href: string, filename: string) => {
  const aElement = document.createElement("a");
  aElement.setAttribute("download", filename);
  aElement.href = href;
  aElement.setAttribute("target", "_blank");
  aElement.click();
  URL.revokeObjectURL(href);
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

const isFontRule = (rule: CSSRule): rule is CSSFontFaceRule => {
  return rule.constructor.name === "CSSFontFaceRule";
};

const createSVG = async (
  ref: MutableRefObject<HTMLElement>,
  className: string,
): Promise<Blob> => {
  const svgElement = document.importNode(
    ref.current.querySelectorAll("svg")[0],
    true,
  );
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("style", "background-color: white;");
  if (className) {
    svgElement.setAttribute("class", className);
  }

  const styleTag = document.createElement("style");
  const styles = [];
  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      // For fonts we need to retrieve the font file, encode it to a data url and then embed back in svg
      if (isFontRule(rule)) {
        const fontUrl = rule.style
          .getPropertyValue("src")
          .split("(")[1]
          .split(")")[0]
          .replace(/"|'/g, "");
        const fontFile = await fetch(fontUrl);
        const blob = await fontFile.blob();
        const base64 = await blobToBase64(blob);
        styles.push(
          rule.cssText.replace(/src: url\(.*?\)/, `src: url(${base64})`),
        );
      } else {
        styles.push(rule.cssText);
      }
    }
  }
  styleTag.innerHTML = styles.join("\n");

  svgElement.prepend(styleTag);
  const svgBlob = new Blob(
    [new XMLSerializer().serializeToString(svgElement)],
    {
      type: "image/svg+xml;charset=utf-8",
    },
  );

  return svgBlob;
};

/**
 * handles a request to save a chart as SVG.
 * @param ref reference to the chart div
 * @param filename name of file to save to, extension should be included e.g. chart1.svg
 */
export const handleDownloadSVG = async (
  ref: MutableRefObject<HTMLElement>,
  filename: string,
  className?: string,
): Promise<void> => {
  if (ref.current) {
    const svgBlob = await createSVG(ref, className);
    const href = URL.createObjectURL(svgBlob);
    handleDownload(href, filename);
  }
};

/**
 * handles a request to save a chart as a PNG image with a white background.
 * @param ref reference to the chart div
 * @param filename name of file to save to, extension should be included e.g. chart1.png
 */
export const handleDownloadPNG = async (
  ref: MutableRefObject<HTMLElement>,
  filename: string,
  className?: string,
): Promise<void> => {
  const svgBlob = await createSVG(ref, className);
  const svgHref = URL.createObjectURL(svgBlob);
  const svgImage = new Image();
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");

  svgImage.onload = () => {
    canvas.width = svgImage.width;
    canvas.height = svgImage.height;
    canvasCtx.drawImage(svgImage, 0, 0);
    URL.revokeObjectURL(svgHref);

    const href = canvas.toDataURL();
    handleDownload(href, filename);
  };

  svgImage.src = svgHref;
};
