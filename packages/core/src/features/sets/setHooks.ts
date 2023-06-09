// // hook to convert cohorts to sets
// import { useCoreDispatch, useCoreSelector } from "../../hooks";
// import { CoreState } from "../../reducers";
// import { selectAvailableCohorts, selectCurrentCohortFilters } from "../../../dist";
// import { selectSetsByType } from "./setsSlice";
//
// export const useConvertCohortsToSets = (
// ): Record<string, string> => {
//  // const dispatch = useCoreDispatch();
//   const cohorts =  useCoreSelector((state) => selectAvailableCohorts(state));
//   const caseSets = useCoreSelector((state) => selectSetsByType(state, "cases"));
//
//   return Object.assign({}, ...cohortSets);
// }
