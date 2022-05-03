import { BsGraphDown, BsFileEarmarkTextFill } from "react-icons/bs";
import _ from "lodash";

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

export const handleVep = (vepImpact) => {
    switch(vepImpact) {
        case 'HIGH':
            return 'HI-red'
        case 'MODERATE':
            return 'MR-gray'
        case 'LOW':
            return 'MO-gray'
        default:
            return '-'
    }
}

export const handleSift = (siftImpact) => {
    switch(siftImpact) {
        case 'deleterious':
            return 'DH-red'
        case 'deleterious_low_confidence':
            return 'DL-gray'
        case 'tolerated':
            return 'TO-gray'
        case 'tolerated_low_confidence':
            return 'TL-green'
        default: 
            return '-'
    }
}

export const handlePoly = (polyImpact) => {
    switch(polyImpact) {
        case 'benign':
            return 'BE-green'
        case 'possibly_damaging':
            return 'PO-gray'
        case 'probably_damaging':
            return 'PR-red'
        case 'unknown':
            return 'UN-gray'
        default: 
            return '-'
    }
}

export const formatImpact = (annotation) => {
    const { vep_impact, sift_impact, sift_score, polyphen_impact, polyphen_score } = annotation;
    const vepIcon = handleVep(vep_impact);
    const [vepText, vepColor] = vepIcon.split('-');
    const siftIcon = handleSift(sift_impact);
    const [siftText, siftColor] = siftIcon.split('-');
    const polyIcon = handlePoly(polyphen_impact);
    const [polyText, polyColor] = polyIcon.split('-');
    return [vepText, vepColor, siftText, siftColor, polyText, polyColor, sift_score, polyphen_score];
}

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
                            {value[0] ? <div className={`bg-${value[1]}-400 rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value[0]}</div> : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                            {value[2] ? <div className={`bg-${value[3]}-400 rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value[2]}</div> : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                            {value[4] ? <div className={`bg-${value[5]}-400 rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value[4]}</div>: <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
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
                consequences: _.startCase(_.toLower(s.consequence[0].consequence_type)) + ' ' + s.consequence[0].gene.symbol + ' ' + s.consequence[0].aa_change,
                affectedCasesInCohort: `${s.filteredOccurrences + ' / ' + data.ssms.filteredCases} (${(100 * s.filteredOccurrences / data.ssms.filteredCases).toFixed(2)}%)`,
                affectedCasesAcrossTheGDC: `${s.occurrence + ' / ' + data.ssms.cases} (${(100 * s.occurrence / data.ssms.cases).toFixed(2)}%)`,
                impact: formatImpact(s.consequence[0].annotation),
                survival: 'S'
            }
        })
        return ssmsTableMapping
    }
}