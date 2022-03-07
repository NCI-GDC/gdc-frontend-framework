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
      const tableRows = [];
      data.genes.genes.forEach(element => {
        tableRows.push({
          symbol: element.symbol,
          name: element.name,
          SSMSAffectedCasesInCohort: `${element.cnv_case + ' / ' + data.genes.filteredCases} (${(100 * element.cnv_case  / data.genes.filteredCases).toFixed(2)}%)`,
          SSMSAffectedCasesAcrossTheGDC: `${element.ssm_case + ' / ' + data.genes.cases} (${(100 * element.ssm_case  / data.genes.cases).toFixed(2)}%)`,
          CNVGain: `${element.case_cnv_gain + ' / ' + data.genes.cnvCases} (${(100 * element.case_cnv_gain  / data.genes.cnvCases).toFixed(2)}%)`,
          CNVLoss: `${element.case_cnv_loss + ' / ' + data.genes.cnvCases} (${(100 * element.case_cnv_loss / data.genes.cnvCases).toFixed(2)}%)`, 
          mutations: data.genes.mutationCounts[element.gene_id],
          annotations: "A",
          survival: "S"
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