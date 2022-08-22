export * from "./store";
export * from "./provider";
export * from "./hooks";
export * from "./dataAccess";
export * from "./ts-utils";
export * from "./constants";
export * from "./features/gdcapi/gdcapi";
export * from "./features/gdcapi/filters";
export * from "./features/gdcapi/gdcgraphql";
export * from "./features/imageDetails/imageDetailsSlice";
export * from "./features/imageDetails/imageViewer";
export * from "./features/facets/facetSlice";
export * from "./features/facets/types";
export * from "./features/facets/facetApiGQL";
export * from "./features/facets/facetSliceGQL";
export * from "./features/facets/continuousAggregationSlice";
export * from "./features/facets/facetDictionaryApi";
export * from "./features/facets/facetDictionarySlice";
export * from "./features/facets/usefulFacetsSlice";
export * from "./features/gdcapps/gdcAppsSlice";
export * from "./features/gdcapps/GdcApp";
export * from "./features/files/filesSlice";
export * from "./features/files/filesHooks";
export * from "./features/projects/projectsSlice";
export * from "./features/projects/projectsHooks";
export * from "./features/annotations/annotationsSlice";
export * from "./features/annotations/annotationsHooks";
export * from "./features/history/historySlice";
export * from "./features/history/historyHooks";
export * from "./features/cases/casesSlice";
export * from "./features/cohort/cohortBuilderConfigSlice";
export * from "./features/cohort/cohortSlice";
export * from "./features/cohort/cohortFilterSlice";
export * from "./features/cohort/cohortNameSlice";
export * from "./features/cohort/availableCohortsSlice";
export * from "./features/cohort/comparisonCohortsSlice";
export * from "./features/cohort/countSlice";
export * from "./features/summary/totalCountsSlice";
export * from "./features/genomic/ssmsTableSlice";
export * from "./features/genomic/genesTableSlice";
export * from "./features/genomic/genesFrequencyChartSlice";
export * from "./features/genomic/genomicFilters";
export * from "./features/genomic/topGenesSSMSSlice";
export * from "./features/cancerDistribution/ssmPlot";
export * from "./features/cancerDistribution/cnvPlot";
export * from "./features/survival/survivalSlice";
export * from "./features/oncoGrid/oncoGridSlice";
export * from "./features/cohortComparison";
export * from "./features/biospecimen/biospecimenSlice";
export * from "./features/cart";
export * from "./features/api/cohortApiSlice";
export * from "./features/bannerNotification";
export * from "./features/clinicalDataAnalysis";
export * from "./features/cases/caseSummarySlice";
export * from "./features/genomic/ssmsSummary/ssmsSummarySlice";
export * from "./features/genomic/geneSummary/geneSummarySlice";
export * from "./features/facets/facetsByNameTypeAndFilter";


import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: '3faf9c0a-311f-4935-a596-3347666ef35d',
    clientToken: 'pub9f7e31eaacd4afa71ac5161cbd5b0c11',
    site: 'datadoghq.com',
    service:'portal-2.0',
    
    // Specify a version number to identify the deployed version of your application in Datadog 
    // version: '1.0.0',
    sampleRate: 100,
    premiumSampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel:'mask-user-input'
});
    
datadogRum.startSessionReplayRecording();