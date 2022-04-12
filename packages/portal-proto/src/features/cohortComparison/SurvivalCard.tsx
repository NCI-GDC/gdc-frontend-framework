import { Paper, Tooltip } from "@mantine/core";
import { useSurvivalPlot } from "@gff/core";
import SurvivalPlot from "../charts/SurvivalPlot";

const tooltipLabel = (
  <>
    <p>
      Criteria for including a case from your cohorts in the survival analysis:
    </p>
    <p>- the case is in only one of your cohorts, not both</p>
    <p>- the case has the required data for the analysis</p>
  </>
);

const SurvivalCard = () => {
  const { data } = useSurvivalPlot();

  return (
    <Paper p="md" className="min-w-[600px]">
      <h2 className="text-lg font-semibold">Survival Analysis</h2>
      <SurvivalPlot data={data} />
      <table className="bg-white w-full text-left text-nci-gray-darker">
        <thead>
          <tr className="bg-nci-gray-lightest">
            <th>
              <Tooltip label={tooltipLabel} wrapLines>
                <span className="underline decoration-dashed">
                  {"Cases included in Analysis"}
                </span>
              </Tooltip>
            </th>
            <th>
              # Cases S<sub>1</sub>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Overall Survival Analysis</td>
            <td>{data[0] ? data[0].donors?.length : 0}</td>
          </tr>
        </tbody>
      </table>
    </Paper>
  );
};

export default SurvivalCard;
