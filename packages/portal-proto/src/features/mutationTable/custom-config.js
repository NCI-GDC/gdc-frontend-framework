import { BsGraphDown, BsFileEarmarkTextFill } from "react-icons/bs";

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

export const tableFunc = (e) => {

}

export const getCustomGridCell = (key) => {
    switch (key) {
        case "impact":
            return {
                Header: "Impact",
                accessor: 'impact',
                Cell: ({ value, row }) => (<>
                    <div className="grid place-items-center">
                        <div className="flex flex-row space-x-3">
                            <div className="bg-red-400 rounded-xl h-6 w-6"></div>
                            <div className="bg-blue-400 rounded-xl h-6 w-6"></div>
                            <div className="bg-yellow-400 rounded-xl h-6 w-6"></div>
                        </div>
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
        const DNA_CHANGE_MARKERS = ['del', 'ins', '>'];
        const ssmsTableMapping = data.ssms.ssms.map((s) => {
            return {
                DNAChange: truncateAfterMarker(s.genomic_dna_change, DNA_CHANGE_MARKERS, 10),
                type: filterMutationType(s.mutation_subtype),
                consequences: s.consequence[0].gene.symbol + ' ' + s.consequence[0].aa_change,
                affectedCasesInCohort: `${s.filteredOccurrences + ' / ' + data.ssms.filteredCases} (${(100 * s.filteredOccurrences / data.ssms.filteredCases).toFixed(2)}%)`,
                affectedCasesAcrossTheGDC: `${s.occurrence + ' / ' + data.ssms.cases} (${(100 * s.occurrence / data.ssms.cases).toFixed(2)}%)`,
                impact: 'Impact',
                survival: 'S'
            }
        })
        return ssmsTableMapping
    }
}