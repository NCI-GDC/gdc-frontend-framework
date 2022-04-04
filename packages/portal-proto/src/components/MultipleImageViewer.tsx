import React from 'react'
import dynamic from "next/dynamic";
import { Tabs } from '@mantine/core';
import { ImageViewerProp } from './ImageViewer';
import { GdcFile } from '@gff/core';
import { parseSlideDetailsInfo } from '../features/files/utils';

const ImageViewer = dynamic(() => import("./ImageViewer"), {
    ssr: false,
});

interface MultipleImageViewerProps extends ImageViewerProp {
}

export const MultipleImageViewer = ({ tableData, imageId }: MultipleImageViewerProps) => {
    return (
        <div className='flex flex-col'>
            <div className="bg-white flex mt-4">
                <div className="bg-white w-1/6 mt-4">
                    <h2 className="p-2 text-lg mx-4">Cases</h2>
                </div>
                <div className="bg-white w-1/6 mt-4">
                    <h2 className="p-2 text-lg mx-4">Slides</h2>
                </div>
                <div className="bg-white w-1/6 mt-4">
                    <h2 className="p-2 text-lg mx-4">Image</h2>
                </div>
            </div>
            <div className="bg-white flex mt-4">
                {/* <h2 className="p-2 text-lg mx-4">Cases</h2> */}
                <Tabs variant="outline" tabPadding="sm" orientation="vertical" className='w-1/6'>
                    <Tabs.Tab label="Gallery" className='w-1/6'>
                        <Tabs variant="outline" tabPadding="sm" orientation="vertical">
                            <Tabs.Tab label="Image" className='w-2/3'>

                                <ImageViewer imageId={imageId} tableData={tableData} />
                                {/* ajsdfhkdhkj */}

                            </Tabs.Tab>
                            {/* <Tabs.Tab label="Messages"><ImageViewer imageId={imageId} tableData={tableData} /></Tabs.Tab>
                            <Tabs.Tab label="Settings"><ImageViewer imageId={imageId} tableData={tableData} /></Tabs.Tab> */}
                        </Tabs>
                    </Tabs.Tab>
                    <Tabs.Tab label="Messages" className='w-1/6'>
                        <Tabs variant="outline" tabPadding="sm" orientation="vertical">
                            <Tabs.Tab label="Image" className='w-2/3'>

                                <ImageViewer imageId={imageId} tableData={tableData} />
                                {/* ajsdfhkdhkj */}

                            </Tabs.Tab>
                            {/* <Tabs.Tab label="Messages"><ImageViewer imageId={imageId} tableData={tableData} /></Tabs.Tab>
                            <Tabs.Tab label="Settings"><ImageViewer imageId={imageId} tableData={tableData} /></Tabs.Tab> */}
                        </Tabs></Tabs.Tab>
                    <Tabs.Tab label="Settings" className='w-1/6'>
                        <Tabs variant="outline" tabPadding="sm" orientation="vertical">
                            <Tabs.Tab label="Image" className='w-2/3'>

                                <ImageViewer imageId={imageId} tableData={tableData} />
                                {/* ajsdfhkdhkj */}

                            </Tabs.Tab>
                            {/* <Tabs.Tab label="Messages"><ImageViewer imageId={imageId} tableData={tableData} /></Tabs.Tab>
                            <Tabs.Tab label="Settings"><ImageViewer imageId={imageId} tableData={tableData} /></Tabs.Tab> */}
                        </Tabs></Tabs.Tab>
                </Tabs>

            </div>
            {/* <div className="bg-white w-1/6 mt-4">
                <h2 className="p-2 text-lg mx-4">Slides</h2>
                <Tabs variant="outline" tabPadding="sm" orientation="vertical">
                    <Tabs.Tab label="Gallery">Gallery tab content</Tabs.Tab>
                    <Tabs.Tab label="Messages">Messages tab content</Tabs.Tab>
                    <Tabs.Tab label="Settings">Settings tab content</Tabs.Tab>
                </Tabs>

            </div> */}
            {/* <div className="bg-white w-2/3 mt-4">
                 <h2 className="p-2 text-lg mx-4">Image</h2> 
                <ImageViewer imageId={imageId} tableData={tableData} />
            </div> */}
        </div>

    )


}