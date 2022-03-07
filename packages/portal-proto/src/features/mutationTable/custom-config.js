import { BsGraphDown, BsFileEarmarkTextFill } from "react-icons/bs";

export const tableFunc = (e) => {

}

export const getCustomGridCell = (key) => {
    switch (key) {
        case "impact":
            return {
                Header: "Impact",
                accessor: 'impact',
                Cell: ({ value, row }) => (<>
                    <div className="flex flex-row space-x-3 ml-5">
                        <div className="bg-red-400 rounded-xl h-6 w-6"></div>
                        <div className="bg-blue-400 rounded-xl h-6 w-6"></div>
                        <div className="bg-yellow-400 rounded-xl h-6 w-6"></div>
                    </div>
                </>),
            };
        case "survival":
            return {
                Header: "Survival",
                accessor: 'survival',
                Cell: ({ value, row }) => (
                    <div className="grid place-items-center">
                        <BsGraphDown onClick={() => tableFunc()}></BsGraphDown>
                    </div>
                )
            }
        case "annotations":
            return {
                Header: "Annotations",
                accessor: 'annotations',
                Cell: ({ value, row }) => (<div className="grid place-items-center">
                    <BsFileEarmarkTextFill></BsFileEarmarkTextFill>
                </div>)
            }
        default:
            console.log('key', key);
    }
}

export const getTableFormatData = (data) => {
    if (data.status === 'fulfilled') {
        const tableRows = [];
        const DNA_CHANGE_MARKERS = ['del', 'ins', '>'];
        data.ssms.ssms.forEach(element => {
            tableRows.push({
                DNAChange: truncateAfterMarker(element.genomic_dna_change, DNA_CHANGE_MARKERS, 10),
                type: filterMutationType(element.mutation_subtype),
                consequences: element.consequence[0].gene.symbol + ' ' + element.consequence[0].aa_change,
                affectedCasesInCohort: `${element.filteredOccurrences + ' / ' + data.ssms.filteredCases} (${(100 * element.filteredOccurrences / data.ssms.filteredCases).toFixed(2)}%)`,
                affectedCasesAcrossTheGDC: `${element.occurrence + ' / ' + data.ssms.cases} (${(100 * element.occurrence / data.ssms.cases).toFixed(2)}%)`,
                impact: 'Impact',
                survival: 'S'
            })
        })
        return tableRows
    }
}

export const sortableOptions = {
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    ghostClass: "ghost",
    group: "shared"
};

export const filterMutationType = (typeText) => {
    const splitStr = typeText.split(" ");
    const operation = splitStr[splitStr.length - 1];
    return operation.charAt(0).toUpperCase() + operation.slice(1);
}

export const truncateAfterMarker = (
    term,
    markers,
    length,
    omission = '…'
) => {
    const markersByIndex = markers.reduce(
        (acc, marker) => {
            const index = term.indexOf(marker);
            if (index !== -1) {
                return { index, marker };
            }
            return acc;
        },
        { index: -1, marker: '' }
    );
    const { index, marker } = markersByIndex;
    if (index !== -1 && term.length > index + marker.length + 8) {
        return `${term.substring(0, index + marker.length + 8)}${omission}`;
    }
    return term;
};