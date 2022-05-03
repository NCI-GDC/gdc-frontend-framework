import { BsGraphDown } from "react-icons/bs";
import { Tooltip, Switch } from "@mantine/core";
import { SiMicrogenetics as GeneAnnotationIcon } from "react-icons/si";

export const tableFunc = () => {
  // ex. renavigate, toggle, etc
}

export const handleSurvivalPlotToggled = (name, symbol) => {
  console.log('name', name, 'symbol', symbol);
}

export const handleSurvivalSwitch = (selectedSurvivalPlot, symbol) => {
  return selectedSurvivalPlot ? selectedSurvivalPlot.symbol == symbol : false
}

export const getCustomGridCell = (key) => {
  switch (key) {
    case "annotations":
      return {
        Header: "Annotations",
        accessor: 'annotations',
        Cell: ({ value, row }) => (<div className="grid place-items-center">
          { value ? <Tooltip label="Is Cancer Census"> <GeneAnnotationIcon size="1.15rem" /> </Tooltip>: null }
        </div>)
      }
    case "survival":
      return {
        Header: "Survival",
        accessor: 'survival',
        // TODO: add selectedSurvivalPlot somehow to changes `checked` and toggle survival plot
        // checked = {handleSurvivalSwitch(selectedSurvivalPlot, value.symbol)}
        Cell: ({ value, row }) => (
          <Tooltip label={`Click icon to plot ${value.symbol}`}>
              <Switch checked={false} onChange={() => handleSurvivalPlotToggled(value.symbol, value.name)} />
            </Tooltip>
        )
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
        SSMSAffectedCasesInCohort: g.cnv_case > 0 ? `${g.cnv_case + ' / ' + data.genes.filteredCases} (${(100 * g.cnv_case / data.genes.filteredCases).toFixed(2)}%)` : `0`,
        SSMSAffectedCasesAcrossTheGDC: g.ssm_case > 0 ? `${g.ssm_case + ' / ' + data.genes.cases} (${(100 * g.ssm_case / data.genes.cases).toFixed(2)}%)` : `0`,
        CNVGain: data.genes.cnvCases > 0 ? `${g.case_cnv_gain + ' / ' + data.genes.cnvCases} (${(100 * g.case_cnv_gain / data.genes.cnvCases).toFixed(2)}%)` : `0%`,
        CNVLoss: data.genes.cnvCases > 0 ? `${g.case_cnv_loss + ' / ' + data.genes.cnvCases} (${(100 * g.case_cnv_loss / data.genes.cnvCases).toFixed(2)}%)` : `0%`,
        mutations: data.genes.mutationCounts[g.gene_id],
        annotations: g.is_cancer_gene_census,
        survival: {"name": `${g.name}`, "symbol": `${g.symbol}`}
      }
    })
    return genesTableMapping
  }
}