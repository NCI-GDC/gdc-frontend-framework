import { useDispatch, useSelector, useStore } from "react-redux";
import { CoreDispatch, CoreStore, CoreState } from "./store";

/**
 * Custom react-redux hooks that use the core store
 * @category Hooks
 * @example
 * ```typescript
 * import {useCoreSelector,  selectCurrentFilters } from '@gff/core';
 *
 * const currentFilters = useSelector(selectCurrentCohortFilters);
 * ```
 */
export const useCoreSelector = useSelector.withTypes<CoreState>();

/**
 * Custom react-redux hooks for dispatching Core actions
 * @category Hooks
 */
export const useCoreDispatch = useDispatch.withTypes<CoreDispatch>();

/**
 * Custom hooks for accessing the Core store
 * @category Hooks
 */
export const useCoreStore = useStore.withTypes<CoreStore>();
