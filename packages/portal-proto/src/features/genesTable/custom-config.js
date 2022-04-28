import { BsFileEarmarkTextFill, BsGraphDown } from "react-icons/bs";

export const tableFunc = () => {
  // ex. renavigate, toggle, etc
}

export const getCustomGridCell = (key) => {
  switch (key) {
    case "annotations":
      return {
        Header: "Annotations",
        accessor: 'annotations',
        Cell: ({ value, row }) => (<div className="grid place-items-center">
          <BsFileEarmarkTextFill></BsFileEarmarkTextFill>
        </div>)
      }
    case "survival":
      return {
        Header: "Survival",
        accessor: 'survival',
        Cell: ({ value, row }) => (<div className="grid place-items-center">
          <BsGraphDown onClick={() => tableFunc()}></BsGraphDown>
        </div>)
      }
    default:
      console.log('key', key);
  }
}

export const getTableFormatData = (data) => {
  if (data.status === 'fulfilled') {
    const genesTableMapping = data.genes.genes.map((g) => {
      return {
        symbol: g.symbol,
        name: g.name,
        SSMSAffectedCasesInCohort: `${g.cnv_case + ' / ' + data.genes.filteredCases} (${(100 * g.cnv_case / data.genes.filteredCases).toFixed(2)}%)`,
        SSMSAffectedCasesAcrossTheGDC: `${g.ssm_case + ' / ' + data.genes.cases} (${(100 * g.ssm_case / data.genes.cases).toFixed(2)}%)`,
        CNVGain: `${g.case_cnv_gain + ' / ' + data.genes.cnvCases} (${(100 * g.case_cnv_gain / data.genes.cnvCases).toFixed(2)}%)`,
        CNVLoss: `${g.case_cnv_loss + ' / ' + data.genes.cnvCases} (${(100 * g.case_cnv_loss / data.genes.cnvCases).toFixed(2)}%)`,
        mutations: data.genes.mutationCounts[g.gene_id],
        annotations: "A",
        survival: "S"
      }
    })
    return genesTableMapping
  }
}