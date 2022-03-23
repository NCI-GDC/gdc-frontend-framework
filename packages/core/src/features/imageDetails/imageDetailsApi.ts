export interface ImageMetadataResponse {
    readonly Format: string;
    readonly Height: string;
    readonly Width: string;
    readonly Overlap: string;
    readonly TileSize: string;
    readonly uuid: string;
}

export const fetchSlideImages = async (fileId: string): Promise<ImageMetadataResponse> => {
    const response = await fetch(`https://api.gdc.cancer.gov/tile/metadata/${fileId}`)

    if (response.ok) {
        return response.json();
    }

    throw Error(await response.text());

}