import { DocumentWithWebkit } from "./features/types";

export const toggleFullScreen = async (
  ref: React.MutableRefObject<any>,
): Promise<void> => {
  // Webkit vendor prefix for Safari support: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#browser_compatibility
  if (
    !document.fullscreenElement &&
    !(document as DocumentWithWebkit).webkitFullscreenElement
  ) {
    if (ref.current.requestFullscreen) {
      await ref.current.requestFullscreen();
    } else if (ref.current.webkitRequestFullScreen) {
      ref.current.webkitRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as DocumentWithWebkit).webkitExitFullscreen) {
      (document as DocumentWithWebkit).webkitExitFullscreen();
    }
  }
};

export const capitalize = (original: string): string => {
  const customCapitalizations = {
    id: "ID",
    uuid: "UUID",
  };

  return original
    .split(" ")
    .map(
      (word) =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
    )
    .join(" ");
};
