import * as React from 'react'
import { HorizontalTable, HorizontalTableProps } from './HorizontalTable'
import { Popover, Button } from '@mantine/core';

export const SlideDetailButton = ({ tableData }: HorizontalTableProps) => {
    const [showDetails, setShowDetails] = React.useState(false)

    return (
        <Popover
            opened={showDetails}
            onClose={() => setShowDetails(false)}
            target={<Button onClick={() => setShowDetails((o) => !o)} style={{
                background: 'rgb(0, 80, 131)',
                color: 'white',
                borderRadius: '5px',
                maxWidth: '70px',
                height: '25px',
                padding: '3px 10px',
                textAlign: 'center',
            }}>Details</Button>}
            position="bottom"
            id="details-button"
            style={{ position: 'absolute', bottom: 0, top: -12 }}
        >
            <div style={{ display: 'flex' }}>
                <HorizontalTable tableData={tableData} />
            </div>
        </Popover>
    )
}