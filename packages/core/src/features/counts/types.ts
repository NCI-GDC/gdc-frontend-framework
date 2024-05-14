// import { FilterSet } from "../cohort";

export type CountQueryResponse = {
  count: number; // return count or -1 if not loaded
  isFetching: boolean; // return true if fetching
  isError: boolean; // return true if error
  isSuccess: boolean; // return true if success
};

export type CountHook = () => any;

export type CountHookMap = { [key: string]: CountHook };
