import { BsGraphDown, BsFileEarmarkTextFill } from "react-icons/bs";
import _ from "lodash";
import { Tooltip } from "@mantine/core";

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
            return 'MO-gray'
        case 'LOW':
            return 'MO-green'
        case 'MODIFIER':
            return 'MR-gray'
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
    
    return { 
        "vepImpact": vep_impact,
        "vepText": vepText,
        "vepColor": `bg-${vepColor}-400`,
        "siftScore": sift_score,
        "siftText": siftText,
        "siftColor": `bg-${siftColor}-400`,
        "siftImpact": sift_impact,
        "polyScore": polyphen_score,
        "polyText": polyText,
        "polyColor": `bg-${polyColor}-400`,
        "polyImpact": polyphen_impact
    }
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
                            {(value.vepImpact !== null) ? 
                            <Tooltip label={`VEP Impact: ${value.vepImpact}`}>
                                <div className={`rounded-xl flex justify-center items-center h-8 w-8 text-white ${value.vepColor}`}>{value.vepText}</div> 
                            </Tooltip>
                            : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                            {(value.siftScore !== null) ? 
                            <Tooltip label={`SIFT Impact: ${value.siftImpact} / SIFT Score: ${value.siftScore}`}>
                                <div className={`${value.siftColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value.siftText}</div> 
                            </Tooltip>
                            : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
                            {(value.polyScore !== null) ? 
                            <Tooltip label={`PolyPhen Impact: ${value.polyImpact} / PolyPhen Score: ${value.polyScore}`}>
                                <div className={`${value.polyColor} rounded-xl flex justify-center items-center h-8 w-8 text-white`}>{value.polyText}</div>
                            </Tooltip>
                            : <div className="flex justify-center items-center rounded-xl h-8 w-8">-</div>}
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