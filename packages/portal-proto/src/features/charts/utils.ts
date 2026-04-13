import { RefObject } from "react";

const EXTRA_PADDING = 100;

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
  aElement.setAttribute("rel", "noreferrer");
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

/**
 * Creates SVG that will display correctly in a download from React element
 * @param ref - React element to create download from
 * @returns Blob containing the new SVG content
 */
const createSVG = async (
  ref: RefObject<HTMLElement>,
  sizeFromSvg = true,
): Promise<Blob> => {
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("style", "background-color: white;");
  svgElement.setAttribute("height", "100%");
  svgElement.setAttribute("width", "100%");
  // For namespaced css styles
  svgElement.setAttribute("id", "__next");

  const styleTag = document.createElement("style");
  const styles = [];

  for (const sheet of document.styleSheets) {
    // Skip cross-origin stylesheets to prevent SecurityError
    if (sheet.href && new URL(sheet.href).origin !== window.location.origin) {
      continue;
    }

    try {
      for (const rule of sheet.cssRules) {
        // For fonts we need to retrieve the font file, encode it to a data url and then embed back in svg
        if (isFontRule(rule)) {
          const rawFontUrl = rule.style
            .getPropertyValue("src")
            .split("(")[1]
            .split(")")[0]
            .replace(/"|'/g, "");

          if (rawFontUrl.includes("latin")) {
            const baseUrl = sheet.href ? sheet.href : window.location.href;
            const absoluteFontUrl = new URL(rawFontUrl, baseUrl).href;
            const fontFile = await fetch(absoluteFontUrl);

            const blob = await fontFile.blob();
            const base64 = await blobToBase64(blob);
            styles.push(
              rule.cssText.replace(/src: url\(.*?\)/, `src: url(${base64})`),
            );
          }
        } else {
          styles.push(rule.cssText);
        }
      }
    } catch (e) {
      console.warn("Could not process stylesheet:", sheet.href, e);
    }
  }
  styleTag.innerHTML = styles.join("\n");
  svgElement.append(styleTag);

  const chartWrapper = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject",
  );
  const width = Number(
    sizeFromSvg
      ? ref.current.querySelector("svg").getAttribute("width")
      : ref.current.getBoundingClientRect().width,
  );
  const height = Number(
    sizeFromSvg
      ? ref.current.querySelector("svg").getAttribute("height")
      : ref.current.getBoundingClientRect().height,
  );
  chartWrapper.setAttribute("width", `${width + EXTRA_PADDING}`);
  chartWrapper.setAttribute("height", `${height + EXTRA_PADDING}`);
  chartWrapper.append(document.importNode(ref.current, true));
  svgElement.append(chartWrapper);

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
 * @param ref - reference to the chart div
 * @param filename - name of file to save to, extension should be included e.g. chart1.svg
 */
export const handleDownloadSVG = async (
  ref: RefObject<HTMLElement>,
  filename: string,
  sizeFromSvg = true,
): Promise<void> => {
  if (ref.current) {
    const svgBlob = await createSVG(ref, sizeFromSvg);
    const href = URL.createObjectURL(svgBlob);
    handleDownload(href, filename);
  }
};

/**
 * handles a request to save a chart as a PNG image with a white background.
 * @param ref - reference to the chart div
 * @param filename - name of file to save to, extension should be included e.g. chart1.png
 * @param sizeFromSvg - whether to calculate the size based on just the chart SVG or the whole element
 */
export const handleDownloadPNG = async (
  ref: RefObject<HTMLElement>,
  filename: string,
  sizeFromSvg = true,
): Promise<void> => {
  const svgBlob = await createSVG(ref, sizeFromSvg);
  const svgHref = URL.createObjectURL(svgBlob);
  const width = Number(
    sizeFromSvg
      ? ref.current.querySelector("svg").getAttribute("width")
      : ref.current.getBoundingClientRect().width,
  );
  const height = Number(
    sizeFromSvg
      ? ref.current.querySelector("svg").getAttribute("height")
      : ref.current.getBoundingClientRect().height,
  );
  const svgImage = new Image(width + EXTRA_PADDING, height + EXTRA_PADDING);
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

  svgImage.src = await blobToBase64(svgBlob);
};
