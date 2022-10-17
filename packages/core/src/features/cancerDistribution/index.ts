import { combineReducers } from "@reduxjs/toolkit";
import { cnvPlotReducer, useCnvPlot } from "./cnvPlot";
import { ssmPlotReducer, useSsmPlot } from "./ssmPlot";
import {
  //cancerDistributionTableApiSliceReducerPath,
  cancerDistributionTableApiReducer,
  useGetCancerDistributionTableQuery,
} from "./cancerDistributionTable";

export const cancerDistributionReducer = combineReducers({
  cnvPlot: cnvPlotReducer,
  ssmPlot: ssmPlotReducer,
  //[cancerDistributionTableApiSliceReducerPath]:
  //cancerDistributionTableApiReducer,
});

export {
  useCnvPlot,
  useSsmPlot,
  useGetCancerDistributionTableQuery,
  cancerDistributionTableApiReducer,
};
