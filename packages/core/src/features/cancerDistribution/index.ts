import { combineReducers } from "@reduxjs/toolkit";
import { cnvPlotReducer, useCnvPlot } from "./cnvPlot";
import { ssmPlotReducer, useSsmPlot } from "./ssmPlot";
import {
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
  CancerDistributionTableData,
} from "./cancerDistributionTable";

export const cancerDistributionReducer = combineReducers({
  cnvPlot: cnvPlotReducer,
  ssmPlot: ssmPlotReducer,
});

export {
  useCnvPlot,
  useSsmPlot,
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
  CancerDistributionTableData,
};
