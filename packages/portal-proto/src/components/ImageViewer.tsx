import * as React from "react";
import OpenSeadragon from "openseadragon";
import { SlideDetailButton } from "./SlideDetailButton";
import { parseSlideDetailsInfo } from "../features/files/utils";
import { GdcFile } from "@gff/core";

interface ImageViewerProp {
  imageId: string;
  file: GdcFile;
}

const ImageViewer = ({ imageId, file }: ImageViewerProp) => {
  const [viewer, setViewer] = React.useState(null);
  const [hasError, setHasError] = React.useState(false);
  const InitOpenseadragon = async () => {
    const response = await fetch(
      `https://api.gdc.cancer.gov/tile/metadata/${imageId}`,
    );
    const body = await response.json();

    if (!body.Format) {
      setHasError(true);
      return;
    }
    // const body = fetchImageDetails(imageId)
    viewer && viewer.destroy();
    const view = OpenSeadragon({
      id: "osd",
      prefixUrl:
        "https://cdn.jsdelivr.net/npm/openseadragon@3.0/build/openseadragon/images/",
      visibilityRatio: 1,
      showNavigator: true,
      minZoomLevel: 0,
      tileSources: {
        height: Number(body.Height),
        width: Number(body.Width),
        tileSize: Number(body.TileSize),
        tileOverlap: Number(body.Overlap),
        getTileUrl: (level, x, y) => {
          return `https://api.gdc.cancer.gov/tile/${imageId}?level=${level}&x=${x}&y=${y}`;
        },
      },
    });

    view.addControl(document.querySelector("#details-button"), {
      anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
    });
    setViewer(view);
  };

  React.useEffect(() => {
    InitOpenseadragon();

    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  React.useEffect(() => {
    const reFetchNewImage = async () => {
      const response = await fetch(
        `https://api.gdc.cancer.gov/tile/metadata/${imageId}`,
      );
      const body = await response.json();

      if (!body.Format) {
        viewer && viewer.destroy();
        setHasError(true);
        return;
      }

      if (imageId && viewer) {
        viewer.open({
          height: Number(body.Height),
          width: Number(body.Width),
          tileSize: Number(body.TileSize),
          tileOverlap: Number(body.Overlap),
          getTileUrl: (level, x, y) => {
            return `https://api.gdc.cancer.gov/tile/${imageId}?level=${level}&x=${x}&y=${y}`;
          },
        });
      }
    };
    reFetchNewImage();
  }, [imageId]);

  return (
    <>
      {hasError ? (
        <div className="flex bg-white h-img-viewer">Image is not available</div>
      ) : (
        <div id="osd" className="flex bg-black h-img-viewer">
          <SlideDetailButton tableData={parseSlideDetailsInfo(file)} />
        </div>
      )}
    </>
  );
};

export default ImageViewer;
