import { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { SlideDetailButton } from "./SlideDetailButton";
import { parseSlideDetailsInfo } from "../features/files/utils";
import { GdcFile, fetchImageDetails, useCoreDispatch } from "@gff/core";

interface ImageViewerProp {
  imageId: string;
  file: GdcFile;
}

const ImageViewer = ({ imageId, file }: ImageViewerProp) => {
  const [viewer, setViewer] = useState(null);
  const [hasError, setHasError] = useState(false);
  const detailsButtonRef = useRef(null)
  const coreDispatch = useCoreDispatch();

  const InitOpenseadragon = async () => {

    const imageDetails = await coreDispatch(fetchImageDetails(imageId)).unwrap()

    if (!imageDetails.Format) {
      setHasError(true);
      return;
    }

    viewer && viewer.destroy();
    const view = OpenSeadragon({
      id: "osd",
      prefixUrl:
        "https://cdn.jsdelivr.net/npm/openseadragon@3.0/build/openseadragon/images/",
      visibilityRatio: 1,
      showNavigator: true,
      minZoomLevel: 0,
      tileSources: {
        height: Number(imageDetails.Height),
        width: Number(imageDetails.Width),
        tileSize: Number(imageDetails.TileSize),
        tileOverlap: Number(imageDetails.Overlap),
        getTileUrl: (level, x, y) => {
          return `https://api.gdc.cancer.gov/tile/${imageId}?level=${level}&x=${x}&y=${y}`;
        },
      },
    });

    // detailsButtonRef && view.addControl(detailsButtonRef.current, {
    //   anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
    // });
    view.addControl(document.querySelector("#details-button"), {
      anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
    });
    setViewer(view);
  };

  useEffect(() => {
    InitOpenseadragon();

    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  useEffect(() => {
    const reFetchNewImage = async () => {
      const imageDetails = await coreDispatch(fetchImageDetails(imageId)).unwrap()

      if (!imageDetails.Format) {
        viewer && viewer.destroy();
        setHasError(true);
        return;
      }

      if (imageId && viewer) {
        viewer.open({
          height: Number(imageDetails.Height),
          width: Number(imageDetails.Width),
          tileSize: Number(imageDetails.TileSize),
          tileOverlap: Number(imageDetails.Overlap),
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
          <SlideDetailButton ref={detailsButtonRef} tableData={parseSlideDetailsInfo(file)} />
        </div>
      )}
    </>
  );
};

export default ImageViewer;
