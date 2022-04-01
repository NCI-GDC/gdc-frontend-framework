import React, { useEffect, useState } from "react";
import OpenSeadragon from "openseadragon";
import { useImageDetails } from "@gff/core";
import { LoadingOverlay } from "@mantine/core";

interface ImageViewerProp {
  imageId: string;
}

const ImageViewer = ({ imageId }: ImageViewerProp) => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer>(null);
  const { data: imageDetails, isFetching, isError } = useImageDetails(imageId);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    const options: OpenSeadragon.Options = {
      id: "osd",
      prefixUrl:
        "https://cdn.jsdelivr.net/npm/openseadragon@3.0/build/openseadragon/images/",
      visibilityRatio: 1,
      showNavigator: true,
      minZoomLevel: 0,
    }
    const view: OpenSeadragon.Viewer = OpenSeadragon(options)

    const detailButton = document.querySelector("#details-button")
    detailButton && view.addControl(detailButton, {
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
    const reFetchNewImage = () => {
      if (imageId && viewer && imageDetails) {
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
  }, [imageId, viewer, imageDetails]);

  return (
    <>
      {
        isFetching ? (
          <div>
            <LoadingOverlay visible />
          </div>
        )
          :
          isError ? (
            <div id="osd" className="flex bg-white h-img-viewer">Image is not available</div>
          ) : (
            <div id="osd" className="flex bg-black h-img-viewer" />
          )
      }
    </>
  );
};

export default ImageViewer;
