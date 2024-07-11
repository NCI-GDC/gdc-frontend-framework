import React, { useRef, useState, useCallback, useEffect } from "react";
import getConfig from "next/config";
import OpenSeadragon from "openseadragon";
import { useImageDetailsQuery } from "@gff/core";
import { Button, LoadingOverlay } from "@mantine/core";
import { HorizontalTable, HorizontalTableProps } from "../HorizontalTable";
import { GDC_API } from "@gff/core";
import { toggleFullScreen } from "src/utils";
import useOutsideClickAlert from "@/hooks/useOutsideClickAlert";
import { useDeepCompareEffect } from "use-deep-compare";

export interface ImageViewerProp extends HorizontalTableProps {
  imageId: string;
}

const {
  publicRuntimeConfig: { basePath },
} = getConfig();

const InitOpenseadragon = (
  basePath: string,
  osdContainerRef: React.MutableRefObject<HTMLDivElement>,
  detailsButtonWrapperRef: React.MutableRefObject<HTMLDivElement>,
) => {
  OpenSeadragon.setString("Tooltips.Home", "Reset Zoom");
  const viewer = OpenSeadragon({
    element: osdContainerRef.current,
    prefixUrl: `${basePath}/OpenseadragonImages/`,
    visibilityRatio: 1,
    showNavigator: true,
    minZoomLevel: 0,
    showFullPageControl: false,
    imageLoaderLimit: 1,
  });

  const fullPageButton = new OpenSeadragon.Button({
    tooltip: "Toggle Full Page",
    srcRest: `${basePath}/OpenseadragonImages/fullpage_rest.png`,
    srcGroup: `${basePath}/OpenseadragonImages/fullpage_grouphover.png`,
    srcHover: `${basePath}/OpenseadragonImages/fullpage_hover.png`,
    srcDown: `${basePath}/OpenseadragonImages/fullpage_pressed.png`,
    onClick: () => toggleFullScreen(osdContainerRef),
  });

  viewer.addControl(fullPageButton.element, {
    anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
  });

  detailsButtonWrapperRef.current &&
    viewer.addControl(detailsButtonWrapperRef.current, {
      anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
    });

  return viewer;
};

const ImageViewer = ({ imageId, tableData }: ImageViewerProp): JSX.Element => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer | null>(null);
  const osdContainerRef = useRef<HTMLDivElement>(null);
  const detailsButtonWrapperRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const {
    data: imageDetails,
    isFetching,
    isError,
  } = useImageDetailsQuery(imageId);

  useOutsideClickAlert(
    detailsButtonWrapperRef as React.RefObject<HTMLDivElement>,
    () => setShowDetails(false),
  );

  const loadImage = useCallback(() => {
    if (
      viewer &&
      !isFetching &&
      imageDetails &&
      imageDetails.Height &&
      imageDetails.Width
    ) {
      viewer.open({
        height: Number(imageDetails.Height),
        width: Number(imageDetails.Width),
        tileSize: Number(imageDetails.TileSize),
        tileOverlap: Number(imageDetails.Overlap),
        getTileUrl: (level, x, y) => {
          return `${GDC_API}/tile/${imageId}?level=${level}&x=${x}&y=${y}`;
        },
      });
    }
  }, [viewer, isFetching, imageDetails, imageId]);

  useEffect(() => {
    if (!viewer && osdContainerRef.current) {
      const newViewer = InitOpenseadragon(
        basePath,
        osdContainerRef,
        detailsButtonWrapperRef,
      );
      setViewer(newViewer);
    }
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDeepCompareEffect(() => {
    if (viewer && imageDetails) {
      // Clear existing image and cancel pending requests
      viewer.world.removeAll();
      viewer._cancelPendingImages();

      loadImage();
    }
  }, [imageId, viewer, imageDetails, isFetching, loadImage]);

  return (
    <>
      <div
        className={isError ? "flex bg-base-lightest h-img-viewer" : "hidden"}
      >
        Image is not available
      </div>

      <LoadingOverlay
        data-testid="loading-spinner"
        visible={isFetching && !isError}
      />

      <div
        ref={osdContainerRef}
        className={
          isFetching || isError
            ? "invisible"
            : "flex bg-black h-screen/2 relative"
        }
      >
        <div
          ref={detailsButtonWrapperRef}
          data-testid="details-image-viewer"
          id="details-button"
          className="absolute -top-[11px]"
        >
          <Button
            onClick={() => setShowDetails((o) => !o)}
            className="bg-primary-dark mb-3"
            size="xs"
          >
            Details
          </Button>
        </div>
        {showDetails && (
          <div className="absolute top-7 left-32">
            <HorizontalTable
              customDataTestID="table-image-viewer-details"
              tableData={tableData}
              customContainerStyles="border-3 border-base"
              slideImageDetails
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ImageViewer;
