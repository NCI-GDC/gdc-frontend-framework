# Analysis Center - Tool Text
Date Created    : 06/16/2023
Version			: 1.0
Owner		    : GDC QA
Description		: Analysis Tool and Core Tool text
Test-Case       : PEAR-475

tags: gdc-data-portal-v2, navigation, analysis-center

## Tool Text Test Begin
* On GDC Data Portal V2 app
* Navigate to "Cohort" from "Header" "section"

## Validate 0 Cases Tooltip
* Wait for cohort bar case count loading spinner
* Search in a filter card from "Demographic" tab on the Cohort Builder page
  |facet_name       |label                |text  |
  |-----------------|---------------------|------|
  |Age at Diagnosis |input from value     |90    |
* Activate the following objects from "Demographic" tab on the Cohort Builder page
  |facet_name       |selection            |
  |-----------------|---------------------|
  |Age at Diagnosis |Apply                |
* Wait for cohort bar case count loading spinner
* Navigate to "Analysis" from "Header" "section"
* Validate analysis tool tooltip
  |tool_name                |tooltip_description                                                        |
  |-------------------------|---------------------------------------------------------------------------|
  |Clinical Data Analysis   |Current cohort does not have cases available for visualization.            |
  |Cohort Comparison        |Current cohort does not have cases available for visualization.            |
  |Mutation Frequency       |Current cohort does not have SSM data available for visualization.         |
  |OncoMatrix               |Current cohort does not have SSM or CNV data available for visualization.  |
  |ProteinPaint             |Current cohort does not have SSM data available for visualization.         |
  |Sequence Reads           |Current cohort does not have available BAMs for visualization.             |
* Select "Clear All"

## Validate Analysis Tools Description
* Validate analysis tool description
  |tool_name                |tool_description                                                                                                               |
  |-------------------------|-------------------------------------------------------------------------------------------------------------------------------|
  |Clinical Data Analysis   |Use clinical variables to perform basic statistical analysis of your cohort.                                                   |
  |Cohort Comparison        |Display the survival analysis of your cohorts and compare characteristics such as gender, vital status and age at diagnosis.   |
  |Mutation Frequency       |Visualize most frequently mutated genes and somatic mutations.                                                                 |
  |OncoMatrix               |Visualize the top most mutated cases and genes affected by high impact mutations in your cohort.                               |
  |ProteinPaint             |Visualize mutations in protein-coding genes by consequence type and protein domain.                                            |
  |Sequence Reads           |Visualize sequencing reads for a given gene, position, SNP, or variant.                                                        |
  |Set Operations           |Display a Venn diagram and compare/contrast your cohorts or sets of the same type.                                             |

## Validate Core Tools Description
* Is text "View the Projects available within the GDC and select them for further exploration and analysis." present on the page
* Is text "Build and define your custom cohorts using a variety of clinical and biospecimen features." present on the page
* Is text "Browse and download the files associated with your cohort for more sophisticated analysis." present on the page
