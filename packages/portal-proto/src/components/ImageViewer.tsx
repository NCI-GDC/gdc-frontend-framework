import * as React from 'react'
import OpenSeadragon from "openseadragon";

interface ImageViewerProp {
    imageId?: string
}

const ImageViewer = ({ imageId }: ImageViewerProp) => {
    const [viewer, setViewer] = React.useState(null);

    const InitOpenseadragon = async () => {
        const response = await fetch(`https://api.gdc.cancer.gov/tile/metadata/${imageId}`)
        const body = await response.json()

        // const body = fetchImageDetails(imageId)
        viewer && viewer.destroy();
        const view = OpenSeadragon({
            id: "osd",
            prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@3.0/build/openseadragon/images/',
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
        })
 
        view.addControl(document.querySelector('#details-button'), {
            anchor: OpenSeadragon.ControlAnchor.TOP_LEFT,
        });
        setViewer(view);
    }

    React.useEffect(() => {
        InitOpenseadragon()

        return () => {
            viewer && viewer.destroy();
        };
    }, []);

    // TODO: take care of the situation when user clicks on different tile and it has to load the new image

    return (
        <div
            id="osd"
            style={{
                height: "550px",
                width: "100%",
                backgroundColor: '#000'
            }}
        >
        </div>
    );
}


export default ImageViewer